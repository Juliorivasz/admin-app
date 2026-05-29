import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, createUsuario, updateUsuario } from '../services/usuarioService';
import { DataTable } from '../components/ui/DataTable';
import { GenericWizardForm, type FormFieldConfig } from '../components/forms/GenericWizardForm';

import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';
import type { ColumnDef } from '@tanstack/react-table';

const UsuariosPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [searchText, setSearchText] = useState('');
  const [rolFilter, setRolFilter] = useState('');

  // ── Queries ─────────────────────────────────────────────────────────
  const { data: usuarios, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  const filteredData = useMemo(() => {
    let data: any[] = Array.isArray(usuarios) ? usuarios : [];

    if (searchText) {
      data = data.filter((u: any) => 
        u.name?.toLowerCase().includes(searchText.toLowerCase()) || 
        u.lastname?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    // Nota: El backend actualmente no devuelve los roles en el listado base,
    // así que este filtro podría no funcionar hasta que el backend se actualice.
    if (rolFilter) {
      data = data.filter((u: any) => u.roles?.includes(rolFilter));
    }
    return data;
  }, [usuarios, searchText, rolFilter]);

  // ── Mutations ────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      closeModal();
    },
  });



  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Nombre Completo',
      cell: (info) => <span className="font-medium text-text">{info.row.original.name} {info.row.original.lastname}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => <span className="text-text-muted">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'roles',
      header: 'Roles Asignados',
      cell: (info) => {
        const roles = info.getValue<string[]>() || [];
        if (roles.length === 0) {
          return <span className="text-text-muted text-[11px] italic">Sin roles visibles</span>;
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            {roles.map(rol => {
              let color = 'bg-gray-500/20 text-gray-300';
              if (rol === 'ADMIN') color = 'bg-red-500/20 text-red-400';
              if (rol === 'PEDIDOS') color = 'bg-blue-500/20 text-blue-400';
              if (rol === 'STOCK') color = 'bg-purple-500/20 text-purple-400';
              if (rol === 'CLIENT') color = 'bg-amber-500/20 text-amber-400';
              
              return (
                <span key={rol} className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider ${color}`}>
                  {rol}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone_number',
      header: 'Teléfono',
      cell: (info) => <span className="text-text-muted">{info.getValue<number>() || '-'}</span>,
    },
  ], []);

  const formFields: FormFieldConfig<any>[] = [
    { name: 'name', label: 'Nombre', type: 'text', step: 0, required: true },
    { name: 'lastname', label: 'Apellido', type: 'text', step: 0, required: true },
    { name: 'email', label: 'Correo Electrónico', type: 'text', step: 0, required: true },
    { name: 'phone_number', label: 'Celular (Opcional)', type: 'number', step: 0 },
    { name: 'esAdmin', label: 'Administrador (Control Total)', type: 'checkbox', step: 0 },
    { name: 'esPedidos', label: 'Encargado de Pedidos', type: 'checkbox', step: 0, hidden: (values: any) => values.esAdmin },
    { name: 'esStock', label: 'Encargado de Stock', type: 'checkbox', step: 0, hidden: (values: any) => values.esAdmin },
  ];

  if (modalMode === 'create') {
    formFields.push({ name: 'password_hash', label: 'Contraseña Temporal', type: 'text', step: 0, required: true });
  }

  const closeModal = () => { setIsModalOpen(false); setSelectedItem(null); setModalMode('create'); };

  const getFormValues = () => {
    if (!selectedItem) {
      return { name: '', lastname: '', email: '', phone_number: '', password_hash: '', esAdmin: false, esPedidos: false, esStock: false, esClient: false };
    }
    return {
      ...selectedItem,
      esAdmin: selectedItem.roles?.includes('ADMIN') || false,
      esPedidos: selectedItem.roles?.includes('PEDIDOS') || false,
      esStock: selectedItem.roles?.includes('STOCK') || false,
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        subtitle="Administra los accesos y roles del personal"
        newClassName="bg-primary hover:bg-primary/90"
        onNew={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
        newLabel="Nuevo Empleado"
      />

      <FilterBar
        search={searchText}
        onSearchChange={setSearchText}
        hasActiveFilters={searchText !== '' || rolFilter !== ''}
        onClear={() => { setSearchText(''); setRolFilter(''); }}
      >
        <select
          value={rolFilter}
          onChange={(e) => setRolFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        >
          <option value="">Roles: Todos</option>
          <option value="ADMIN">Administradores</option>
          <option value="PEDIDOS">Encargado Pedidos</option>
          <option value="STOCK">Encargado Stock</option>
        </select>
      </FilterBar>

      <QueryStateWrapper isLoading={isLoading} isError={isError} errorMsg="Error al cargar usuarios">
        <DataTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
        />
      </QueryStateWrapper>

      <GenericWizardForm<any>
        key={isModalOpen ? (selectedItem?.id ?? 'create-open') : 'closed'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Alta de Empleado' : `${selectedItem?.name} ${selectedItem?.lastname}`}
        stepNames={['Datos Personales y Rol']}
        fields={formFields}
        defaultValues={getFormValues()}
        isViewMode={modalMode === 'view'}
        onEnableEdit={() => setModalMode('edit')}
        onSubmit={async (values) => {
          const roles = [];
          if (values.esAdmin) {
            roles.push('ADMIN');
          } else {
            if (values.esPedidos) roles.push('PEDIDOS');
            if (values.esStock) roles.push('STOCK');
          }
          
          const finalData = {
            ...values,
            roles,
            phone_number: values.phone_number ? parseInt(values.phone_number) : null
          };
          delete finalData.esAdmin;
          delete finalData.esPedidos;
          delete finalData.esStock;

          if (modalMode === 'edit' && selectedItem) {
            await updateMutation.mutateAsync({ id: selectedItem.id, data: finalData });
          } else {
            await createMutation.mutateAsync(finalData);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default UsuariosPage;
