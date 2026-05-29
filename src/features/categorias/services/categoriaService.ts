import axiosInstance from '../../../api/axios';
import type { Categoria, CategoriaCreate, CategoriaDetalle } from '../types/categoria';

export const getCategorias = async (nombre?: string, include_inactivos?: boolean): Promise<Categoria[]> => {
  const params: Record<string, any> = {};
  if (nombre) params.nombre = nombre;
  if (include_inactivos) params.include_inactivos = true;
  try {
    return await axiosInstance.get('/categorias/', { params });
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
};

export const getCategoria = async (id: number): Promise<CategoriaDetalle> => {
  return axiosInstance.get(`/categorias/${id}`);
};

export const createCategoria = async (data: CategoriaCreate): Promise<Categoria> => {
  return axiosInstance.post('/categorias/', data);
};

export interface UpdateCategoriaParams {
  id: number;
  data: Partial<CategoriaCreate>; // Frontend update type mapped to CategoriaUpdate
}

export const updateCategoria = async ({ id, data }: UpdateCategoriaParams): Promise<Categoria> => {
  return axiosInstance.put(`/categorias/${id}`, data);
};

export const deleteCategoria = async (id: number): Promise<void> => {
  return axiosInstance.delete(`/categorias/${id}`);
};
