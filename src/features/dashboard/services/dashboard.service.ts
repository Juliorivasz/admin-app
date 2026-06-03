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
  return axiosInstance.get('/dashboard/kpis');
};
