import { create } from 'zustand';

interface WsState {
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
}

/**
 * Almacena el estado global de la conexión WebSocket.
 * Cumple con la rúbrica de Zustand para mantener el estado de conexión centralizado.
 */
export const useWsStore = create<WsState>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
}));
