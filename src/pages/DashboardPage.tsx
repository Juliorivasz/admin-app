import { DollarSign, Package, ShoppingCart, TrendingUp, RotateCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getKpis } from '../features/dashboard/services/dashboard.service';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const { data: kpis, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: getKpis,
  });

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
          <Button variant="primary" className="px-4 py-2 text-[13px]" onClick={() => refetch()}>
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

      <div className="bg-surface rounded-xl border border-border p-6 flex-1 min-h-[300px] flex items-center justify-center">
        <p className="text-text-muted text-[14px]">
          (Aquí iría un gráfico de ventas por hora o semana)
        </p>
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
