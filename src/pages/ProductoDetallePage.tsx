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
  const ingPayload = () => producto?.ingredientes.map(i => ({ ingrediente_id: i.ingrediente_id, es_removible: i.es_removible })) || [];
  const catPayload = () => producto?.categorias.map(c => ({ categoria_id: c.id, es_principal: c.es_principal })) || [];

  const handleAddIngrediente = (ingrediente_id: number, es_removible: boolean) => {
    updateMutation.mutate({ id: productoId, data: { ingredientes: [...ingPayload(), { ingrediente_id, es_removible }] } });
  };

  const handleRemoveIngrediente = (ingredienteId: number) => {
    updateMutation.mutate({ id: productoId, data: { ingredientes: ingPayload().filter(i => i.ingrediente_id !== ingredienteId) } });
  };

  const handleAddCategoria = (categoria_id: number, es_principal: boolean) => {
    let categorias = [...catPayload(), { categoria_id, es_principal }];
    if (es_principal) categorias = categorias.map(c => c.categoria_id === categoria_id ? c : { ...c, es_principal: false });
    updateMutation.mutate({ id: productoId, data: { categorias } });
  };

  const handleRemoveCategoria = (categoriaId: number) => {
    updateMutation.mutate({ id: productoId, data: { categorias: catPayload().filter(c => c.categoria_id !== categoriaId) } });
  };

  const handleToggleRemovible = (ingredienteId: number) => {
    const updated = ingPayload().map(i =>
      i.ingrediente_id === ingredienteId ? { ...i, es_removible: !i.es_removible } : i
    );
    updateMutation.mutate({ id: productoId, data: { ingredientes: updated } });
  };

  const handleSetPrincipal = (categoriaId: number) => {
    updateMutation.mutate({ id: productoId, data: { categorias: catPayload().map(c => ({ ...c, es_principal: c.categoria_id === categoriaId })) } });
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
            <h1 className="text-4xl font-bold text-text">{producto.nombre}</h1>
            <p className="text-text-muted mt-2 text-lg max-w-2xl">{producto.descripcion || 'Sin descripción'}</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20">
                ${producto.precio_base.toFixed(2)}
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
                {producto.ingredientes.map(ing => (
                  <RelacionItemRow key={ing.ingrediente_id} onRemove={() => handleRemoveIngrediente(ing.ingrediente_id)} isPending={updateMutation.isPending}>
                    <span className="font-medium text-text">{ing.nombre}</span>
                    {ing.es_alergeno && <StatusBadge variant="alergeno" />}
                    {/* Toggle Fijo / Opcional inline — sin necesidad de borrar y re-agregar */}
                    <button
                      onClick={() => handleToggleRemovible(ing.ingrediente_id)}
                      disabled={updateMutation.isPending}
                      title={ing.es_removible ? 'Opcional: click para fijar' : 'Fijo: click para hacer opcional'}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-all font-semibold disabled:opacity-50
                        ${ing.es_removible
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                          : 'bg-surface-2 border-border text-text-muted hover:border-blue-400/40 hover:text-blue-400'}`}
                    >
                      {ing.es_removible ? 'Opc.' : 'Fijo'}
                    </button>
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
                {producto.categorias.map(cat => (
                  <RelacionItemRow key={cat.id} onRemove={() => handleRemoveCategoria(cat.id)} isPending={updateMutation.isPending}>
                    <span className="font-medium text-text">{cat.nombre}</span>
                    {cat.es_principal ? (
                      <StatusBadge variant="principal" />
                    ) : (
                      <button onClick={() => handleSetPrincipal(cat.id)} disabled={updateMutation.isPending}
                        className="px-2 py-0.5 rounded-md text-xs font-medium text-text-muted hover:text-primary hover:bg-primary/10 border border-border transition-all disabled:opacity-50">
                        Hacer principal
                      </button>
                    )}
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
