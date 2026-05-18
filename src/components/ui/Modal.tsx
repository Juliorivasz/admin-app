import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  /**
   * Tamaño del modal. Por defecto 'md'.
   * - 'sm'  → max-w-md  (~448px)
   * - 'md'  → max-w-lg  (~512px)  ← default
   * - 'lg'  → max-w-2xl (~672px)
   * - 'xl'  → max-w-4xl (~896px)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Slot para el footer con botones de acción.
   * Anclado al fondo del modal, siempre visible.
   */
  footer?: ReactNode;
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  headerActions,
  size = 'md',
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/*
        Comportamiento responsive:

        MOBILE  (< sm):
          - Ocupa el 90% del alto de pantalla, anclado al fondo (items-end).
          - Body con overflow-y-auto → scroll permitido.
          - rounded solo arriba.

        DESKTOP (sm+):
          - Sin max-h → el modal tiene la altura exacta de su contenido.
          - Sin overflow-y-auto → nunca hay scroll.
          - Centrado vertical/horizontal.
          - rounded completo.
      */}
      <div
        className={`
          relative w-full ${SIZE_CLASSES[size]}
          flex flex-col
          bg-surface border border-border
          shadow-2xl
          animate-in fade-in duration-200

          rounded-t-2xl        sm:rounded-2xl
          max-h-[90dvh]        sm:max-h-none
          overflow-hidden
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <h3 className="text-lg font-semibold leading-6 text-text truncate pr-4">
            {title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {headerActions && <div className="flex items-center">{headerActions}</div>}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ──
            Mobile:  overflow-y-auto  → scroll si el contenido no cabe
            Desktop: overflow-visible → nunca hace scroll (el modal crece hasta el contenido)
        */}
        <div className="flex-1 overflow-y-auto sm:overflow-visible px-5 py-4">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-border bg-surface shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
