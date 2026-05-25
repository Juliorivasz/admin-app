import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducto, updateProducto } from '../services/productoService';
import { getIngredientes } from '../services/ingredienteService';
import { getCategorias } from '../services/categoriaService';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import QueryStateWrapper from '../components/ui/QueryStateWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import StockBadge from '../components/ui/StockBadge';
import RelacionItemRow from '../components/ui/RelacionItemRow';
import AddIngredienteForm from '../components/producto/AddIngredienteForm';
import AddCategoriaForm from '../components/producto/AddCategoriaForm';

const ProductoDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const productoId = parseInt(id || '0');

  const [modalIngrediente, setModalIngrediente] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', productoId],
    queryFn: () => getProducto(productoId),
    enabled: !!productoId,
  });

  const { data: todosIngredientes = [] } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: () => getIngredientes(),
  });

  const { data: todasCategorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getCategorias(),
  });

  const updateMutation = useMutation({
    mutationFn: updateProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producto', productoId] });
      setModalIngrediente(false);
      setModalCategoria(false);
    },
  });

  // Helpers para construir payloads
  const ingPayload = () => producto?.ingredientes.map(i => (i as any).ingrediente_id || i) || [];
  const catPayload = () => producto?.categorias.map(c => (c as any).categoria_id || c) || [];

  const handleAddIngrediente = (ingrediente_id: number) => {
    updateMutation.mutate({ id: productoId, data: { ingredientes: [...ingPayload(), ingrediente_id] } });
  };

  const handleRemoveIngrediente = (ingredienteId: number) => {
    updateMutation.mutate({ id: productoId, data: { ingredientes: ingPayload().filter(i => i !== ingredienteId) } });
  };

  const handleAddCategoria = (categoria_id: number) => {
    const categorias = [...catPayload(), categoria_id];
    updateMutation.mutate({ id: productoId, data: { categorias } });
  };

  const handleRemoveCategoria = (categoriaId: number) => {
    updateMutation.mutate({ id: productoId, data: { categorias: catPayload().filter(c => c !== categoriaId) } });
  };

  if (isLoading || isError || !producto) {
    return (
      <QueryStateWrapper isLoading={isLoading} isError={isError || !producto} errorMsg="Error al cargar el producto.">
        <></>
      </QueryStateWrapper>
    );
  }

  const categoriaPrincipal = producto.categorias.find(c => c.es_principal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
        <Link to="/productos" className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-2 mb-6 w-fit">
          &larr; Volver a Productos
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-text">{producto.name}</h1>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20">
                ${producto.price.toFixed(2)}
              </span>
              <StatusBadge variant={producto.disponible ? 'disponible' : 'no-disponible'} />
              <StockBadge cantidad={producto.stock_cantidad} unidad="uds" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-text-muted font-semibold">Categoría Principal</span>
            <p className="text-lg font-medium text-text mt-1">{categoriaPrincipal?.nombre || 'Ninguna'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Ingredientes */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-surface-2/30">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Ingredientes</h2>
              <p className="text-text-muted text-sm">Composición del producto</p>
            </div>
            <Button size="sm" onClick={() => setModalIngrediente(true)}>+ Añadir</Button>
          </div>
          <div className="flex-1 p-6">
            {producto.ingredientes.length === 0 ? (
              <div className="text-center py-10 text-text-muted border border-dashed border-border rounded-xl">Sin ingredientes asignados</div>
            ) : (
              <ul className="space-y-1">
                {producto.ingredientes.map((ing: any) => (
                  <RelacionItemRow key={ing.ingrediente_id || ing} onRemove={() => handleRemoveIngrediente(ing.ingrediente_id || ing)} isPending={updateMutation.isPending}>
                    <span className="font-medium text-text">{ing.name || ing.nombre}</span>
                    {ing.esAlergeno && <StatusBadge variant="alergeno" />}
                  </RelacionItemRow>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Panel Categorías */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-surface-2/30">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Categorías</h2>
              <p className="text-text-muted text-sm">Principal y adicionales</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setModalCategoria(true)}>+ Asignar</Button>
          </div>
          <div className="flex-1 p-6">
            {producto.categorias.length === 0 ? (
              <div className="text-center py-10 text-text-muted border border-dashed border-border rounded-xl">Sin categorías asignadas</div>
            ) : (
              <div className="space-y-1">
                {producto.categorias.map((cat: any) => (
                  <RelacionItemRow key={cat.id || cat.categoria_id} onRemove={() => handleRemoveCategoria(cat.id || cat.categoria_id)} isPending={updateMutation.isPending}>
                    <span className="font-medium text-text">{cat.nombre}</span>
                  </RelacionItemRow>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal isOpen={modalIngrediente} onClose={() => setModalIngrediente(false)} title="Añadir Ingrediente">
        <AddIngredienteForm
          todosIngredientes={todosIngredientes}
          ingredientesActuales={producto.ingredientes}
          isPending={updateMutation.isPending}
          onSubmit={handleAddIngrediente}
          onCancel={() => setModalIngrediente(false)}
        />
      </Modal>

      <Modal isOpen={modalCategoria} onClose={() => setModalCategoria(false)} title="Asignar Categoría">
        <AddCategoriaForm
          todasCategorias={todasCategorias}
          categoriasActuales={producto.categorias}
          isPending={updateMutation.isPending}
          onSubmit={handleAddCategoria}
          onCancel={() => setModalCategoria(false)}
        />
      </Modal>
    </div>
  );
};

export default ProductoDetallePage;
