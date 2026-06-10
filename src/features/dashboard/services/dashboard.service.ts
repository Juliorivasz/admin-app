import axiosInstance from '../../../api/axios';

export interface KpiMetric {
  value: number;
  trend: string;
  status: 'up' | 'down' | 'neutral';
  label: string;
  subtext: string;
}

export interface DashboardKpis {
  recaudacion: KpiMetric;
  pedidos_completados: KpiMetric;
  pedidos_pendientes: KpiMetric;
  bajo_stock: KpiMetric;
}

export const getKpis = async (): Promise<DashboardKpis> => {
  return await axiosInstance.get('/dashboard/kpis');
};

export interface ChartDataPoint {
  label: string;
  value: number;
  count?: number;
}

export interface ChartResponse {
  data: ChartDataPoint[];
}

export const getSalesOverTime = async (): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/sales-over-time');
};

export const getOrdersByStatus = async (): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/orders-by-status');
};

export const getTopProducts = async (): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/top-products');
};
