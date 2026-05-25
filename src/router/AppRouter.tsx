/**
 * AppRouter.tsx
 *
 * Orquestador central del sistema de rutas.
 * Lee la configuración de routes.tsx y aplica automáticamente:
 *   - React.Suspense con spinner para rutas con lazy loading
 *   - Layout principal (sidebar + header)
 *   - PrivateRoute (guard de autenticación)
 *   - RoleRoute (guard de roles)
 *
 * Para agregar una nueva ruta: solo editar routes.tsx.
 * Este archivo no necesita cambiar.
 */
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { publicRoutes, privateRoutes } from './routes';

// Spinner de carga para React.lazy
const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* ── Rutas públicas (sin layout, sin auth) ────────────────────── */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* ── Rutas privadas (dentro del Layout con sidebar) ────────────── */}
        <Route path="/" element={<Layout />}>
          {privateRoutes.map((route) => {
            let element = route.element;

            // Aplicar guard de roles si la ruta tiene roles definidos
            if (route.roles && route.roles.length > 0) {
              element = <RoleRoute roles={route.roles}>{element}</RoleRoute>;
            }

            // Aplicar guard de autenticación
            if (route.requiresAuth) {
              element = <PrivateRoute>{element}</PrivateRoute>;
            }

            return <Route key={route.path} path={route.path} element={element} />;
          })}

          {/* Ruta catch-all dentro del layout → 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/* Ruta catch-all global → redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
