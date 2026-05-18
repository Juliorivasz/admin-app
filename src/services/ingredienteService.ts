import api from '../api/axios';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types';

export const getIngredientes = async (nombre?: string): Promise<Ingrediente[]> => {
  const params: Record<string, any> = {};
  if (nombre) params.nombre = nombre;
  return api.get('/ingredientes/', { params });
};

export const getIngrediente = async (id: number): Promise<Ingrediente> => {
  return api.get(`/ingredientes/${id}`);
};

export const createIngrediente = async (data: IngredienteCreate): Promise<Ingrediente> => {
  return api.post('/ingredientes/', data);
};

export const updateIngrediente = async ({ id, data }: { id: number; data: IngredienteUpdate }): Promise<Ingrediente> => {
  return api.patch(`/ingredientes/${id}`, data);
};
