/**
 * ProductoFormModal.tsx
 *
 * Wizard de 3 pasos para crear o editar un Producto.
 *
 * Paso 1 — Info General:   nombre, descripción, imagen_url
 * Paso 2 — Precio y Stock: precio_base, stock_cantidad, disponible
 * Paso 3 — Relaciones:     categorías e ingredientes (con es_principal / es_removible)
 *
 * Al guardar, se envía UN SOLO payload al backend (transacción atómica).
 */
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import RelacionesStep from './RelacionesStep';
import { getIngredientes } from '../../services/ingredienteService';
import { getCategorias } from '../../services/categoriaService';
import { getProducto } from '../../services/productoService';
import type { ProductoCreate, ProductoUpdate } from '../../types/producto';
import type { ProductoCategoriaCreate } from '../../types/productoCategoria';
import type { ProductoIngredienteCreate } from '../../types/productoIngrediente';

interface ProductoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<ProductoCreate> & {
    id?: number;
    categorias?: any[];
    ingredientes?: any[];
  };
  isViewMode?: boolean;
  onEnableEdit?: () => void;
  onSubmit: (data: ProductoCreate | ProductoUpdate) => Promise<void>;
  isSubmitting?: boolean;
  headerActions?: React.ReactNode;
  title: string;
}

const STEPS = ['Info General', 'Precio y Stock', 'Categorías e Ingredientes'];

