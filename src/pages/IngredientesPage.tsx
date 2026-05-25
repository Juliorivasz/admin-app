import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente } from '../services/ingredienteService';
import { DataTable } from '../components/ui/DataTable';
import { GenericWizardForm, type FormFieldConfig } from '../components/forms/GenericWizardForm';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';
import StatusBadge from '../components/ui/StatusBadge';
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
    if (alergenoFilter === 'si') return ingredientes.filter((i: any) => i.esAlergeno);
    if (alergenoFilter === 'no') return ingredientes.filter((i: any) => !i.esAlergeno);
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
      accessorKey: 'name',
      header: 'Nombre',
      cell: (info) => <span className="font-medium text-text">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: (info) => <span className="text-text-muted">{info.getValue<string>() || '-'}</span>,
    },
    {
      accessorKey: 'esAlergeno',
      header: 'Alérgeno',
      cell: (info) => <StatusBadge variant={info.getValue<boolean>() ? 'alergeno' : 'no-alergeno'} />,
    },
  ], []);

  const formFields: FormFieldConfig<IngredienteCreate>[] = [
    { name: 'name' as any, label: 'Nombre del Ingrediente', description: 'Identificador único del insumo.', type: 'text', step: 0, required: true, placeholder: 'Ej: Harina' },
    { name: 'description' as any, label: 'Descripción (Opcional)', description: 'Detalles adicionales, marca o proveedor.', type: 'textarea', step: 0, placeholder: 'Ej: Harina de trigo 000' },
    { name: 'esAlergeno' as any, label: '¿Es un alérgeno?', description: 'Marcar si este ingrediente puede causar reacciones alérgicas.', type: 'checkbox', step: 0 },
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
        key={isModalOpen ? (selectedItem?.id ?? 'create-open') : 'closed'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Crear Ingrediente' : selectedItem?.name || 'Detalles'}
        stepNames={['Detalles del Ingrediente']}
        fields={formFields}
        defaultValues={selectedItem || { name: '', description: '', esAlergeno: false }}
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
