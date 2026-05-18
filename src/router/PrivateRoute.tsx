/**
 * PrivateRoute.tsx
 *
 * Guard para rutas que requieren autenticación.
 * Si el usuario no está logueado → redirige a /login.
 *
 * Uso:
 *   <PrivateRoute>
 *     <MiPagina />
 *   </PrivateRoute>
 *
 * Cuando implementes el sistema de auth real, reemplaza `useAuth()`
 * con tu hook de sesión (JWT, cookie, context, etc.).
 */
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Hook placeholder — reemplazar con el hook real de autenticación.
 * Mientras no haya sistema de auth, siempre devuelve isAuthenticated: true
 * para no bloquear el desarrollo.
 */
const useAuth = () => {
  // TODO: implementar con contexto de auth real (JWT / cookie / Zustand / etc.)
  return { isAuthenticated: true };
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guarda la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
