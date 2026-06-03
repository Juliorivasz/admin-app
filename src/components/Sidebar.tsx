import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { 
  Box, 
  UtensilsCrossed, 
  LayoutGrid, 
  ClipboardList,
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
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  const mainNavItems = [
    { name: 'Dashboard',    path: '/',             icon: LayoutDashboard, roles: ['ADMIN'] },
    { name: 'Pedidos',      path: '/pedidos',      icon: ClipboardList,   roles: ['ADMIN', 'PEDIDOS'] },
    { name: 'Productos',    path: '/productos',    icon: Box,             roles: ['ADMIN', 'STOCK'] },
    { name: 'Ingredientes', path: '/ingredientes', icon: UtensilsCrossed, roles: ['ADMIN', 'STOCK'] },
    { name: 'Categorías',   path: '/categorias',   icon: LayoutGrid,      roles: ['ADMIN', 'STOCK'] },
    { name: 'Usuarios',     path: '/usuarios',     icon: Users,           roles: ['ADMIN'] },
  ];

  // Filtrar las opciones del menú según los roles del usuario logueado
  const filteredNavItems = mainNavItems.filter(item => {
    return user?.roles?.some(role => item.roles.includes(role));
  });

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border flex flex-row md:relative md:w-[240px] md:flex-col md:shrink-0 md:border-t-0 md:border-r md:min-h-screen">
      
      {/* ── Logo Area ── */}
      <div className="hidden md:flex flex-col justify-center h-[80px] px-6 shrink-0 mt-2">
        <h1 className="text-[18px] font-bold text-white tracking-tight leading-tight">
          FoodStore Admin
        </h1>
        <p className="text-[12px] text-text-muted mt-0.5">
          {user ? `${user.name} ${user.lastname}` : 'Panel de Control'}
        </p>
      </div>

      {/* ── Navegación Principal ── */}
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start md:px-4 md:mt-4 gap-1 w-full overflow-y-auto">
        {filteredNavItems.map(({ name, path, icon: Icon }) => (
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
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors text-[14px] font-medium w-full text-left mt-1" onClick={logout}>
          <LogOut className="w-5 h-5" strokeWidth={1.75} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
