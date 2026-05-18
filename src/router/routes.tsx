/**
 * routes.tsx
 *
 * Definición declarativa de todas las rutas de la aplicación.
 * Cada ruta tiene:
 *   - path: la URL
 *   - element: el componente a renderizar
 *   - layout: si se muestra dentro del Layout principal
 *   - requiresAuth: si requiere sesión iniciada
 *   - roles: lista de roles permitidos (vacío = cualquier usuario autenticado)
 *
 * Para agregar una nueva ruta solo hay que añadir un objeto aquí.
 * El AppRouter lee esta configuración y aplica los guards automáticamente.
 */
import { lazy } from 'react';

const CategoriasPage      = lazy(() => import('../pages/CategoriasPage'));
const IngredientesPage    = lazy(() => import('../pages/IngredientesPage'));
const ProductosPage       = lazy(() => import('../pages/ProductosPage'));
const ProductoDetallePage = lazy(() => import('../pages/ProductoDetallePage'));
// Páginas futuras (descomentar cuando existan):
// const LoginPage        = lazy(() => import('../pages/LoginPage'));
// const NotFoundPage     = lazy(() => import('../pages/NotFoundPage'));

export type UserRole = 'admin' | 'manager' | 'staff';

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  /** Si true, renderiza la ruta dentro del Layout (sidebar + header). */
  withLayout?: boolean;
  /** Si true, redirige al login si el usuario no está autenticado. */
  requiresAuth?: boolean;
  /** Roles permitidos. Vacío = cualquier usuario autenticado. */
  roles?: UserRole[];
  /** Ruta index (redirección por defecto dentro de un layout). */
  index?: boolean;
  /** Redirección automática a esta path si es index. */
  redirectTo?: string;
}

/** Rutas públicas — accesibles sin autenticación */
export const publicRoutes: AppRoute[] = [
  // { path: '/login', element: <LoginPage />, withLayout: false },
];

/** Rutas privadas — requieren autenticación (y opcionalmente un rol) */
export const privateRoutes: AppRoute[] = [
  {
    path: 'categorias',
    element: <CategoriasPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['admin', 'manager'],
  },
  {
    path: 'ingredientes',
    element: <IngredientesPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: 'productos',
    element: <ProductosPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: 'productos/:id',
    element: <ProductoDetallePage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['admin', 'manager', 'staff'],
  },
];
