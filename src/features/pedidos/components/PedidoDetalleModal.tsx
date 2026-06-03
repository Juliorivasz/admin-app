import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import type { Order } from '../types/order';

interface PedidoDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Order | null;
}

const PedidoDetalleModal = ({ isOpen, onClose, pedido }: PedidoDetalleModalProps) => {
  if (!pedido) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido #${pedido.id}`}>
      <div className="space-y-6">
        
        {/* Info principal */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-surface-2 p-4 rounded-xl border border-border">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Cliente</p>
            <p className="text-sm font-medium text-text">
              {pedido.usuario?.name} {pedido.usuario?.lastname}
            </p>
            {pedido.usuario?.phone_number && (
              <p className="text-xs text-text-muted">{pedido.usuario.phone_number}</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Estado Actual</p>
            <StatusBadge variant={(pedido.estado_codigo?.toLowerCase() as any) || 'pendiente'} />
          </div>
        </div>

        {/* Detalles (Platos) */}
        <div>
          <h3 className="text-sm font-bold text-text mb-3">Platos Solicitados</h3>
          <div className="space-y-2">
            {pedido.detalles?.map((detalle, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-surface border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {detalle.cantidad}x
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{detalle.producto?.name}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-text">${(detalle.subtotal || (detalle.cantidad * (detalle.producto?.price || 0))).toFixed(2)}</p>
              </div>
            ))}
            {(!pedido.detalles || pedido.detalles.length === 0) && (
              <p className="text-sm text-text-muted italic text-center p-4">No hay detalles registrados.</p>
            )}
          </div>
        </div>

        {/* Totales */}
        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="text-text-muted font-medium text-sm">Total a pagar</span>
          <span className="text-xl font-bold text-primary">${(pedido.total || 0).toFixed(2)}</span>
        </div>

      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="secondary">Cerrar</Button>
      </div>
    </Modal>
  );
};

export default PedidoDetalleModal;
