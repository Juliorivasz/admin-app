import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, CircleHelp, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../hooks/useWebSocket';
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
  
  const queryClient = useQueryClient();
  const { lastMessage, isConnected } = useWebSocket(`ws://${window.location.host}/ws-pedidos`);

  useEffect(() => {
    if (lastMessage) {
      console.log('[Layout] Real-time global update received:', lastMessage.event);
      // refetchType: 'all' fuerza a que incluso las queries inactivas (páginas no montadas) 
      // se actualicen en segundo plano. Así al navegar a ellas, la data ya está fresca.
      queryClient.invalidateQueries({ queryKey: ['pedidos'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'], refetchType: 'all' });
    }
  }, [lastMessage, queryClient]);

  // Generar un breadcrumb simple basado en la ruta actual
  const pathName = location.pathname.split('/')[1] || 'Dashboard';
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
            <div 
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} 
              title={isConnected ? 'Servidor de tiempo real conectado' : 'Desconectado del servidor de tiempo real'}
            />
            <button className="text-text-muted hover:text-text transition-colors">
              <Bell className="w-5 h-5" />
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
