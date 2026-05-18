import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductos, createProducto, updateProducto, toggleEstadoProducto } from '../services/productoService';
import { DataTable } from '../components/ui/DataTable';
import { Toggle } from '../components/ui/Toggle';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import StockBadge from '../components/ui/StockBadge';
import ProductoFormModal from '../components/producto/ProductoFormModal';
import type { ColumnDef } from '@tanstack/react-table';

const ProductosPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [productoToToggle, setProductoToToggle] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [showInactivos, setShowInactivos] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  // ── Queries ─────────────────────────────────────────────────────────
  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['productos', searchText, showInactivos],
    queryFn: () => getProductos(searchText || undefined, undefined, showInactivos || undefined),
  });

  const filteredData = useMemo(() => {
    if (!productos) return [];
    let result = showInactivos
      ? productos.filter((p: any) => p.deleted_at !== null)
      : productos.filter((p: any) => !p.deleted_at);
    if (precioMin) result = result.filter((p: any) => p.precio_base >= parseFloat(precioMin));
    if (precioMax) result = result.filter((p: any) => p.precio_base <= parseFloat(precioMax));
    return result;
  }, [productos, precioMin, precioMax, showInactivos]);

  // ── Mutations ────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: toggleEstadoProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  });

  // ── Columnas de tabla ────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    {
      accessorKey: 'nombre',
      header: 'Producto',
      cell: (info) => <span className="font-semibold text-text">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'precio_base',
      header: 'Precio Base',
      cell: (info) => <span className="text-primary font-bold">${info.getValue<number>().toFixed(2)}</span>,
    },
    {
      accessorKey: 'stock_cantidad',
      header: 'Stock',
      cell: (info) => <StockBadge cantidad={info.getValue<number>()} />,
    },
    {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => row.original.deleted_at
        ? <StatusBadge variant="dado-de-baja" />
        : <StatusBadge variant={row.original.disponible ? 'disponible' : 'no-disponible'} />,
    },
  ], []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalMode('create');
  };

  // ── Submit unificado: create o update, con categorías e ingredientes ──
  const handleSubmit = async (values: any) => {
    if (modalMode === 'edit' && selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, data: values });
      closeModal();
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        subtitle="Gestión del menú final"
        onNew={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
        newLabel="Nuevo Producto"
        newClassName="bg-gradient-to-r from-primary to-blue-500 hover:from-primary-hover hover:to-blue-600 border-0"
      />

      <FilterBar
        search={searchText}
        onSearchChange={setSearchText}
        hasActiveFilters={searchText !== '' || showInactivos || precioMin !== '' || precioMax !== ''}
        onClear={() => { setSearchText(''); setShowInactivos(false); setPrecioMin(''); setPrecioMax(''); }}
      >
        <div className="flex items-center gap-2">
          <input type="number" placeholder="$ Mín" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)}
            className="w-20 px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <span className="text-text-muted text-xs">—</span>
          <input type="number" placeholder="$ Máx" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)}
            className="w-20 px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <Toggle size="sm" label="Mostrar inactivos" checked={showInactivos} onChange={setShowInactivos} />
      </FilterBar>

      <QueryStateWrapper isLoading={isLoading} isError={isError} errorMsg="Error al cargar los productos.">
        <DataTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
          rowClassName={(row: any) => row.deleted_at ? 'opacity-50' : ''}
        />
      </QueryStateWrapper>

      {/* Modal de Producto con wizard de 3 pasos.
          key={selectedItem?.id ?? 'create'} → fuerza remount cuando cambia el producto,
          garantizando que el estado interno del form se reinicializa con los datos correctos. */}
      <ProductoFormModal
        key={selectedItem?.id ?? 'create'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Nuevo Producto' : selectedItem?.nombre ?? 'Detalles'}
        defaultValues={selectedItem ?? {
          nombre: '',
          descripcion: '',
          imagen_url: '',
          precio_base: 0,
          stock_cantidad: 0,
          disponible: true,
          categorias: [],
          ingredientes: [],
        }}
        isViewMode={modalMode === 'view'}
        onEnableEdit={() => setModalMode('edit')}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        headerActions={selectedItem && modalMode === 'view' ? (
          <div className="flex items-center gap-2 border-l border-border pl-3 ml-1">
            <Toggle
              size="sm"
              label={selectedItem.deleted_at ? 'Inactivo' : 'Activo'}
              checked={!selectedItem.deleted_at}
              onChange={() => {
                if (!selectedItem.deleted_at) setProductoToToggle(selectedItem);
                else {
                  toggleEstadoMutation.mutate(selectedItem.id);
                  setSelectedItem({ ...selectedItem, deleted_at: null, disponible: true });
                }
              }}
            />
          </div>
        ) : null}
      />

      <ConfirmModal
        isOpen={!!productoToToggle}
        onClose={() => setProductoToToggle(null)}
        onConfirm={() => {
          toggleEstadoMutation.mutate(productoToToggle?.id);
          setSelectedItem({ ...productoToToggle, deleted_at: new Date().toISOString(), disponible: false });
          setProductoToToggle(null);
        }}
        title="Ocultar de Catálogo"
        confirmText="Sí, Ocultar"
        message={
          <>
            ¿Seguro que deseas desactivar <strong className="text-text">{productoToToggle?.nombre}</strong>?
            <div className="mt-4 p-4 bg-surface-2 border border-border rounded-xl text-text-muted text-sm">
              Al desactivarlo dejará de ser visible para los clientes.
            </div>
          </>
        }
      />
    </div>
  );
};

export default ProductosPage;
