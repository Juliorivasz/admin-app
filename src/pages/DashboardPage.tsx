import { DollarSign, Package, ShoppingCart, TrendingUp, RotateCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getKpis, getSalesOverTime, getOrdersByStatus, getTopProducts } from '../features/dashboard/services/dashboard.service';
import Button from '../components/ui/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const DashboardPage = () => {
  const { data: kpis, isLoading: kpisLoading, isError: kpisError, refetch: refetchKpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: getKpis,
  });

  const { data: salesOverTime, refetch: refetchSales } = useQuery({
    queryKey: ['dashboard-sales-over-time'],
    queryFn: getSalesOverTime,
  });

  const { data: ordersByStatus, refetch: refetchOrders } = useQuery({
    queryKey: ['dashboard-orders-by-status'],
    queryFn: getOrdersByStatus,
  });

  const { data: topProducts, refetch: refetchTopProducts } = useQuery({
    queryKey: ['dashboard-top-products'],
    queryFn: getTopProducts,
  });

  const handleRefetch = () => {
    refetchKpis();
    refetchSales();
    refetchOrders();
    refetchTopProducts();
  };

  const isLoading = kpisLoading;
  const isError = kpisError;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center bg-surface rounded-xl p-6 border border-border shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Dashboard
          </h1>
          <p className="text-[14px] text-text-muted font-normal">
            Resumen de actividad y métricas clave del día.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" className="px-4 py-2 text-[13px]" onClick={handleRefetch}>
            <RotateCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-text-muted">Cargando métricas...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-red-500">Error al cargar las métricas. Verifica tu conexión o sesión.</p>
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={kpis.recaudacion.label}
            value={`$${kpis.recaudacion.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-5 h-5" />}
            trend={kpis.recaudacion.trend}
            trendPositive={kpis.recaudacion.status === 'up'}
          />
          <MetricCard
            title={kpis.pedidos_completados.label}
            value={kpis.pedidos_completados.value.toString()}
            icon={<ShoppingCart className="w-5 h-5" />}
            trend={kpis.pedidos_completados.trend}
            trendPositive={kpis.pedidos_completados.status === 'up'}
          />
          <MetricCard
            title={kpis.pedidos_pendientes.label}
            value={kpis.pedidos_pendientes.value.toString()}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={kpis.pedidos_pendientes.trend}
            trendPositive={kpis.pedidos_pendientes.status === 'up'}
          />
          <MetricCard
            title={kpis.bajo_stock.label}
            value={kpis.bajo_stock.value.toString()}
            icon={<Package className="w-5 h-5" />}
            trend={kpis.bajo_stock.trend}
            trendPositive={kpis.bajo_stock.status === 'up'}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Gráfico 1: LineChart Ventas (Cantidad) */}
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col gap-4 min-h-[300px]">
          <h3 className="text-text font-medium text-[15px]">Ventas de los últimos 30 días</h3>
          <div className="flex-1 w-full h-[250px] flex items-center justify-center">
            {salesOverTime ? (
              <div className="w-full h-full relative">
                <Line 
                  data={{
                    labels: salesOverTime.data.map(d => d.label),
                    datasets: [{
                      label: 'Pedidos',
                      data: salesOverTime.data.map(d => d.count || 0),
                      borderColor: '#6366f1',
                      backgroundColor: 'rgba(99, 102, 241, 0.5)',
                      tension: 0.3
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
                      y: { grid: { color: '#3E4260' }, ticks: { color: '#94A3B8' } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-text-muted text-[13px]">Cargando...</p>
            )}
          </div>
        </div>

        {/* Gráfico 2: BarChart Ingresos ($) */}
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col gap-4 min-h-[300px]">
          <h3 className="text-text font-medium text-[15px]">Ingresos de los últimos 30 días</h3>
          <div className="flex-1 w-full h-[250px] flex items-center justify-center">
            {salesOverTime ? (
              <div className="w-full h-full relative">
                <Bar 
                  data={{
                    labels: salesOverTime.data.map(d => d.label),
                    datasets: [{
                      label: 'Ingresos ($)',
                      data: salesOverTime.data.map(d => d.value),
                      backgroundColor: '#10b981',
                      borderRadius: 4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
                      y: { grid: { color: '#3E4260' }, ticks: { color: '#94A3B8' } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-text-muted text-[13px]">Cargando...</p>
            )}
          </div>
        </div>

        {/* Gráfico 3: PieChart Estados */}
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col gap-4 min-h-[300px]">
          <h3 className="text-text font-medium text-[15px]">Distribución por Estado</h3>
          <div className="flex-1 w-full h-[250px] flex items-center justify-center">
            {ordersByStatus ? (
              <div className="w-full h-full relative flex justify-center">
                <Pie 
                  data={{
                    labels: ordersByStatus.data.map(d => d.label),
                    datasets: [{
                      data: ordersByStatus.data.map(d => d.value),
                      backgroundColor: COLORS,
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right', labels: { color: '#E2E8F0' } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-text-muted text-[13px]">Cargando...</p>
            )}
          </div>
        </div>

        {/* Gráfico 4: BarChart Productos Más Vendidos */}
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col gap-4 min-h-[300px]">
          <h3 className="text-text font-medium text-[15px]">Top Productos</h3>
          <div className="flex-1 w-full h-[250px] flex items-center justify-center">
            {topProducts ? (
              <div className="w-full h-full relative">
                <Bar 
                  data={{
                    labels: topProducts.data.map(d => d.label),
                    datasets: [{
                      label: 'Vendidos',
                      data: topProducts.data.map(d => d.value),
                      backgroundColor: '#8b5cf6',
                      borderRadius: 4
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { color: '#3E4260' }, ticks: { color: '#94A3B8' } },
                      y: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-text-muted text-[13px]">Cargando...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendPositive: boolean;
}

const MetricCard = ({ title, value, icon, trend, trendPositive }: MetricCardProps) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 transition-opacity duration-300 hover:border-[#3E4260]">
      <div className="flex justify-between items-center">
        <h3 className="text-[14px] font-medium text-text-muted">{title}</h3>
        <div className="p-2 bg-bg rounded-lg text-primary">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-[24px] font-bold text-text">{value}</div>
        <p className={`text-[12px] font-medium mt-1 ${trendPositive ? 'text-green-500' : 'text-orange-400'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
