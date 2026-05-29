import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

import { useAuthStore } from '../store/authStore';

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-text-muted">Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    // Guarda la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
