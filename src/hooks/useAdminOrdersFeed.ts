import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWsStore } from '../store/useWsStore';

type WebSocketEvent = {
  event: string;
  data: any;
};

/**
 * Hook para la conexión WebSocket del Feed de Pedidos del Administrador.
 * Implementa Reconexión Exponencial (Exponential Backoff) y actualiza el estado global (useWsStore).
 */
export const useAdminOrdersFeed = (url: string) => {
  const queryClient = useQueryClient();
  const setIsConnected = useWsStore((state) => state.setIsConnected);
  const isConnected = useWsStore((state) => state.isConnected);
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<number>(1000); // Inicia en 1 segundo
  const maxReconnectInterval = 30000; // Máximo 30 segundos
  const isComponentUnmounted = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || isComponentUnmounted.current) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectInterval.current = 1000; // Resetear backoff en éxito
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketEvent;
        console.log('WebSocket message received:', message);
        
        // Invalidate relevant queries when a websocket event occurs
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-sales-over-time'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-orders-by-status'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-top-products'] });
        
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason);
      setIsConnected(false);
      
      if (!isComponentUnmounted.current) {
        // Exponential backoff
        console.log(`Reconnecting in ${reconnectInterval.current}ms...`);
        setTimeout(() => {
          connect();
        }, reconnectInterval.current);
        
        reconnectInterval.current = Math.min(reconnectInterval.current * 2, maxReconnectInterval);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [url, setIsConnected]);

  useEffect(() => {
    isComponentUnmounted.current = false;
    connect();
    return () => {
      isComponentUnmounted.current = true;
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((action: string, payload: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action, ...payload }));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
};
