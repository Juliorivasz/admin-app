import axiosInstance from '../../../api/axios';

export const getUsuarios = async (include_inactivos?: boolean) => {
  const params: any = { exclude_role: 'CLIENT' };
  if (include_inactivos) params.include_inactivos = true;
  return axiosInstance.get('/usuarios/', { params });
};

export const getUsuarioById = async (id: number) => {
  return axiosInstance.get(`/usuarios/${id}`);
};

export const createUsuario = async (data: any) => {
  return axiosInstance.post('/usuarios/', data);
};

export const updateUsuario = async ({ id, data }: { id: number, data: any }) => {
  return axiosInstance.patch(`/usuarios/${id}`, data);
};

export const deleteUsuario = async (id: number) => {
  return axiosInstance.delete(`/usuarios/${id}`);
};
