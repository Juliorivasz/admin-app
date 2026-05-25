import api from '../api/axios';

export const getUsuarios = async () => {
  return api.get('/usuarios/');
};

export const getUsuarioById = async (id: number) => {
  return api.get(`/usuarios/${id}`);
};

export const createUsuario = async (data: any) => {
  return api.post('/usuarios/', data);
};

export const updateUsuario = async ({ id, data }: { id: number, data: any }) => {
  return api.patch(`/usuarios/${id}`, data);
};

export const deleteUsuario = async (id: number) => {
  return api.delete(`/usuarios/${id}`);
};
