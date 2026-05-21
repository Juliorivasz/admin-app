import { useState, useMemo } from 'react';
import { Filter, RotateCw } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado';

interface OrderItem {
  id: string;
  qty: number;
  name: string;
  price: number;
  ready?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '1042',
    title: 'Mesa 4',
    status: 'pendiente',
    items: [
      { id: 'i1', qty: 2, name: 'Pizza Margarita', price: 25.00 },
      { id: 'i2', qty: 1, name: 'Refresco Cola', price: 3.50 },
      { id: 'i3', qty: 1, name: 'Ensalada César', price: 8.50 },
    ],
    total: 37.00,
  },
  {
    id: '2',
    orderNumber: '1041',
    title: 'Para llevar',
    status: 'en_preparacion',
    items: [
      { id: 'i4', qty: 1, name: 'Hamburguesa Clásica', price: 9.00, ready: true },
      { id: 'i5', qty: 1, name: 'Patatas Fritas', price: 6.00 },
    ],
    total: 15.00,
  },
  {
    id: '3',
    orderNumber: '1040',
    title: 'Mesa 12',
    status: 'listo',
    items: [
      { id: 'i6', qty: 3, name: 'Tacos al Pastor', price: 21.00 },
      { id: 'i7', qty: 2, name: 'Cerveza Artesanal', price: 7.00 },
    ],
    total: 28.00,
  },
  {
    id: '4',
    orderNumber: '1039',
    title: 'Mesa 2',
    status: 'entregado',
    items: [
      { id: 'i8', qty: 1, name: 'Sopa del Día', price: 8.00 },
      { id: 'i9', qty: 1, name: 'Agua Mineral', price: 4.00 },
    ],
    total: 12.00,
  },
];

const PedidosPage = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_MOCK_ORDERS);

  // Derivar columnas (Kanban)
  const columns = useMemo(() => {
    return {
      entrantes: orders.filter(o => o.status === 'pendiente'),
      preparacion: orders.filter(o => o.status === 'en_preparacion' || o.status === 'listo'),
      entregados: orders.filter(o => o.status === 'entregado'),
    };
  }, [orders]);

  const changeOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* ── Page Header (Adaptado al diseño Kanban) ── */}
      <div className="flex justify-between items-center bg-surface rounded-xl p-6 border border-border shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-[14px] text-text-muted font-normal">
            Lista de pedidos activos de caja.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 py-2 text-[13px]">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="primary" className="px-4 py-2 text-[13px]">
            <RotateCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 overflow-x-auto pb-4">
        
        {/* COLUMNA 1: Entrantes */}
        <div className="flex flex-col h-full bg-[#1A1A24]/0 rounded-xl border-border/0">
          <div className="flex items-center justify-between px-2 pb-4 pt-1 shrink-0">
            <span className="text-[12px] font-semibold tracking-wider text-text-muted uppercase">
              Entrantes / Aceptados
            </span>
            <span className="bg-surface-2 text-text-muted px-2 py-0.5 rounded-md text-[11px] font-medium">
              {columns.entrantes.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {columns.entrantes.map(order => (
              <PedidoCard key={order.id} order={order} onChangeStatus={changeOrderStatus} />
            ))}
          </div>
        </div>

        {/* COLUMNA 2: Preparación / Listos */}
        <div className="flex flex-col h-full bg-[#1A1A24]/0 rounded-xl border-border/0">
          <div className="flex items-center justify-between px-2 pb-4 pt-1 shrink-0">
            <span className="text-[12px] font-semibold tracking-wider text-text-muted uppercase">
              En Preparación / Listos
            </span>
            <span className="bg-surface-2 text-text-muted px-2 py-0.5 rounded-md text-[11px] font-medium">
              {columns.preparacion.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {columns.preparacion.map(order => (
              <PedidoCard key={order.id} order={order} onChangeStatus={changeOrderStatus} />
            ))}
          </div>
        </div>

        {/* COLUMNA 3: Entregados */}
        <div className="flex flex-col h-full bg-[#1A1A24]/0 rounded-xl border-border/0">
          <div className="flex items-center justify-between px-2 pb-4 pt-1 shrink-0">
            <span className="text-[12px] font-semibold tracking-wider text-text-muted uppercase">
              Entregados / Retirados
            </span>
            <span className="bg-surface-2 text-text-muted px-2 py-0.5 rounded-md text-[11px] font-medium">
              {columns.entregados.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {columns.entregados.map(order => (
              <PedidoCard key={order.id} order={order} onChangeStatus={changeOrderStatus} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


/* ── Componente Interno: Tarjeta de Pedido ── */

const PedidoCard = ({ order, onChangeStatus }: { order: Order, onChangeStatus: (id: string, s: OrderStatus) => void }) => {
  
  // Derivar opacidad si está entregado
  const isEntregado = order.status === 'entregado';
  const cardOpacity = isEntregado ? 'opacity-60' : 'opacity-100';

  // Configuración del badge según el estado
  const getBadgeVariant = () => {
    switch (order.status) {
      case 'pendiente': return 'pedido-pendiente';
      case 'en_preparacion': return 'pedido-preparacion';
      case 'listo': return 'pedido-listo';
      case 'entregado': return 'pedido-entregado';
      default: return 'pedido-pendiente';
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 transition-opacity duration-300 hover:border-[#3E4260] ${cardOpacity}`}>
      
      {/* Cabecera (Orden # y Estado) */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Orden #{order.orderNumber}
          </span>
          <span className="text-[17px] font-semibold text-text tracking-tight mt-1">
            {order.title}
          </span>
        </div>
        <StatusBadge variant={getBadgeVariant()} />
      </div>

      {/* Lista de Items */}
      <div className="bg-[#191A23] rounded-lg p-3.5 space-y-2.5">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between items-start">
            <span className={`text-[13px] ${item.ready || isEntregado ? 'text-text-muted line-through' : 'text-text-muted/90'}`}>
              {item.qty}x {item.name}
            </span>
            <span className="text-[13px] font-medium text-text-muted">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
        
        {/* Total Divider */}
        <div className="pt-2.5 mt-1 border-t border-[#2A2B3D] flex justify-between items-center">
          <span className="text-[14px] font-semibold text-text">Total</span>
          <span className="text-[15px] font-bold text-blue-300/90">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botones de Acción (Si no está entregado) */}
      {!isEntregado && (
        <div className="flex gap-2 pt-1">
          {order.status === 'pendiente' && (
            <>
              <Button variant="secondary" className="flex-1 text-[13px] py-2 h-9" onClick={() => {/* Lógica cancelar */}}>
                Cancelar
              </Button>
              <Button variant="warning" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'en_preparacion')}>
                En preparación
              </Button>
            </>
          )}
          {order.status === 'en_preparacion' && (
            <Button variant="primary" className="w-full text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'listo')}>
              Listo
            </Button>
          )}
          {order.status === 'listo' && (
            <Button variant="success" className="w-full text-[13px] py-2 h-9 text-green-950 font-bold" onClick={() => onChangeStatus(order.id, 'entregado')}>
              Entregado
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
