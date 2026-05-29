import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/authStore';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
}

export default App;
