import axios, { type AxiosError, type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
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
  (error: AxiosError) => {
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

    // Aquí podríamos disparar una notificación global
    // toast.error(errorMessage);

    // Rechazamos con el mensaje simplificado para que los componentes lo usen
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
