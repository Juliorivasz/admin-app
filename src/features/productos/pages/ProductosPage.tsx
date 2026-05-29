import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productoService';
import { DataTable } from '../../../components/ui/DataTable';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import PageHeader from '../../../components/ui/PageHeader';
import FilterBar from '../../../components/ui/FilterBar';
import QueryStateWrapper from '../../../components/ui/QueryStateWrapper';
import StatusBadge from '../../../components/ui/StatusBadge';
import StockBadge from '../../../components/ui/StockBadge';
import ProductoFormModal from '../components/ProductoFormModal';
import type { ColumnDef } from '@tanstack/react-table';


/**
 * Función helper para derivar la variante del StatusBadge.
 */
function getProductoStatusVariant(row: any): 'dado-de-baja' | 'agotado' | 'stock-bajo' | 'disponible' {
  if (row.deleted_at)            return 'dado-de-baja';
  if (row.stock_cantidad === 0)  return 'agotado';
  if (row.stock_cantidad <= 5)   return 'stock-bajo';
  return 'disponible';
}

// Helper de iconos removido según indicación de usar imágenes reales en su lugar.

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
    if (precioMin) result = result.filter((p: any) => p.price >= parseFloat(precioMin));
    if (precioMax) result = result.filter((p: any) => p.price <= parseFloat(precioMax));
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

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  });

  // ── Columnas de tabla ────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    {
      id: 'imagen',
      header: 'Imagen',
      cell: (info) => {
        const url = info.row.original.imagen_url;
        const nombre = (info.row.original.name || '').toLowerCase();
        
        return (
          <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-2 border border-border flex items-center justify-center shrink-0">
            {url ? (
              <img 
                src={url} 
                alt={info.row.original.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <img 
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${nombre}&backgroundColor=1D1E2C`} 
                alt={info.row.original.name} 
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Producto',
      cell: (info) => (
        <span className="font-medium text-text text-[14px]">
          {info.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Precio Base',
      cell: (info) => (
        <span className="text-text text-[14px]">
          ${info.getValue<number>().toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'stock_cantidad',
      header: 'Stock',
      cell: (info) => <StockBadge cantidad={info.getValue<number>()} />,
    },
    {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge variant={getProductoStatusVariant(row.original)} />
      ),
    },
  ], []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalMode('create');
  };

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
      {/* ── Page Header ── */}
      <PageHeader
        title="Productos"
        subtitle="Administración del catálogo, precios y disponibilidad"
        onNew={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
        newLabel="Nuevo Producto"
      />

      {/* ── Filter Bar ── */}
      <FilterBar
        search={searchText}
        onSearchChange={setSearchText}
        placeholder="Buscar por nombre..."
        hasActiveFilters={searchText !== '' || showInactivos || precioMin !== '' || precioMax !== ''}
        onClear={() => { setSearchText(''); setShowInactivos(false); setPrecioMin(''); setPrecioMax(''); }}
      >
        {/* Filtros de Precio: $ Mín — $ Máx */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[13px] pointer-events-none">
              $
            </span>
            <input
              type="number"
              placeholder="Mín"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-20 bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text placeholder:text-text-muted/60 pl-7 pr-3 py-[9px] hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <span className="text-text-muted font-light px-1">—</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[13px] pointer-events-none">
              $
            </span>
            <input
              type="number"
              placeholder="Máx"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-20 bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text placeholder:text-text-muted/60 pl-7 pr-3 py-[9px] hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </FilterBar>

      {/* ── Products Table ── */}
      <QueryStateWrapper isLoading={isLoading} isError={isError} errorMsg="Error al cargar los productos.">
        <DataTable
          columns={columns}
          data={filteredData}
          itemLabel="productos"
          onRowClick={(row) => { setSelectedItem(row); setModalMode('view'); setIsModalOpen(true); }}
          rowClassName={(row: any) => row.deleted_at ? 'opacity-50' : ''}
        />
      </QueryStateWrapper>

      {/* ── Modals ── */}
      <ProductoFormModal
        key={selectedItem?.id ?? 'create'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Nuevo Producto' : selectedItem?.name ?? 'Detalles'}
        defaultValues={selectedItem ?? {
          name: '',
          price: 0,
          stock_cantidad: 0,
          disponible: true,
          categorias: [],
          ingredientes: [],
        }}
        isViewMode={modalMode === 'view'}
        onEnableEdit={() => setModalMode('edit')}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!productoToToggle}
        onClose={() => setProductoToToggle(null)}
        onConfirm={() => {
          deleteMutation.mutate(productoToToggle?.id);
          setSelectedItem({ ...productoToToggle, deleted_at: new Date().toISOString(), disponible: false });
          setProductoToToggle(null);
        }}
        title="Ocultar de Catálogo"
        confirmText="Sí, Ocultar"
        message={
          <>
            ¿Seguro que deseas desactivar <strong className="text-text">{productoToToggle?.name}</strong>?
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
