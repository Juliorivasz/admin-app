import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService';
import CategoriaTreeView from '../../../components/ui/CategoriaTreeView';
import { Toggle } from '../../../components/ui/Toggle';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { GenericWizardForm, type FormFieldConfig } from '../../../components/forms/GenericWizardForm';
import PageHeader from '../../../components/ui/PageHeader';
import FilterBar from '../../../components/ui/FilterBar';
import QueryStateWrapper from '../../../components/ui/QueryStateWrapper';


import type { CategoriaCreate } from '../types/categoria';

const CategoriasPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [categoriaToDelete, setCategoriaToDelete] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [showInactivos, setShowInactivos] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);

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
    let result = showInactivos
      ? categorias.filter((c: any) => c.deleted_at !== null)
      : categorias.filter((c: any) => !c.deleted_at);

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((c: any) => c.nombre?.toLowerCase().includes(lowerSearch));
    }
    return result;
  }, [categorias, showInactivos, searchText]);

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['categorias'] }); 
      queryClient.invalidateQueries({ queryKey: ['categorias-all'] }); 
      setIsModalOpen(false); 
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-all'] });
    },
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
          onRowClick={(row: any) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
        />
      </QueryStateWrapper>

      <GenericWizardForm<CategoriaCreate>
        key={isModalOpen ? (selectedItem?.id ?? 'create-open') : 'closed'}
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
                  closeModal();
                } else {
                  updateMutation.mutate(
                    { id: selectedItem.id, data: { activo: true } as any },
                    {
                      onSuccess: () => {
                        setSelectedItem({ ...selectedItem, deleted_at: null });
                      },
                      onError: (error: any) => {
                        const msg = error.response?.data?.detail || error.message || "Error al activar";
                        setErrorModalMsg(msg);
                      }
                    }
                  );
                }
              }}
            />
          ) : null
        }
        onSubmit={async (values) => {
          const payload = { ...values };
          if ((payload.parent_id as any) === "" || payload.parent_id === null) {
            payload.parent_id = null;
          } else {
            payload.parent_id = parseInt(payload.parent_id as any, 10);
          }

          if (modalMode === 'edit' && selectedItem) {
            await updateMutation.mutateAsync({ id: selectedItem.id, data: payload });
            closeModal();
          } else {
            await createMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {categoriaToDelete && (
        <Modal isOpen={true} onClose={() => setCategoriaToDelete(null)} title="⚠️ Alerta de Baja" size="sm" footer={
          <div className="flex justify-end gap-3 w-full">
            <Button type="button" onClick={() => setCategoriaToDelete(null)} className="bg-surface-2 text-text hover:bg-surface border border-border">Cancelar</Button>
            {allCategorias?.some((c: any) => c.parent_id === categoriaToDelete.id && !c.deleted_at) ? (
              <>
                <Button type="button" onClick={() => {
                  updateMutation.mutate({ id: categoriaToDelete.id, data: { activo: false, estrategia_baja: 'promote' } as any });
                  setCategoriaToDelete(null);
                }} className="bg-warning hover:bg-warning/80 text-white border-0 text-xs px-2">Promover Hijos</Button>
                <Button type="button" onClick={() => {
                  updateMutation.mutate({ id: categoriaToDelete.id, data: { activo: false, estrategia_baja: 'cascade' } as any });
                  setCategoriaToDelete(null);
                }} className="bg-danger hover:bg-danger-hover text-white border-0 text-xs px-2">Desactivar Todo</Button>
              </>
            ) : (
              <Button type="button" onClick={() => {
                updateMutation.mutate({ id: categoriaToDelete.id, data: { activo: false } as any });
                setCategoriaToDelete(null);
              }} className="bg-danger hover:bg-danger-hover text-white border-0">Sí, Desactivar</Button>
            )}
          </div>
        }>
          <div className="text-text-muted">
            <p>¿Seguro que deseas dar de baja la categoría <strong className="text-text">{categoriaToDelete.nombre}</strong>?</p>
            {allCategorias?.some((c: any) => c.parent_id === categoriaToDelete.id && !c.deleted_at) && (
              <p className="mt-2 text-sm">Esta categoría tiene subcategorías. ¿Qué deseas hacer con ellas?</p>
            )}
          </div>
        </Modal>
      )}

      {errorModalMsg && (
        <Modal 
          isOpen={true} 
          onClose={() => setErrorModalMsg(null)} 
          title="⚠️ Error de Activación" 
          size="sm" 
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button type="button" onClick={() => setErrorModalMsg(null)} className="bg-primary text-white border-0 hover:bg-primary-hover">Entendido</Button>
            </div>
          }
        >
          <div className="text-text-muted">
            <p>{errorModalMsg}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoriasPage;
