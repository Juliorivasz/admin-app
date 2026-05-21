/**
 * PageHeader
 * ═══════════════════════════════════════════════════
 * Estilos según la imagen:
 * - Contenedor: Tarjeta oscura (`bg-surface`, #1D1E2C) con bordes suaves (`rounded-lg`).
 * - Sin gradientes, texto en blanco (`text-text`).
 * - Subtítulo en gris claro (`text-text-muted`).
 * ═══════════════════════════════════════════════════
 */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onNew?: () => void;
  newLabel?: string;
  newClassName?: string;
}

const PageHeader = ({
  title,
  subtitle,
  onNew,
  newLabel = 'Nuevo',
  newClassName = '',
}: PageHeaderProps) => (
  <div className="flex justify-between items-center bg-surface rounded-xl p-6 border border-border">
    <div className="flex flex-col gap-1">
      <h1 className="text-[22px] font-semibold text-text tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[14px] text-text-muted font-normal">
          {subtitle}
        </p>
      )}
    </div>

    {onNew && (
      <button
        onClick={onNew}
        className={`ds-btn bg-primary text-white hover:bg-primary-hover ${newClassName}`}
      >
        <span className="text-[18px] leading-none mb-[2px]">+</span>
        {newLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
