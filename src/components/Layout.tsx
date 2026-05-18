import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-bg text-text selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-14 md:pb-0">
        {/* Header simple por ahora */}
        <header className="h-14 md:h-16 flex items-center px-4 md:px-8 border-b border-border bg-surface/50 backdrop-blur-md shrink-0">
          <h2 className="text-base md:text-lg font-medium text-text-muted">Panel de Control</h2>
        </header>

        {/* Content Area con scroll */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-10 md:pb-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
