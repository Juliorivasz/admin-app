import { type ReactNode } from 'react';
import { Search, X, ListFilter } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  hasActiveFilters: boolean;
  onClear: () => void;
  children?: ReactNode;
}

/**
 * FilterBar
 * ═══════════════════════════════════════════════════
 * Estilos según la imagen:
 * - Ya no está dentro de una tarjeta (`bg-surface`), los inputs flotan 
 *   directamente sobre el fondo principal.
 * - Input de búsqueda: Fondo oscuro (`bg-surface-2`, #252636), borde sutil.
 * - Botón Filtrar: Mismo estilo que los inputs (borde sutil, texto blanco).
 * ═══════════════════════════════════════════════════
 */
const FilterBar = ({
  search,
  onSearchChange,
  placeholder = 'Buscar por nombre...',
  hasActiveFilters,
  onClear,
  children,
}: FilterBarProps) => (
  <div className="flex flex-wrap items-center gap-3 w-full">
    {/* ── Campo de búsqueda ── */}
    <div className="relative flex-1 min-w-[240px] max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none"
        strokeWidth={1.8}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] text-text placeholder:text-text-muted/60 pl-10 pr-4 py-[9px] hover:border-text-muted/40 focus:outline-none focus:border-primary transition-colors"
      />
    </div>

    {/* ── Filtros adicionales inyectados desde la página (Precio) ── */}
    {children}

    {/* ── Botón Filtrar (Visual, estático según imagen) ── */}
    <button className="flex items-center gap-2 px-4 py-[9px] bg-[#1D1E2C] border border-[#2A2B3D] rounded-xl text-[14px] font-medium text-text hover:bg-surface-2 transition-colors">
      <ListFilter className="w-4 h-4" strokeWidth={2} />
      Filtrar
    </button>

    {/* ── Botón "Limpiar filtros" (Opcional si hay filtros activos) ── */}
    {hasActiveFilters && (
      <button
        onClick={onClear}
        className="flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-danger hover:bg-danger/10 px-3 py-2 rounded-lg transition-colors ml-auto"
      >
        <X className="w-4 h-4" strokeWidth={2} />
        Limpiar
      </button>
    )}
  </div>
);

export default FilterBar;
