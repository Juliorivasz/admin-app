/**
 * RoleRoute.tsx
 *
 * Guard para rutas que requieren un rol específico.
 * Si el usuario no tiene el rol requerido → redirige a /unauthorized (403).
 *
 * Uso:
 *   <RoleRoute roles={['admin', 'manager']}>
 *     <MiPagina />
 *   </RoleRoute>
 *
 * Cuando implementes el sistema de auth real, reemplaza `useAuthUser()`
 * con tu hook que exponga el rol del usuario autenticado.
 */
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from './routes';

interface RoleRouteProps {
  roles: UserRole[];
  children: ReactNode;
}

/**
 * Hook placeholder — reemplazar con el hook real que devuelva el rol del usuario.
 * Mientras no haya sistema de auth, siempre devuelve rol 'admin'
 * para no bloquear el desarrollo.
 */
const useAuthUser = () => {
  // TODO: obtener el rol real desde el contexto de auth / JWT claims
  return { role: 'admin' as UserRole };
};

const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const { role } = useAuthUser();

  // Si no hay roles definidos para la ruta, cualquier usuario autenticado puede acceder
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
