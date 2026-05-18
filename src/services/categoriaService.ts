import api from '../api/axios';
import type { Categoria, CategoriaCreate, CategoriaUpdate, CategoriaDetalle } from '../types';

export const getCategorias = async (nombre?: string, include_inactivos?: boolean): Promise<Categoria[]> => {
  const params: Record<string, any> = {};
  if (nombre) params.nombre = nombre;
  if (include_inactivos) params.include_inactivos = true;
  return api.get('/categorias/', { params });
};

export const getCategoria = async (id: number): Promise<CategoriaDetalle> => {
  return api.get(`/categorias/${id}`);
};

export const createCategoria = async (data: CategoriaCreate): Promise<Categoria> => {
  return api.post('/categorias/', data);
};

export const updateCategoria = async ({ id, data }: { id: number; data: CategoriaUpdate }): Promise<Categoria> => {
  return api.patch(`/categorias/${id}`, data);
};

export const toggleEstadoCategoria = async (id: number): Promise<Categoria> => {
  return api.patch(`/categorias/${id}/toggle-estado`);
};
