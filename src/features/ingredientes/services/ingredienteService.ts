import axiosInstance from '../../../api/axios';
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente';

export const getIngredientes = async (nombre?: string): Promise<Ingrediente[]> => {
  const params: Record<string, any> = {};
  if (nombre) params.nombre = nombre;
  try {
    return await axiosInstance.get('/Ingredientes/', { params });
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
};

export const getIngrediente = async (id: number): Promise<Ingrediente> => {
  return axiosInstance.get(`/Ingredientes/${id}`);
};

export const createIngrediente = async (data: IngredienteCreate): Promise<Ingrediente> => {
  return axiosInstance.post('/Ingredientes/', data);
};

export interface UpdateIngredienteParams {
  id: number;
  data: IngredienteCreate;
}

export const updateIngrediente = async ({ id, data }: UpdateIngredienteParams): Promise<Ingrediente> => {
  return axiosInstance.put(`/Ingredientes/${id}`, data);
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  return axiosInstance.delete(`/Ingredientes/${id}`);
};
