import { NavLink } from 'react-router-dom';
import { 
  Box, 
  UtensilsCrossed, 
  LayoutGrid, 
  ClipboardList, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Users
} from 'lucide-react';

/**
 * Sidebar
 * ═══════════════════════════════════════════════════
 * Estilos aplicados según la imagen:
 * - Fondo: Mismo que el resto de la app (`bg-bg`), separado por un borde sutil derecho.
 * - Logo: Texto simple, sin gradiente, con subtítulo "Panel de Control".
 * - Ítems inactivos: Texto e ícono en color `text-muted` (gris).
 * - Ítem activo: Fondo sólido `bg-primary` (#715DF2) con bordes redondeados (rounded-lg) 
 *   y texto/ícono en blanco (`text-white`).
 * - Parte inferior: Ítems de "Settings" y "Logout" fijos abajo.
 * ═══════════════════════════════════════════════════
 */
const Sidebar = () => {
  const mainNavItems = [
    { name: 'Dashboard',    path: '/',             icon: LayoutDashboard },
    { name: 'Pedidos',      path: '/pedidos',      icon: ClipboardList },
    { name: 'Productos',    path: '/productos',    icon: Box },
    { name: 'Ingredientes', path: '/ingredientes', icon: UtensilsCrossed },
    { name: 'Categorías',   path: '/categorias',   icon: LayoutGrid },
    { name: 'Usuarios',     path: '/usuarios',     icon: Users },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border flex flex-row md:relative md:w-[240px] md:flex-col md:shrink-0 md:border-t-0 md:border-r md:min-h-screen">
      
      {/* ── Logo Area ── */}
      <div className="hidden md:flex flex-col justify-center h-[80px] px-6 shrink-0 mt-2">
        <h1 className="text-[18px] font-bold text-white tracking-tight leading-tight">
          FoodStore Admin
        </h1>
        <p className="text-[12px] text-text-muted mt-0.5">
          Panel de Control
        </p>
      </div>

      {/* ── Navegación Principal ── */}
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start md:px-4 md:mt-4 gap-1 w-full">
        {mainNavItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-[14px] font-medium ${
                isActive
                  ? 'bg-primary text-white' // Ítem Activo (Morado sólido)
                  : 'text-text-muted hover:text-text hover:bg-surface' // Ítem Inactivo
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.75} />
                <span className="hidden md:inline">{name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Navegación Inferior (Settings, Logout) ── */}
      <div className="hidden md:flex flex-col px-4 pb-6 gap-1 shrink-0">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors text-[14px] font-medium w-full text-left">
          <Settings className="w-5 h-5" strokeWidth={1.75} />
          <span>Configuración</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors text-[14px] font-medium w-full text-left mt-1">
          <LogOut className="w-5 h-5" strokeWidth={1.75} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
