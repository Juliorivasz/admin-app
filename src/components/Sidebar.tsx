import { NavLink } from 'react-router-dom';
import { ChefHat, BookOpen, UtensilsCrossed } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Productos', path: '/productos', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { name: 'Categorías', path: '/categorias', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Ingredientes', path: '/ingredientes', icon: <ChefHat className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface-2 border-t border-border flex flex-row md:relative md:w-64 md:flex-col md:border-t-0 md:border-r md:min-h-screen shadow-[0_-4px_20px_rgba(0,0,0,0.3)] md:shadow-lg">
      <div className="hidden md:flex h-16 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          FoodStore Admin
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start md:py-6 md:px-4 md:space-y-2 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 py-2 md:px-4 md:py-3 md:rounded-xl transition-all duration-200 flex-1 md:flex-none justify-center ${
                isActive
                  ? 'text-primary md:bg-primary/10 font-semibold'
                  : 'text-text-muted hover:bg-surface md:hover:bg-surface hover:text-text'
              }`
            }
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            <span className="text-[10px] md:text-base">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="hidden md:block p-4 border-t border-border text-sm text-text-muted text-center shrink-0">
        Parcial 1 - UTN
      </div>
    </aside>
  );
};

export default Sidebar;
