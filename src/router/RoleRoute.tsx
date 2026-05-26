import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from './routes';

interface RoleRouteProps {
  roles: UserRole[];
  children: ReactNode;
}

import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-text-muted">Verificando permisos...</div>;
  }

  // Si no hay roles definidos para la ruta, cualquier usuario autenticado puede acceder
  if (roles.length > 0) {
    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = user?.roles?.some(role => roles.includes(role as UserRole));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleRoute;
