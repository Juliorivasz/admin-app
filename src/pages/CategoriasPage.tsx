import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategorias, createCategoria, updateCategoria, toggleEstadoCategoria } from '../services/categoriaService';
import CategoriaTreeView from '../components/ui/CategoriaTreeView';
import { Toggle } from '../components/ui/Toggle';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { GenericWizardForm, type FormFieldConfig } from '../components/forms/GenericWizardForm';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';

import type { CategoriaCreate } from '../types';

const CategoriasPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [categoriaToDelete, setCategoriaToDelete] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [showInactivos, setShowInactivos] = useState(false);

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ['categorias', searchText, showInactivos],
    queryFn: () => getCategorias(searchText || undefined, showInactivos || undefined),
  });

  const { data: allCategorias } = useQuery({
    queryKey: ['categorias-all'],
    queryFn: () => getCategorias(),
  });

  const filteredData = useMemo(() => {
    if (!categorias) return [];
    return showInactivos
      ? categorias.filter((c: any) => c.deleted_at !== null)
      : categorias.filter((c: any) => !c.deleted_at);
  }, [categorias, showInactivos]);

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); setIsModalOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: toggleEstadoCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const parentOptions = useMemo(() => {
    if (!allCategorias) return [];

    const map = new Map();
    allCategorias.forEach((c: any) => map.set(c.id, { ...c, children: [] }));
    const roots: any[] = [];
    allCategorias.forEach((c: any) => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).children.push(map.get(c.id));
      } else {
        roots.push(map.get(c.id));
      }
    });

    const options: { label: string; value: number }[] = [];
    function traverse(nodes: any[], depth: number) {
      nodes.forEach(n => {
        // Evitar que una categoría sea padre de sí misma o de sus descendientes
        if (selectedItem && n.id === selectedItem.id) return;

        const prefix = depth > 0 ? '—'.repeat(depth) + ' ' : '';
        options.push({ label: prefix + n.nombre, value: n.id });
        traverse(n.children, depth + 1);
      });
    }
    traverse(roots, 0);
    return options;
  }, [allCategorias, selectedItem]);


  const formFields: FormFieldConfig<CategoriaCreate>[] = useMemo(() => [
    { name: 'nombre', label: 'Nombre de Categoría', type: 'text', step: 0, required: true, placeholder: 'Ej: Pizzas' },
    { name: 'descripcion', label: 'Descripción (Opcional)', type: 'textarea', step: 0, placeholder: 'Ej: Pizzas caseras a la piedra' },
    { name: 'imagen_url', label: 'URL de Imagen (Opcional)', type: 'text', step: 0, placeholder: 'https://ejemplo.com/imagen.jpg' },
    { name: 'parent_id' as any, label: 'Categoría Padre (Opcional)', type: 'select', step: 0, options: parentOptions },
  ], [parentOptions]);

  const closeModal = () => { setIsModalOpen(false); setSelectedItem(null); setModalMode('create'); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        subtitle="Clasificación jerárquica del menú"
        onNew={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
        newLabel="Nueva Categoría"
      />

      <FilterBar
        search={searchText}
        onSearchChange={setSearchText}
        hasActiveFilters={searchText !== '' || showInactivos}
        onClear={() => { setSearchText(''); setShowInactivos(false); }}
      >
        <Toggle size="sm" label="Mostrar inactivos" checked={showInactivos} onChange={setShowInactivos} />
      </FilterBar>

      <QueryStateWrapper isLoading={isLoading} isError={isError} errorMsg="Error al cargar categorías.">
        <CategoriaTreeView
          data={filteredData}
          onRowClick={(row) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
        />
      </QueryStateWrapper>

      <GenericWizardForm<CategoriaCreate>
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Crear Categoría' : selectedItem?.nombre || 'Detalles'}
        stepNames={['Detalles de la Categoría']}
        fields={formFields}
        defaultValues={selectedItem || { nombre: '', descripcion: '', imagen_url: '', parent_id: null }}
        isViewMode={modalMode === 'view'}
        onEnableEdit={() => setModalMode('edit')}
        headerActions={
          selectedItem && modalMode === 'view' ? (
            <Toggle
              size="sm"
              label={selectedItem.deleted_at ? 'Inactivo' : 'Activo'}
              checked={!selectedItem.deleted_at}
              onChange={() => {
                if (!selectedItem.deleted_at) {
                  setCategoriaToDelete(selectedItem);
                } else {
                  toggleEstadoMutation.mutate(selectedItem.id);
                  setSelectedItem({ ...selectedItem, deleted_at: null });
                }
              }}
            />
          ) : null
        }
        onSubmit={async (values) => {
          if (modalMode === 'edit' && selectedItem) {
            await updateMutation.mutateAsync({ id: selectedItem.id, data: values });
            closeModal();
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!categoriaToDelete}
        onClose={() => setCategoriaToDelete(null)}
        onConfirm={() => {
          toggleEstadoMutation.mutate(categoriaToDelete?.id);
          setSelectedItem({ ...categoriaToDelete, deleted_at: new Date().toISOString() });
          setCategoriaToDelete(null);
        }}
        title="Alerta de Baja"
        confirmText="Sí, Desactivar"
        message={<>¿Seguro que deseas dar de baja la categoría <strong className="text-text">{categoriaToDelete?.nombre}</strong>?</>}
      />
    </div>
  );
};

export default CategoriasPage;
