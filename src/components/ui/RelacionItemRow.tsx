import { type ReactNode } from 'react';

interface RelacionItemRowProps {
  onRemove: () => void;
  isPending?: boolean;
  removeTitle?: string;
  children: ReactNode;
}

/**
 * RelacionItemRow — Midnight Fleet design system
 *
 * Interactive list item (DESIGN.md): body-sm typography, surface-2 bg on hover.
 * Hover reveals remove button — uses danger semantic color.
 * Radius: 12px (rounded-xl) as an interactive row inside a card container.
 */
const RelacionItemRow = ({
  onRemove,
  isPending = false,
  removeTitle = 'Quitar',
  children,
}: RelacionItemRowProps) => (
  <div
    className="flex justify-between items-center p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-surface-2 hover:border-border group"
  >
    <div className="flex items-center gap-3 flex-1 text-sm font-normal text-text">
      {children}
    </div>
    <button
      onClick={onRemove}
      disabled={isPending}
      title={removeTitle}
      className="text-text-muted hover:text-danger hover:bg-danger/10 rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 ml-2 shrink-0"
      aria-label={removeTitle}
    >
      &times;
    </button>
  </div>
);

export default RelacionItemRow;
