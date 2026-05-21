import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente } from '../services/ingredienteService';
import { DataTable } from '../components/ui/DataTable';
import { GenericWizardForm, type FormFieldConfig } from '../components/forms/GenericWizardForm';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import StockBadge from '../components/ui/StockBadge';
import type { IngredienteCreate } from '../types';
import type { ColumnDef } from '@tanstack/react-table';

const IngredientesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [searchText, setSearchText] = useState('');
  const [alergenoFilter, setAlergenoFilter] = useState('');

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ['ingredientes', searchText],
    queryFn: () => getIngredientes(searchText || undefined),
  });

  const filteredData = useMemo(() => {
    if (!ingredientes) return [];
    if (alergenoFilter === 'si') return ingredientes.filter((i: any) => i.es_alergeno);
    if (alergenoFilter === 'no') return ingredientes.filter((i: any) => !i.es_alergeno);
    return ingredientes;
  }, [ingredientes, alergenoFilter]);

  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); setIsModalOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: updateIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  });

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: (info) => <span className="font-medium text-text">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: (info) => <span className="text-text-muted">{info.getValue<string>() || '-'}</span>,
    },
    {
      id: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <StockBadge cantidad={row.original.cantidad ?? 0} unidad={row.original.unidad_medida || 'unidad'} />
      ),
    },
    {
      accessorKey: 'es_alergeno',
      header: 'Alérgeno',
      cell: (info) => <StatusBadge variant={info.getValue<boolean>() ? 'alergeno' : 'no-alergeno'} />,
    },
  ], []);

  const formFields: FormFieldConfig<IngredienteCreate>[] = [
    { name: 'nombre', label: 'Nombre del Ingrediente', description: 'Identificador único del insumo.', type: 'text', step: 0, required: true, placeholder: 'Ej: Harina' },
    { name: 'descripcion', label: 'Descripción (Opcional)', description: 'Detalles adicionales, marca o proveedor.', type: 'textarea', step: 0, placeholder: 'Ej: Harina de trigo 000' },
    { name: 'cantidad' as any, label: 'Cantidad en Stock', description: 'Cantidad disponible actualmente.', type: 'number', step: 0, required: true, placeholder: 'Ej: 5.5' },
    {
      name: 'unidad_medida' as any, label: 'Unidad de Medida', description: 'Unidad con la que se mide este ingrediente.', type: 'select', step: 0, required: true,
      options: [
        { value: 'kg', label: 'Kilogramo (kg)' }, { value: 'g', label: 'Gramo (g)' },
        { value: 'l', label: 'Litro (l)' }, { value: 'ml', label: 'Mililitro (ml)' },
        { value: 'unidad', label: 'Unidad' }, { value: 'porción', label: 'Porción' },
      ],
    },
    { name: 'es_alergeno' as any, label: '¿Es un alérgeno?', description: 'Marcar si este ingrediente puede causar reacciones alérgicas.', type: 'checkbox', step: 0 },
  ];

  const closeModal = () => { setIsModalOpen(false); setSelectedItem(null); setModalMode('create'); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingredientes"
        subtitle="Gestión de inventario y stock base"
        newClassName="bg-orange-500 hover:bg-orange-600"
        onNew={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
        newLabel="Nuevo Ingrediente"
      />

      <FilterBar
        search={searchText}
        onSearchChange={setSearchText}
        hasActiveFilters={searchText !== '' || alergenoFilter !== ''}
        onClear={() => { setSearchText(''); setAlergenoFilter(''); }}
      >
        <select
          value={alergenoFilter}
          onChange={(e) => setAlergenoFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        >
          <option value="">Alérgeno: Todos</option>
          <option value="si">Solo Alérgenos</option>
          <option value="no">No Alérgenos</option>
        </select>
      </FilterBar>

      <QueryStateWrapper isLoading={isLoading} isError={isError} errorMsg="Error al cargar los ingredientes.">
        <DataTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
        />
      </QueryStateWrapper>

      <GenericWizardForm<IngredienteCreate>
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Crear Ingrediente' : selectedItem?.nombre || 'Detalles'}
        stepNames={['Detalles del Ingrediente']}
        fields={formFields}
        defaultValues={selectedItem || { nombre: '', descripcion: '', es_alergeno: false, cantidad: 0, unidad_medida: 'unidad' }}
        isViewMode={modalMode === 'view'}
        onEnableEdit={() => setModalMode('edit')}
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
    </div>
  );
};

export default IngredientesPage;
