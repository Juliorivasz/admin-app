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

  const getBadgeVariant = (estado: string = '') => {
    switch (estado) {
      case 'PENDIENTE': return 'pedido-pendiente';
      case 'CONFIRMADO': return 'pedido-confirmado';
      case 'EN_PREP': return 'pedido-preparacion';
      case 'LISTO': return 'pedido-listo';
      case 'ENTREGADO': return 'pedido-entregado';
      case 'CANCELADO': return 'pedido-cancelado';
      default: return 'pedido-pendiente';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido #${pedido.id}`}>
      <div className="space-y-6">
        
        {/* Info principal */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-surface-2 p-4 rounded-xl border border-border">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Cliente</p>
            <p className="text-sm font-medium text-text">
              {pedido.nombre_cliente || `Usuario #${pedido.usuario?.name || 'Invitado'}`}
            </p>
            {pedido.usuario?.phone_number && (
              <p className="text-xs text-text-muted">{pedido.usuario.phone_number}</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Estado Actual</p>
            <StatusBadge variant={getBadgeVariant(pedido.estado_codigo)} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text mb-3">Platos Solicitados</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {(pedido.detalles_pedido || pedido.detalles)?.map((detalle, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-surface border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {detalle.cantidad}x
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{detalle.nombre_snapshot || detalle.producto?.name}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-text">${(detalle.subtotal || (detalle.cantidad * (detalle.precio_snapshot || detalle.producto?.price || 0))).toFixed(2)}</p>
              </div>
            ))}
            {(!(pedido.detalles_pedido || pedido.detalles) || (pedido.detalles_pedido || pedido.detalles)?.length === 0) && (
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
