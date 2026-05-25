import api from '../api/axios';
import type { 
  Producto, 
  ProductoCreate, 
  ProductoDetalle
} from '../types';

export const getProductos = async (nombre?: string, disponible?: boolean, include_inactivos?: boolean): Promise<Producto[]> => {
  const params: any = { page: 1, page_size: 100 };
  if (nombre) params.nombre = nombre;
  if (disponible !== undefined) params.disponible = disponible;
  if (include_inactivos) params.include_inactivos = true;
  try {
    const response: any = await api.get('/productos/', { params });
    // Manejar el bug del backend donde devuelve list[PaginatedResponse] o PaginatedResponse normal
    if (Array.isArray(response)) {
      if (response.length > 0 && response[0].items) {
        return response[0].items;
      }
      return response;
    } else if (response && response.items) {
      return response.items;
    }
    return [];
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
};

export const getProducto = async (id: number): Promise<ProductoDetalle> => {
  return api.get(`/productos/${id}`);
};

export const createProducto = async (data: ProductoCreate): Promise<Producto> => {
  return api.post('/productos/', data);
};

export interface UpdateProductoParams {
  id: number;
  data: Partial<ProductoCreate>;
}

export const updateProducto = async ({ id, data }: UpdateProductoParams): Promise<Producto> => {
  return api.put(`/productos/${id}`, data);
};

export const deleteProducto = async (id: number): Promise<void> => {
  return api.delete(`/productos/${id}`);
};

// Endpoints separados para relaciones intermedios han sido eliminados del backend
