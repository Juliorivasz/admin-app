import axiosInstance from '../../../api/axios';

export const getPedidos = async () => {
  return axiosInstance.get('/pedidos/');
};

export const getPedidoById = async (id: number) => {
  return axiosInstance.get(`/pedidos/${id}`);
};

export const updateEstadoPedido = async ({ id, estado_codigo }: { id: number, estado_codigo: string }) => {
  return axiosInstance.put(`/pedidos/${id}`, { estado_codigo });
};
