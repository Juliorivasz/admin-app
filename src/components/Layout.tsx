import { Outlet, useLocation } from 'react-router-dom';
import { Bell, CircleHelp, User } from 'lucide-react';
import Sidebar from './Sidebar';

/**
 * Layout
 * ═══════════════════════════════════════════════════
 * Estilos aplicados según la imagen:
 * - Header: Fondo transparente/mismo que el fondo base, separado por un borde sutil.
 * - Breadcrumb: Texto pequeño y atenuado ("Panel de Control / Productos").
 * - Íconos a la derecha: Campana, Ayuda (CircleHelp), Usuario (User en un círculo), 
 *   todos con un tono `text-muted` y sin fondos grises.
 * - Contenedor principal: Ocupa todo el espacio, con algo de padding para 
 *   alojar el contenido de la página.
 * ═══════════════════════════════════════════════════
 */
const Layout = () => {
  const location = useLocation();
  
  // Generar un breadcrumb simple basado en la ruta actual
  const pathName = location.pathname.split('/')[1] || 'Productos';
  const pageName = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-14 md:pb-0">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="h-[70px] flex items-center justify-between px-6 md:px-8 border-b border-border shrink-0">

          {/* Breadcrumb — "Panel de Control / {Page}" */}
          <span className="text-[14px] font-medium text-text-muted select-none">
            Panel de Control / {pageName}
          </span>

          {/* Acciones del header */}
          <div className="flex items-center gap-4">
            <button className="text-text-muted hover:text-text transition-colors">
              <Bell className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <button className="text-text-muted hover:text-text transition-colors">
              <CircleHelp className="w-5 h-5" strokeWidth={1.8} />
            </button>
            {/* Avatar genérico (Círculo oscuro con ícono) */}
            <button className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-text-muted transition-colors">
              <User className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* ── Área de contenido ───────────────────────────────────── */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
};

export default Layout;
