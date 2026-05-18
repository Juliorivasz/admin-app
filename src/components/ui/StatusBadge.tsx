type StatusVariant =
  | 'activo'
  | 'inactivo'
  | 'disponible'
  | 'no-disponible'
  | 'dado-de-baja'
  | 'alergeno'
  | 'no-alergeno'
  | 'removible'
  | 'principal';

const VARIANTS: Record<StatusVariant, { label: string; className: string }> = {
  'activo':        { label: 'Activo',        className: 'bg-success/10 text-success border-success/20' },
  'inactivo':      { label: 'Inactivo',      className: 'bg-danger/10 text-danger border-danger/20' },
  'disponible':    { label: '🟢 Disponible', className: 'bg-success/10 text-success border-success/20' },
  'no-disponible': { label: '⚫ No Disponible', className: 'bg-surface-2 text-text-muted border-border' },
  'dado-de-baja':  { label: 'Dado de Baja',  className: 'bg-danger/10 text-danger border-danger/20' },
  'alergeno':      { label: '⚠️ Alérgeno',   className: 'bg-warning/10 text-warning border-warning/20' },
  'no-alergeno':   { label: 'No',            className: 'bg-surface-2 text-text-muted border-border' },
  'removible':     { label: 'Removible',     className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'principal':     { label: '★ Principal',   className: 'bg-primary/10 text-primary border-primary/20' },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  className?: string;
}

const StatusBadge = ({ variant, className = '' }: StatusBadgeProps) => {
  const { label, className: variantClass } = VARIANTS[variant];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${variantClass} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
