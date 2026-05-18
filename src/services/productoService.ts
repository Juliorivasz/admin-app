import api from '../api/axios';
import type { 
  Producto, 
  ProductoCreate, 
  ProductoUpdate, 
  ProductoDetalle
} from '../types';

export const getProductos = async (nombre?: string, disponible?: boolean, include_inactivos?: boolean): Promise<Producto[]> => {
  const params: any = {};
  if (nombre) params.nombre = nombre;
  if (disponible !== undefined) params.disponible = disponible;
  if (include_inactivos) params.include_inactivos = true;
  return api.get('/productos/', { params });
};

export const getProducto = async (id: number): Promise<ProductoDetalle> => {
  return api.get(`/productos/${id}`);
};

export const createProducto = async (data: ProductoCreate): Promise<Producto> => {
  return api.post('/productos/', data);
};

export const updateProducto = async ({ id, data }: { id: number; data: ProductoUpdate }): Promise<Producto> => {
  return api.patch(`/productos/${id}`, data);
};

export const toggleEstadoProducto = async (id: number): Promise<Producto> => {
  return api.patch(`/productos/${id}/toggle-estado`);
};

// Endpoints separados para relaciones intermedios han sido eliminados del backend