const ProductoFormModal = ({
  isOpen,
  onClose,
  defaultValues,
  isViewMode = false,
  onEnableEdit,
  onSubmit,
  isSubmitting,
  headerActions,
  title,
}: ProductoFormModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Campos base
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(defaultValues?.descripcion ?? '');
  const [imagenUrl, setImagenUrl] = useState(defaultValues?.imagen_url ?? '');
  const [precioBase, setPrecioBase] = useState(String(defaultValues?.precio_base ?? ''));
  const [stockCantidad, setStockCantidad] = useState(String(defaultValues?.stock_cantidad ?? ''));
  const [disponible, setDisponible] = useState(defaultValues?.disponible ?? true);

  const [selectedCategorias, setSelectedCategorias] = useState<ProductoCategoriaCreate[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<ProductoIngredienteCreate[]>([]);

  // Al editar: cargar el detalle completo para obtener las relaciones
  // (la lista no incluye categorias/ingredientes)
  const { data: productoDetalle } = useQuery({
    queryKey: ['producto', defaultValues?.id],
    queryFn: () => getProducto(defaultValues!.id!),
    enabled: !!defaultValues?.id && isOpen,
    staleTime: 0, // siempre buscar datos frescos al abrir el modal
  });

  useEffect(() => {
    if (!productoDetalle) return;
    setSelectedCategorias(
      productoDetalle.categorias.map((c: any) => ({
        categoria_id: c.id ?? c.categoria_id,
        es_principal: c.es_principal,
      }))
    );
    setSelectedIngredientes(
      productoDetalle.ingredientes.map((i: any) => ({
        ingrediente_id: i.ingrediente_id,
        es_removible: i.es_removible,
      }))
    );
  }, [productoDetalle]);

  // Queries para poblar el paso 3
  const { data: todasCategorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getCategorias(),
    enabled: isOpen,
  });

  const { data: todosIngredientes = [] } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: () => getIngredientes(),
    enabled: isOpen,
  });

  const handleClose = () => {
    setStep(0);
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const payload: ProductoCreate = {
      nombre,
      descripcion: descripcion || null,
      imagen_url: imagenUrl || null,
      precio_base: parseFloat(precioBase) || 0,
      stock_cantidad: parseInt(stockCantidad) || 0,
      disponible,
      categorias: selectedCategorias,
      ingredientes: selectedIngredientes,
    };
    try {
      await onSubmit(payload);
      setStep(0);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setSubmitError(
        typeof detail === 'string'
          ? detail
          : 'No se pudo guardar el producto. Verificá tu conexión y volvé a intentarlo.'
      );
    }
  };

  const canProceed = () => {
    if (step === 0) return nombre.trim().length >= 2;
    if (step === 1) return parseFloat(precioBase) >= 0 && parseInt(stockCantidad) >= 0;
    return true;
  };

  const wizardFooter = (
    <div className="flex justify-between items-center">
      <Button type="button" variant="ghost" onClick={() => setStep(s => Math.max(s - 1, 0))}
        disabled={step === 0 || isSubmitting}>
        ← Atrás
      </Button>
      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Cerrar
        </Button>
        {isViewMode ? (
          <>
            {defaultValues?.id && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => { handleClose(); navigate(`/productos/${defaultValues.id}`); }}
                className="flex items-center gap-1.5 text-text-muted hover:text-primary"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver detalle completo
              </Button>
            )}
            <Button type="button" onClick={onEnableEdit} variant="secondary">
              Editar
            </Button>
          </>
        ) : step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
            Siguiente →
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
            {submitError ? 'Reintentar' : 'Guardar'}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} headerActions={headerActions}
      size="lg" footer={wizardFooter}>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-2 rounded-full -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((name, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 bg-surface px-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors
                ${idx <= step
                  ? 'bg-primary text-white shadow-[0_0_12px_rgba(108,99,255,0.4)]'
                  : 'bg-surface-2 text-text-muted border-2 border-border'}`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] font-semibold ${idx <= step ? 'text-text' : 'text-text-muted'}`}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso */}
      <div>
        {/* Paso 0 */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="mb-3">
              <label className="text-xs font-semibold text-text mb-0.5 block">
                Nombre <span className="text-danger">*</span>
              </label>
              <Input value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Hamburguesa Doble" disabled={isViewMode} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text mb-0.5 block">Descripción</label>
                <textarea
                  value={descripcion as string}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Ej: Doble carne, cheddar..."
                  disabled={isViewMode}
                  className={`w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[70px] ${isViewMode ? 'opacity-70' : ''}`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text mb-0.5 block">URL de Imagen</label>
                <Input value={imagenUrl as string} onChange={e => setImagenUrl(e.target.value)}
                  placeholder="https://..." disabled={isViewMode} />
              </div>
            </div>
          </div>
        )}

        {/* Paso 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-text mb-0.5 block">
                  Precio Base ($) <span className="text-danger">*</span>
                </label>
                <Input type="number" value={precioBase} onChange={e => setPrecioBase(e.target.value)}
                  placeholder="0.00" min={0} step="0.01" disabled={isViewMode} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text mb-0.5 block">
                  Stock Inicial <span className="text-danger">*</span>
                </label>
                <Input type="number" value={stockCantidad} onChange={e => setStockCantidad(e.target.value)}
                  placeholder="0" min={0} step="1" disabled={isViewMode} />
              </div>
            </div>
            <label className={`flex items-center gap-2 px-3 py-2 border border-border bg-surface-2/30 rounded-xl
              ${isViewMode ? 'opacity-70' : 'cursor-pointer hover:bg-surface-2/60 transition-colors'}`}>
              <input type="checkbox" checked={disponible}
                onChange={e => !isViewMode && setDisponible(e.target.checked)}
                disabled={isViewMode}
                className="rounded text-primary focus:ring-primary bg-surface-2 border-border h-4 w-4" />
              <span className="text-xs font-medium text-text">Producto visible en el menú</span>
            </label>
          </div>
        )}

        {/* Paso 2: Relaciones */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <RelacionesStep
              categorias={todasCategorias as any}
              ingredientes={todosIngredientes as any}
              selectedCategorias={selectedCategorias}
              selectedIngredientes={selectedIngredientes}
              onCategoriasChange={setSelectedCategorias}
              onIngredientesChange={setSelectedIngredientes}
              isViewMode={isViewMode}
            />
          </div>
        )}
      </div>

      {/* Error de red / servidor */}
      {submitError && (
        <div className="mt-4 flex items-start gap-3 p-3 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">
          <span className="shrink-0">⚡</span>
          <div>
            <p className="font-semibold">Error al guardar</p>
            <p className="text-danger/80 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductoFormModal;
