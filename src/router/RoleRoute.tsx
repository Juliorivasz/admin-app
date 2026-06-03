import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from './routes';

interface RoleRouteProps {
  roles: UserRole[];
  children: ReactNode;
}

import { useAuthStore } from '../features/auth/store/authStore';

const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-text-muted">Verificando permisos...</div>;
  }

  // Si no hay roles definidos para la ruta, cualquier usuario autenticado puede acceder
  if (roles.length > 0) {
    const hasRole = user?.roles?.some(role => roles.includes(role as UserRole));
    if (!hasRole) {
      // Si un empleado intenta acceder al dashboard (raíz) por defecto, redirigirlo a su página principal
      if (window.location.pathname === '/') {
        if (user?.roles?.includes('PEDIDOS')) return <Navigate to="/pedidos" replace />;
        if (user?.roles?.includes('STOCK')) return <Navigate to="/productos" replace />;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleRoute;
