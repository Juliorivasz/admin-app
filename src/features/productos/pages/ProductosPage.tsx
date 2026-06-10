import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productoService';
import { getCategorias } from '../../categorias/services/categoriaService';
import { DataTable } from '../../../components/ui/DataTable';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import PageHeader from '../../../components/ui/PageHeader';
import FilterBar from '../../../components/ui/FilterBar';
import QueryStateWrapper from '../../../components/ui/QueryStateWrapper';
import StatusBadge from '../../../components/ui/StatusBadge';
import StockBadge from '../../../components/ui/StockBadge';
import { Toggle } from '../../../components/ui/Toggle';
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
  const [disponibleFilter, setDisponibleFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [stockFilter, setStockFilter] = useState<'todos' | 'agotado' | 'bajo'>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<number | ''>('');
  const [showInactivos, setShowInactivos] = useState(false);

  // ── Queries ─────────────────────────────────────────────────────────
  const { data: categoriasData } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getCategorias(),
  });

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['productos', searchText, disponibleFilter, stockFilter, categoriaFilter, showInactivos],
    queryFn: () => getProductos({
      search: searchText || undefined,
      disponible: disponibleFilter === 'activos' ? true : disponibleFilter === 'inactivos' ? false : undefined,
      stock_status: stockFilter !== 'todos' ? stockFilter : undefined,
      categoria_id: categoriaFilter !== '' ? categoriaFilter : undefined,
      include_inactivos: showInactivos,
    }),
  });

  const filteredData = useMemo(() => {
    const data = productos || [];
    return showInactivos
      ? data.filter((p: any) => p.deleted_at !== null)
      : data.filter((p: any) => !p.deleted_at);
  }, [productos, showInactivos]);

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
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
        hasActiveFilters={searchText !== '' || disponibleFilter !== 'todos' || stockFilter !== 'todos' || categoriaFilter !== ''}
        onClear={() => { setSearchText(''); setDisponibleFilter('todos'); setStockFilter('todos'); setCategoriaFilter(''); }}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Disponibilidad */}
          <select
            value={disponibleFilter}
            onChange={(e) => setDisponibleFilter(e.target.value as any)}
            className="bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text py-[9px] px-3 hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activos">Disponibles</option>
            <option value="inactivos">Inactivos</option>
          </select>

          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text py-[9px] px-3 hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="todos">Todo el Stock</option>
            <option value="bajo">Bajo Stock (≤5)</option>
            <option value="agotado">Agotado (0)</option>
          </select>

          {/* Categoría */}
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text py-[9px] px-3 hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[150px]"
          >
            <option value="">Todas las Categorías</option>
            {categoriasData?.map((cat: any) => (
              <option key={cat.id} value={cat.id} className="text-white">{cat.nombre}</option>
            ))}
          </select>
          <div className="flex items-center ml-2">
            <Toggle size="sm" label="Mostrar Inactivos" checked={showInactivos} onChange={setShowInactivos} />
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
        headerActions={
          selectedItem && modalMode === 'view' ? (
            <Toggle
              size="sm"
              label={selectedItem.deleted_at ? 'Restaurar / Inactivo' : 'Activo'}
              checked={!selectedItem.deleted_at}
              onChange={() => {
                if (!selectedItem.deleted_at) {
                  setProductoToToggle(selectedItem);
                } else {
                  // reactivate
                  updateMutation.mutate({ id: selectedItem.id, data: { activo: true } as any });
                  setSelectedItem({ ...selectedItem, deleted_at: null });
                }
              }}
            />
          ) : null
        }
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
