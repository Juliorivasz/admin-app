/**
 * RelacionesStep.tsx
 *
 * UX para selección de Categorías e Ingredientes en el wizard de producto.
 *
 * Diseño:
 *  - Seleccionados: filas con controles claros (quitar, toggle atributo)
 *  - Disponibles: chips clickables para agregar
 *  - Buscador cuando hay más de 5 ítems
 *
 * Terminología:
 *  - Categoría "Principal" (★) vs "Adicional"
 *  - Ingrediente "Fijo" vs "Opcional" (es_removible)
 *    Fijo    → siempre viene en el producto (es_removible: false)
 *    Opcional → el cliente puede pedirlo sin este ingrediente (es_removible: true)
 */
import { useState } from 'react';
import type { Categoria } from '../../categorias/types/categoria';
import type { Ingrediente } from '../../ingredientes/types/ingrediente';
import type { ProductoIngredientePayload } from '../types/producto';

interface RelacionesStepProps {
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  selectedCategorias: number[];
  selectedIngredientes: ProductoIngredientePayload[];
  onCategoriasChange: (v: number[]) => void;
  onIngredientesChange: (v: ProductoIngredientePayload[]) => void;
  isViewMode?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const getCategoryPath = (id: number, allCats: Categoria[]): string => {
  const cat = allCats.find(c => c.id === id);
  if (!cat) return '';
  if (cat.parent_id) {
    const parentPath = getCategoryPath(cat.parent_id, allCats);
    return parentPath ? `${parentPath} > ${cat.nombre}` : cat.nombre;
  }
  return cat.nombre;
};

// ── Componente ────────────────────────────────────────────────────────────────

const RelacionesStep = ({
  categorias,
  ingredientes,
  selectedCategorias,
  selectedIngredientes,
  onCategoriasChange,
  onIngredientesChange,
  isViewMode = false,
}: RelacionesStepProps) => {
  const [catSearch, setCatSearch] = useState('');
  const [ingSearch, setIngSearch] = useState('');

  // ── Categorías ───────────────────────────────────────────────
  const isCatSel = (id: number) => selectedCategorias.includes(id);

  const addCat = (id: number) => {
    if (isViewMode) return;
    onCategoriasChange([...selectedCategorias, id]);
  };

  const removeCat = (id: number) => {
    if (isViewMode) return;
    onCategoriasChange(selectedCategorias.filter(cid => cid !== id));
  };

  // ── Ingredientes ─────────────────────────────────────────────
  const isIngSel = (id: number) => selectedIngredientes.some(i => i.ingrediente_id === id);

  const addIng = (id: number) => {
    if (isViewMode) return;
    onIngredientesChange([...selectedIngredientes, {
      ingrediente_id: id,
      cantidad: 1,
      unidad_medida_id: 1, // Default a 'gramo'
      es_removible: true
    }]);
  };

  const removeIng = (id: number) => {
    if (isViewMode) return;
    onIngredientesChange(selectedIngredientes.filter(i => i.ingrediente_id !== id));
  };

  const updateIng = (id: number, data: Partial<ProductoIngredientePayload>) => {
    if (isViewMode) return;
    onIngredientesChange(selectedIngredientes.map(i => i.ingrediente_id === id ? { ...i, ...data } : i));
  };

  // ── Filtros ──────────────────────────────────────────────────
  const filteredCats = categorias.filter(c => c.nombre.toLowerCase().includes(catSearch.toLowerCase()));
  const filteredIngs = ingredientes.filter(i => i.name.toLowerCase().includes(ingSearch.toLowerCase()));
  const selectedCatItems = filteredCats.filter(c => isCatSel(c.id));
  const availableCatItems = filteredCats.filter(c => !isCatSel(c.id));
  const selectedIngItems = filteredIngs.filter(i => isIngSel(i.id));
  const availableIngItems = filteredIngs.filter(i => !isIngSel(i.id));

  const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 mb-2" />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

      {/* ── Panel Categorías ───────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Categorías
          {selectedCategorias.length > 0 && (
            <span className="ml-1.5 normal-case font-normal text-primary">({selectedCategorias.length})</span>
          )}
        </p>

        {categorias.length > 5 && <SearchInput value={catSearch} onChange={setCatSearch} placeholder="Buscar..." />}

        {/* Seleccionadas — filas con controles */}
        {selectedCatItems.length > 0 && (
          <div className="space-y-1 mb-2">
            {selectedCatItems.map(cat => (
              <div key={cat.id}
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-medium text-text truncate" title={getCategoryPath(cat.id, categorias)}>
                    {getCategoryPath(cat.id, categorias)}
                  </span>
                </div>
                {!isViewMode && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => removeCat(cat.id)}
                      className="text-[10px] px-1.5 py-0.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 border border-border transition-all"
                      title="Quitar">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Disponibles — chips para agregar */}
        {availableCatItems.length > 0 && (
          <>
            <p className="text-[10px] text-text-muted mb-1">
              {selectedCatItems.length > 0 ? 'Agregar:' : 'Disponibles:'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableCatItems.map(cat => (
                <button key={cat.id} type="button" onClick={() => addCat(cat.id)} disabled={isViewMode}
                  title={getCategoryPath(cat.id, categorias)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border bg-surface-2 border-border text-text-muted hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-w-full truncate">
                  + {getCategoryPath(cat.id, categorias)}
                </button>
              ))}
            </div>
          </>
        )}

        {categorias.length === 0 && <p className="text-xs text-text-muted italic">No hay categorías creadas.</p>}
        {categorias.length > 0 && filteredCats.length === 0 && <p className="text-xs text-text-muted italic">Sin resultados.</p>}
      </div>

      {/* ── Panel Ingredientes ────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Ingredientes
          {selectedIngredientes.length > 0 && (
            <span className="ml-1.5 normal-case font-normal text-orange-400">({selectedIngredientes.length})</span>
          )}
        </p>

        {ingredientes.length > 5 && <SearchInput value={ingSearch} onChange={setIngSearch} placeholder="Buscar..." />}

        {selectedIngItems.length > 0 && (
          <div className="space-y-1 mb-2">
            {selectedIngItems.map(ing => {
              const payload = selectedIngredientes.find(i => i.ingrediente_id === ing.id)!;
              return (
                <div key={ing.id}
                  className="flex flex-col gap-2 p-2 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text truncate">{ing.name}</span>
                    {!isViewMode && (
                      <button type="button" onClick={() => removeIng(ing.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 border border-border transition-all"
                        title="Quitar">✕</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input type="number" min="0" step="0.01" value={payload.cantidad}
                      onChange={e => updateIng(ing.id, { cantidad: parseFloat(e.target.value) || 0 })}
                      disabled={isViewMode}
                      className="w-20 px-2 py-1 text-xs rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50"
                      placeholder="Cant." />
                    <select
                      value={payload.unidad_medida_id}
                      onChange={e => updateIng(ing.id, { unidad_medida_id: parseInt(e.target.value) || 1 })}
                      disabled={isViewMode}
                      className="flex-1 px-2 py-1 text-xs rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50"
                    >
                      <option value="1">Gramo (g)</option>
                      <option value="2">Kilogramo (kg)</option>
                      <option value="3">Mililitro (ml)</option>
                      <option value="4">Litro (l)</option>
                      <option value="5">Docena (doc)</option>
                      <option value="6">Unidad (un)</option>
                    </select>
                  </div>
                  <label className={`flex items-center gap-1.5 cursor-pointer w-max ${isViewMode ? 'opacity-70' : ''}`}>
                    <input type="checkbox" checked={payload.es_removible}
                      onChange={e => updateIng(ing.id, { es_removible: e.target.checked })}
                      disabled={isViewMode}
                      className="rounded text-orange-400 focus:ring-orange-400 bg-surface border-border h-3 w-3" />
                    <span className="text-[10px] text-text-muted">Es removible por cliente</span>
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {/* Disponibles */}
        {availableIngItems.length > 0 && (
          <>
            <p className="text-[10px] text-text-muted mb-1">
              {selectedIngItems.length > 0 ? 'Agregar:' : 'Disponibles:'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableIngItems.map(ing => (
                <button key={ing.id} type="button" onClick={() => addIng(ing.id)} disabled={isViewMode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-surface-2 border-border text-text-muted hover:border-orange-400/40 hover:text-orange-400 hover:bg-orange-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  + {ing.name}
                  {ing.esAlergeno && <span className="text-[9px] text-warning">⚠</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {ingredientes.length === 0 && <p className="text-xs text-text-muted italic">No hay ingredientes creados.</p>}
        {ingredientes.length > 0 && filteredIngs.length === 0 && <p className="text-xs text-text-muted italic">Sin resultados.</p>}
      </div>
    </div>
  );
};

export default RelacionesStep;
