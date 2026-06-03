import { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter, RotateCw, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getPedidos, updateEstadoPedido } from '../services/pedidoService';
import { useWebSocket } from '../../../hooks/useWebSocket';
import PedidoDetalleModal from '../components/PedidoDetalleModal';
import type { Order, OrderStatus } from '../types/order';
import { useAuthStore } from '../../auth/store/authStore';

const ITEMS_PER_PAGE = 8;

const PedidosPage = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Tabs management
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Auth
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.roles?.includes('ADMIN') || false;

  // Connect to WebSocket
  const { isConnected, lastMessage } = useWebSocket(`ws://${window.location.host}/ws-pedidos`);

  useEffect(() => {
    if (lastMessage) {
      console.log('Real-time order update received:', lastMessage.event);
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    }
  }, [lastMessage, queryClient]);

  const { data: pedidosResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['pedidos'],
    queryFn: getPedidos,
  });

  const updateEstadoMutation = useMutation({
    mutationFn: updateEstadoPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });

  const orders: Order[] = useMemo(() => {
    let list: Order[] = [];
    if (!pedidosResponse) return [];
    if (Array.isArray(pedidosResponse)) list = pedidosResponse;
    else if (Array.isArray((pedidosResponse as any).data)) list = (pedidosResponse as any).data;
    
    // Sort oldest first (ASC) so newest go to the bottom of the column
    list = list.sort((a, b) => a.id - b.id);

    if (selectedDate) {
      list = list.filter(o => o.created_at && o.created_at.startsWith(selectedDate));
    }
    return list;
  }, [pedidosResponse, selectedDate]);

  const columns = useMemo(() => {
    return {
      entrantes: orders.filter(o => o.estado_codigo === 'PENDIENTE' || o.estado_codigo === 'CONFIRMADO'),
      preparacion: orders.filter(o => o.estado_codigo === 'EN_PREP' || o.estado_codigo === 'LISTO'),
      finalizados: orders.filter(o => o.estado_codigo === 'ENTREGADO' || o.estado_codigo === 'CANCELADO'),
    };
  }, [orders]);

  const changeOrderStatus = (id: number, newStatus: OrderStatus) => {
    updateEstadoMutation.mutate({ id, estado_codigo: newStatus });
  };

  // Pagination Logic for History
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return columns.finalizados.slice(start, start + ITEMS_PER_PAGE);
  }, [columns.finalizados, currentPage]);

  const totalPages = Math.ceil(columns.finalizados.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4">
        <p className="text-red-400">Error al cargar los pedidos. Intenta nuevamente.</p>
        <Button variant="secondary" onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* ── Page Header ── */}
      <div className="flex justify-between items-center bg-surface rounded-xl p-6 border border-border shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-[14px] text-text-muted font-normal">
            Control de flujo de órdenes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-[13px] text-text-muted">Fecha:</span>
            <input 
              type="date" 
              className="bg-surface-2 border border-border rounded-md px-3 py-1.5 text-[13px] text-text focus:outline-none focus:border-primary"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="text-[12px] text-text-muted hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
          
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`} title={isConnected ? 'Conectado a tiempo real' : 'Desconectado'} />

          <Button variant="primary" className="px-4 py-2 text-[13px]" onClick={() => refetch()}>
            <RotateCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-border shrink-0">
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'activos' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-muted hover:text-text hover:border-border'
          }`}
          onClick={() => setActiveTab('activos')}
        >
          Pedidos en Curso ({columns.entrantes.length + columns.preparacion.length})
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'historial' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-muted hover:text-text hover:border-border'
          }`}
          onClick={() => {
            setActiveTab('historial');
            setCurrentPage(1);
          }}
        >
          Historial de Finalizados ({columns.finalizados.length})
        </button>
      </div>

      {/* ── Content Area ── */}
      {activeTab === 'activos' ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-x-auto pb-2 h-[calc(100vh-280px)]">
          
          {/* COLUMNA 1: Entrantes */}
          <div className="flex flex-col h-full bg-[#1A1A24]/0 rounded-xl border-border/0">
            <div className="flex items-center justify-between px-2 pb-4 pt-1 shrink-0">
              <span className="text-[12px] font-semibold tracking-wider text-text-muted uppercase">
                Pendientes / Confirmados
              </span>
              <span className="bg-surface-2 text-text-muted px-2 py-0.5 rounded-md text-[11px] font-medium">
                {columns.entrantes.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {columns.entrantes.map(order => (
                <PedidoCard 
                  key={order.id} 
                  order={order} 
                  onChangeStatus={changeOrderStatus} 
                  onClick={() => setSelectedOrder(order)}
                  isLoading={updateEstadoMutation.isPending && updateEstadoMutation.variables?.id === order.id}
                  isAdmin={isAdmin}
                />
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
                <PedidoCard 
                  key={order.id} 
                  order={order} 
                  onChangeStatus={changeOrderStatus}
                  onClick={() => setSelectedOrder(order)}
                  isLoading={updateEstadoMutation.isPending && updateEstadoMutation.variables?.id === order.id}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-surface rounded-xl border border-border min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-2 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">Pedido #</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">Cliente</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">Fecha</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">Total</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-text-muted">No hay pedidos para mostrar.</td>
                  </tr>
                ) : (
                  paginatedHistory.map(order => {
                    const isEntregado = order.estado_codigo === 'ENTREGADO';
                    const isCancelado = order.estado_codigo === 'CANCELADO';
                    const variant = isEntregado ? 'pedido-entregado' : isCancelado ? 'pedido-cancelado' : 'pedido-pendiente';
                    
                    return (
                      <tr 
                        key={order.id} 
                        className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3 text-[13px] font-medium text-text">#{order.id}</td>
                        <td className="px-4 py-3 text-[13px] text-text-muted">{order.nombre_cliente || `Usuario #${order.id}`}</td>
                        <td className="px-4 py-3 text-[13px] text-text-muted">
                          {new Date(order.created_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-blue-300">
                          ${(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge variant={variant} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface-2/50 shrink-0">
              <span className="text-sm text-text-muted">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <PedidoDetalleModal 
        isOpen={selectedOrder !== null} 
        onClose={() => setSelectedOrder(null)} 
        pedido={selectedOrder} 
      />
    </div>
  );
};


/* ── Componente Interno: Tarjeta de Pedido ── */

const PedidoCard = ({ 
  order, 
  onChangeStatus,
  onClick,
  isLoading,
  isAdmin
}: { 
  order: Order, 
  onChangeStatus: (id: number, s: OrderStatus) => void,
  onClick?: () => void,
  isLoading: boolean,
  isAdmin: boolean
}) => {
  
  const isEntregado = order.estado_codigo === 'ENTREGADO';
  const isCancelado = order.estado_codigo === 'CANCELADO';
  const cardOpacity = (isEntregado || isCancelado) ? 'opacity-60' : 'opacity-100';

  const getBadgeVariant = () => {
    switch (order.estado_codigo) {
      case 'PENDIENTE': return 'pedido-pendiente';
      case 'CONFIRMADO': return 'pedido-confirmado';
      case 'EN_PREP': return 'pedido-preparacion';
      case 'LISTO': return 'pedido-listo';
      case 'ENTREGADO': return 'pedido-entregado';
      case 'CANCELADO': return 'pedido-cancelado';
      default: return 'pedido-pendiente';
    }
  };

  const nombreMostrar = order.nombre_cliente || `Usuario #${order.id}`;

  return (
    <div 
      className={`bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 transition-opacity duration-300 hover:border-[#3E4260] cursor-pointer ${cardOpacity}`}
      onClick={onClick}
    >
      {/* Cabecera (Orden # y Estado) */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Orden #{order.id}
          </span>
          <span className="text-[17px] font-semibold text-text tracking-tight mt-1">
            {nombreMostrar}
          </span>
        </div>
        <div onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
          <StatusBadge variant={getBadgeVariant()} />
        </div>
      </div>

      {/* Lista de Items */}
      <div className="bg-[#191A23] rounded-lg p-3.5 space-y-2.5">
        {order.detalles_pedido && order.detalles_pedido.length > 0 ? (
          order.detalles_pedido.map((item, index) => (
            <div key={item.id || item.producto_id || index} className="flex justify-between items-start">
              <span className={`text-[13px] ${isEntregado ? 'text-text-muted line-through' : 'text-text-muted/90'}`}>
                {item.cantidad}x {item.nombre_snapshot}
              </span>
              <span className="text-[13px] font-medium text-text-muted">
                ${item.precio_snapshot.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <span className="text-[13px] text-text-muted/70">Sin detalles de productos</span>
        )}
        
        {/* Total Divider */}
        <div className="pt-2.5 mt-1 border-t border-[#2A2B3D] flex justify-between items-center">
          <span className="text-[14px] font-semibold text-text">Total</span>
          <span className="text-[15px] font-bold text-blue-300/90">${(order.total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Botones de Acción (Si no está entregado ni cancelado) */}
      {!isEntregado && !isCancelado && (
        <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          {order.estado_codigo === 'PENDIENTE' && isAdmin && (
            <>
              <Button disabled={isLoading} variant="secondary" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'CANCELADO')}>
                Cancelar
              </Button>
              <Button disabled={isLoading} variant="primary" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'CONFIRMADO')}>
                Confirmar
              </Button>
            </>
          )}
          {order.estado_codigo === 'PENDIENTE' && !isAdmin && (
            <span className="text-[12px] text-text-muted italic w-full text-center py-2">Solo ADMIN puede confirmar.</span>
          )}

          {/* Si NO es pendiente y es ADMIN, mostrar botón Cancelar a la par del botón de acción principal */}
          {order.estado_codigo !== 'PENDIENTE' && isAdmin && (
            <Button disabled={isLoading} variant="secondary" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'CANCELADO')}>
              Cancelar
            </Button>
          )}

          {order.estado_codigo === 'CONFIRMADO' && (
            <Button disabled={isLoading} variant="warning" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'EN_PREP')}>
              {isLoading ? '...' : 'A Preparación'}
            </Button>
          )}
          {order.estado_codigo === 'EN_PREP' && (
            <Button disabled={isLoading} variant="primary" className="flex-1 text-[13px] py-2 h-9" onClick={() => onChangeStatus(order.id, 'LISTO')}>
              {isLoading ? '...' : 'Listo'}
            </Button>
          )}
          {order.estado_codigo === 'LISTO' && (
            <Button disabled={isLoading} variant="success" className="flex-1 text-[13px] py-2 h-9 text-green-950 font-bold" onClick={() => onChangeStatus(order.id, 'ENTREGADO')}>
              {isLoading ? '...' : 'Entregado'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
