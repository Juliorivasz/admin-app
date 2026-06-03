export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';

export interface OrderItem {
  id?: number;
  producto_id?: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  producto?: {
    name: string;
    price: number;
  };
  subtotal?: number;
}

export interface Order {
  id: number;
  nombre_cliente: string;
  estado_codigo: OrderStatus;
  detalles_pedido: OrderItem[];
  detalles?: OrderItem[]; // Some parts of the code might use detalles instead of detalles_pedido
  usuario?: {
    name: string;
    lastname?: string;
    phone_number?: string;
  };
  total: number;
  created_at: string;
}
