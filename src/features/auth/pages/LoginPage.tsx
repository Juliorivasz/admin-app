import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../../../components/ui/Button';

import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Iniciando petición al backend...');
      await login({ email, password });
      console.log('Petición exitosa, navegando a / ...');
      navigate('/');
    } catch (err: any) {
      console.error('Error capturado en el login:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      
      {/* Elementos decorativos de fondo */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-surface/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Cabecera del form */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            FoodStore Admin
          </h1>
          <p className="text-[14px] text-text-muted mt-2">
            Ingresa tus credenciales para acceder al panel de control.
          </p>
        </div>

        {error && (
          <div className="mx-8 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-muted ml-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted/60" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#14141E] border border-border rounded-xl text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]"
                placeholder="admin@foodstore.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[13px] font-medium text-text-muted">Contraseña</label>
              <a href="#" className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted/60" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#14141E] border border-border rounded-xl text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 mt-4 text-[14px] font-semibold h-[46px] rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Ingresar al Panel
              </span>
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
