import { type ReactNode } from 'react';

interface RelacionItemRowProps {
  onRemove: () => void;
  isPending?: boolean;
  removeTitle?: string;
  children: ReactNode;
}

/**
 * Fila de relación N:N con botón de eliminar que aparece al hover.
 * Usada en ProductoDetallePage para ingredientes y categorías.
 */
const RelacionItemRow = ({
  onRemove,
  isPending = false,
  removeTitle = 'Quitar',
  children,
}: RelacionItemRowProps) => (
  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-2 transition-colors border border-transparent hover:border-border group">
    <div className="flex items-center gap-3 flex-1">{children}</div>
    <button
      onClick={onRemove}
      disabled={isPending}
      title={removeTitle}
      className="text-text-muted hover:text-danger hover:bg-danger/10 rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30 ml-2 shrink-0"
    >
      &times;
    </button>
  </div>
);

export default RelacionItemRow;
