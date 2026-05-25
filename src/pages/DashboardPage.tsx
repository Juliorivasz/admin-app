import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Recaudación Hoy"
          value="$1,240.00"
          icon={<DollarSign className="w-5 h-5" />}
          trend="+12% vs ayer"
          trendPositive={true}
        />
        <MetricCard
          title="Pedidos Completados"
          value="45"
          icon={<ShoppingCart className="w-5 h-5" />}
          trend="+5% vs ayer"
          trendPositive={true}
        />
        <MetricCard
          title="Pedidos Pendientes"
          value="8"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="-2% vs ayer"
          trendPositive={false}
        />
        <MetricCard
          title="Productos Bajo Stock"
          value="3"
          icon={<Package className="w-5 h-5" />}
          trend="Revisar inventario"
          trendPositive={false}
        />
      </div>

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
