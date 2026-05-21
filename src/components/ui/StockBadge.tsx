/**
 * StockBadge
 * ═══════════════════════════════════════════════════
 * Estilos según la imagen:
 * - Todos los badges de stock tienen el mismo estilo visual (gris),
 *   independientemente de la cantidad.
 * - Fondo oscuro (`bg-surface-2`, #252636).
 * - Texto atenuado (`text-text-muted`, #8A8F9E).
 * - Borde muy tenue.
 * ═══════════════════════════════════════════════════
 */

interface StockBadgeProps {
  cantidad: number;
  unidad?: string;
}

const StockBadge = ({ cantidad, unidad = 'uds' }: StockBadgeProps) => {
  return (
    <span
      className="inline-flex items-center px-[10px] py-[2px] rounded-md border border-border bg-[#252636] text-text-muted font-medium whitespace-nowrap"
      style={{ fontSize: '12px' }}
    >
      {cantidad} {unidad}
    </span>
  );
};

export default StockBadge;
