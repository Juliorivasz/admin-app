import axios, { type AxiosError, type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // El backend local no usa /api/v1
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para solicitudes
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Manejo de expiración de sesión (401) y Refresh Token
    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      try {
        // Intentar refrescar usando una instancia limpia de axios para evitar loops en los interceptores
        await axios.post('http://localhost:8000/auth/refresh', {}, { withCredentials: true });
        // Si tiene éxito, reintentar la solicitud original
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh token, la sesión expiró por completo
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const data = error.response.data as any;
      errorMessage = data?.detail || `Error de servidor: ${error.response.status}`;
      
      // Si es validación de Pydantic detallada
      if (Array.isArray(data?.detail)) {
        errorMessage = data.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
      }
      
      // Manejo específico de códigos
      if (error.response.status === 404) {
        console.warn('Recurso no encontrado:', error.config?.url);
      } else if (error.response.status === 422) {
        console.error('Error de validación:', errorMessage);
      } else if (error.response.status >= 500) {
        console.error('Error interno del servidor:', errorMessage);
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión de red o si el servidor está encendido.';
    }

    // Rechazamos con un error que incluya el status HTTP
    const customError = new Error(errorMessage) as any;
    if (error.response) {
      customError.status = error.response.status;
    }
    return Promise.reject(customError);
  }
);

export default api;
