/**
 * StatusBadge
 * ═══════════════════════════════════════════════════
 * Estilos según la imagen:
 * - Disponible: Verde (#2EAE6D).
 * - Stock Bajo: Naranja/Rojo suave (#E07A5F).
 * - Agotado: Gris (#8A8F9E).
 * - Forma: Pill (`rounded-md` o ligeramente redondeado, no full pill).
 * - Contiene un pequeño punto (dot) de color sólido.
 * ═══════════════════════════════════════════════════
 */

type StatusVariant =
  | 'activo'
  | 'inactivo'
  | 'disponible'
  | 'no-disponible'
  | 'stock-bajo'
  | 'agotado'
  | 'dado-de-baja'
  | 'alergeno'
  | 'no-alergeno'
  | 'removible'
  | 'principal'
  | 'pedido-pendiente'
  | 'pedido-confirmado'
  | 'pedido-preparacion'
  | 'pedido-listo'
  | 'pedido-entregado'
  | 'pedido-cancelado';

interface VariantConfig {
  label: string;
  badge: string;
  dot?: string;
}

const VARIANTS: Record<StatusVariant, VariantConfig> = {
  /* ─── Variantes de Productos (Según Imagen) ────────────────────── */
  'disponible': {
    label: 'Disponible',
    badge: 'bg-[rgba(46,174,109,0.1)] text-[#2EAE6D] border-[rgba(46,174,109,0.2)]',
    dot:   'bg-[#2EAE6D]',
  },
  'stock-bajo': {
    label: 'Stock Bajo',
    badge: 'bg-[rgba(224,122,95,0.1)] text-[#E07A5F] border-[rgba(224,122,95,0.2)]',
    dot:   'bg-[#E07A5F]',
  },
  'agotado': {
    label: 'Agotado',
    badge: 'bg-[#252636] text-[#8A8F9E] border-[#2A2B3D]',
    dot:   'bg-[#8A8F9E]',
  },

  /* ─── Variantes Generales (Ajustadas al nuevo tema) ───────────── */
  'activo': {
    label: 'Activo',
    badge: 'bg-[rgba(46,174,109,0.1)] text-[#2EAE6D] border-[rgba(46,174,109,0.2)]',
    dot:   'bg-[#2EAE6D]',
  },
  'inactivo': {
    label: 'Inactivo',
    badge: 'bg-[rgba(217,83,79,0.1)] text-[#D9534F] border-[rgba(217,83,79,0.2)]',
    dot:   'bg-[#D9534F]',
  },
  'no-disponible': {
    label: 'No Disponible',
    badge: 'bg-[#252636] text-[#8A8F9E] border-[#2A2B3D]',
    dot:   'bg-[#8A8F9E]',
  },
  'dado-de-baja': {
    label: 'Dado de Baja',
    badge: 'bg-[rgba(217,83,79,0.1)] text-[#D9534F] border-[rgba(217,83,79,0.2)]',
    dot:   'bg-[#D9534F]',
  },
  'alergeno': {
    label: '⚠️ Alérgeno',
    badge: 'bg-[rgba(224,122,95,0.1)] text-[#E07A5F] border-[rgba(224,122,95,0.2)]',
    dot:   undefined,
  },
  'no-alergeno': {
    label: 'No',
    badge: 'bg-[#252636] text-[#8A8F9E] border-[#2A2B3D]',
    dot:   undefined,
  },
  'removible': {
    label: 'Removible',
    badge: 'bg-[rgba(113,93,242,0.1)] text-primary border-[rgba(113,93,242,0.2)]',
    dot:   'bg-primary',
  },
  'principal': {
    label: '★ Principal',
    badge: 'bg-[rgba(113,93,242,0.1)] text-primary border-[rgba(113,93,242,0.2)]',
    dot:   undefined,
  },

  /* ─── Variantes de Pedidos ────────────────────────────────────── */
  'pedido-pendiente': {
    label: 'PENDIENTE',
    badge: 'bg-[rgba(224,122,95,0.1)] text-[#E07A5F] border-[rgba(224,122,95,0.2)]',
    dot:   'bg-[#E07A5F]',
  },
  'pedido-confirmado': {
    label: 'CONFIRMADO',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dot:   'bg-purple-400',
  },
  'pedido-preparacion': {
    label: 'EN PREP',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot:   'bg-blue-400',
  },
  'pedido-listo': {
    label: 'LISTO',
    badge: 'bg-[rgba(46,174,109,0.1)] text-[#2EAE6D] border-[rgba(46,174,109,0.2)]',
    dot:   'bg-[#2EAE6D]',
  },
  'pedido-entregado': {
    label: '✓ ENTREGADO',
    badge: 'bg-transparent text-[#8A8F9E]',
    dot:   undefined,
  },
  'pedido-cancelado': {
    label: '✕ CANCELADO',
    badge: 'bg-[rgba(217,83,79,0.1)] text-[#D9534F] border-[rgba(217,83,79,0.2)]',
    dot:   undefined,
  },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  className?: string;
}

const StatusBadge = ({ variant, className = '' }: StatusBadgeProps) => {
  const { label, badge, dot } = VARIANTS[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-[8px] py-[3px] rounded-md border font-medium whitespace-nowrap ${badge} ${className}`}
      style={{ fontSize: '12px' }}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
