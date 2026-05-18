interface StockBadgeProps {
  cantidad: number;
  unidad?: string;
}

const StockBadge = ({ cantidad, unidad = 'uds' }: StockBadgeProps) => {
  const alertClass =
    cantidad === 0
      ? 'bg-danger/10 text-danger border-danger/30'
      : cantidad <= 5
        ? 'bg-warning/10 text-warning border-warning/30'
        : 'bg-surface-2 text-text border-border';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${alertClass}`}>
      {cantidad} {unidad}
    </span>
  );
};

export default StockBadge;
