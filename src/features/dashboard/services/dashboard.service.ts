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

export const getKpis = async (startDate?: string, endDate?: string): Promise<DashboardKpis> => {
  return await axiosInstance.get('/dashboard/kpis', { params: { start_date: startDate, end_date: endDate } });
};

export interface ChartDataPoint {
  label: string;
  value: number;
  count?: number;
}

export interface ChartResponse {
  data: ChartDataPoint[];
}

export const getSalesOverTime = async (startDate?: string, endDate?: string): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/sales-over-time', { params: { start_date: startDate, end_date: endDate } });
};

export const getOrdersByStatus = async (startDate?: string, endDate?: string): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/orders-by-status', { params: { start_date: startDate, end_date: endDate } });
};

export const getTopProducts = async (startDate?: string, endDate?: string): Promise<ChartResponse> => {
  return await axiosInstance.get('/dashboard/top-products', { params: { start_date: startDate, end_date: endDate } });
};
