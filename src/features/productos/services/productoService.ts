import axiosInstance from '../../../api/axios';
import type { 
  Producto, 
  ProductoCreate, 
  ProductoDetalle
} from '../types/producto';

export interface GetProductosParams {
  page?: number;
  page_size?: number;
  search?: string;
  categoria_id?: number | null;
  disponible?: boolean | null;
  stock_status?: string | null;
  include_inactivos?: boolean;
}

export const getProductos = async (filters?: GetProductosParams): Promise<Producto[]> => {
  const params: any = { 
    page: filters?.page || 1, 
    page_size: filters?.page_size || 100 
  };
  
  if (filters?.search) params.search = filters.search;
  if (filters?.categoria_id) params.categoria_id = filters.categoria_id;
  if (filters?.disponible !== undefined && filters?.disponible !== null) params.disponible = filters.disponible;
  if (filters?.stock_status) params.stock_status = filters.stock_status;
  if (filters?.include_inactivos) params.include_inactivos = true;
  try {
    const response: any = await axiosInstance.get('/productos/', { params });
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
  return axiosInstance.get(`/productos/${id}`);
};

export const createProducto = async (data: ProductoCreate): Promise<Producto> => {
  return axiosInstance.post('/productos/', data);
};

export interface UpdateProductoParams {
  id: number;
  data: Partial<ProductoCreate>;
}

export const updateProducto = async ({ id, data }: UpdateProductoParams): Promise<Producto> => {
  return axiosInstance.put(`/productos/${id}`, data);
};

export const deleteProducto = async (id: number): Promise<void> => {
  return axiosInstance.delete(`/productos/${id}`);
};

// Endpoints separados para relaciones intermedios han sido eliminados del backend
