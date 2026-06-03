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

const CategoriasPage = lazy(() => import('../features/categorias/pages/CategoriasPage'));
const IngredientesPage = lazy(() => import('../features/ingredientes/pages/IngredientesPage'));
const ProductosPage = lazy(() => import('../features/productos/pages/ProductosPage'));
const ProductoDetallePage = lazy(() => import('../features/productos/pages/ProductoDetallePage'));
const PedidosPage = lazy(() => import('../features/pedidos/pages/PedidosPage'));

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UsuariosPage = lazy(() => import('../features/usuarios/pages/UsuariosPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
// const NotFoundPage     = lazy(() => import('../pages/NotFoundPage'));

export type UserRole = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';

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

export const publicRoutes: AppRoute[] = [
  { path: '/login', element: <LoginPage />, withLayout: false },
  { path: '/unauthorized', element: <div className="h-screen flex items-center justify-center bg-bg text-white">403 - No tienes permisos para ver esta página</div>, withLayout: false },
];

export const privateRoutes: AppRoute[] = [
  {
    path: '',
    element: <DashboardPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK', 'PEDIDOS'],
  },
  {
    path: 'usuarios',
    element: <UsuariosPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN'],
  },
  {
    path: 'categorias',
    element: <CategoriasPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: 'ingredientes',
    element: <IngredientesPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: 'productos',
    element: <ProductosPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: 'productos/:id',
    element: <ProductoDetallePage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: 'pedidos',
    element: <PedidosPage />,
    withLayout: true,
    requiresAuth: true,
    roles: ['ADMIN', 'STOCK', 'PEDIDOS'],
  },
];
