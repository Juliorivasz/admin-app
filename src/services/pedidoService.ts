import api from '../api/axios';

export const getPedidos = async () => {
  return api.get('/pedidos/');
};

export const getPedidoById = async (id: number) => {
  return api.get(`/pedidos/${id}`);
};

export const updateEstadoPedido = async ({ id, estado_codigo }: { id: number, estado_codigo: string }) => {
  return api.put(`/pedidos/${id}`, { estado_codigo });
};
