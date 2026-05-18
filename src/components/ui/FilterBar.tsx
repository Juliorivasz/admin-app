import { type ReactNode } from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  hasActiveFilters: boolean;
  onClear: () => void;
  children?: ReactNode; // slot para filtros adicionales
}

const FilterBar = ({
  search,
  onSearchChange,
  placeholder = 'Buscar por nombre...',
  hasActiveFilters,
  onClear,
  children,
}: FilterBarProps) => (
  <div className="flex flex-wrap items-center gap-4 bg-surface p-4 rounded-2xl border border-border shadow-sm">
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>

    {children}

    {hasActiveFilters && (
      <button
        onClick={onClear}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-danger hover:bg-danger/10 border border-border transition-all"
      >
        <X className="w-3.5 h-3.5" /> Limpiar
      </button>
    )}
  </div>
);

export default FilterBar;
