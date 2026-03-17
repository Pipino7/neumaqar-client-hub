import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  Truck,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { formatCLP } from '@/lib/utils/formatters';

// --- Mock data for charts ---
const revenueByMonth = [
  { mes: 'Ene', ingresos: 4200000, gastos: 1800000 },
  { mes: 'Feb', ingresos: 3800000, gastos: 1600000 },
  { mes: 'Mar', ingresos: 5100000, gastos: 2100000 },
  { mes: 'Abr', ingresos: 4700000, gastos: 1900000 },
  { mes: 'May', ingresos: 6300000, gastos: 2400000 },
  { mes: 'Jun', ingresos: 5800000, gastos: 2200000 },
  { mes: 'Jul', ingresos: 7200000, gastos: 2800000 },
  { mes: 'Ago', ingresos: 6900000, gastos: 2600000 },
  { mes: 'Sep', ingresos: 7800000, gastos: 3000000 },
  { mes: 'Oct', ingresos: 8200000, gastos: 3200000 },
  { mes: 'Nov', ingresos: 7500000, gastos: 2900000 },
  { mes: 'Dic', ingresos: 9100000, gastos: 3500000 },
];

const equipmentUtilization = [
  { nombre: 'Retroexcavadora', uso: 92 },
  { nombre: 'Grúa Torre', uso: 85 },
  { nombre: 'Compactador', uso: 78 },
  { nombre: 'Generador', uso: 71 },
  { nombre: 'Excavadora', uso: 68 },
  { nombre: 'Vibrador', uso: 55 },
  { nombre: 'Betonera', uso: 42 },
];

const rentalsByStatus = [
  { name: 'Activos', value: 24, color: 'hsl(142, 71%, 45%)' },
  { name: 'Borradores', value: 8, color: 'hsl(0, 0%, 60%)' },
  { name: 'Devueltos', value: 45, color: 'hsl(221, 83%, 53%)' },
  { name: 'Atrasados', value: 5, color: 'hsl(0, 84%, 60%)' },
  { name: 'Anulados', value: 3, color: 'hsl(0, 0%, 35%)' },
];

const topClients = [
  { nombre: 'Constructora Andes SpA', arriendos: 12, total: 18500000, saldo: 2300000 },
  { nombre: 'Minera del Norte Ltda', arriendos: 8, total: 14200000, saldo: 0 },
  { nombre: 'Obras Civiles González', arriendos: 7, total: 9800000, saldo: 1500000 },
  { nombre: 'Inmobiliaria Pacífico SA', arriendos: 6, total: 8100000, saldo: 800000 },
  { nombre: 'Carlos Muñoz Tapia', arriendos: 5, total: 4300000, saldo: 0 },
];

const overdueRentals = [
  { folio: 'ARR-2025-0042', cliente: 'Obras Civiles González', dias: 12, saldo: 1500000 },
  { folio: 'ARR-2025-0038', cliente: 'Juan Pérez Soto', dias: 7, saldo: 450000 },
  { folio: 'ARR-2025-0051', cliente: 'Constructora Andes SpA', dias: 3, saldo: 2300000 },
  { folio: 'ARR-2025-0055', cliente: 'Transportes Biobío', dias: 2, saldo: 680000 },
];

const weeklyActivity = [
  { dia: 'Lun', nuevos: 3, devueltos: 2, pagos: 5 },
  { dia: 'Mar', nuevos: 5, devueltos: 1, pagos: 4 },
  { dia: 'Mie', nuevos: 2, devueltos: 3, pagos: 6 },
  { dia: 'Jue', nuevos: 4, devueltos: 2, pagos: 3 },
  { dia: 'Vie', nuevos: 6, devueltos: 4, pagos: 8 },
  { dia: 'Sab', nuevos: 1, devueltos: 1, pagos: 2 },
  { dia: 'Dom', nuevos: 0, devueltos: 0, pagos: 0 },
];

const maintenanceSchedule = [
  { equipo: 'Retroexcavadora CAT 320', tipo: 'Preventiva', fecha: '18 Mar 2025', estado: 'Programada' },
  { equipo: 'Grúa Torre Liebherr', tipo: 'Correctiva', fecha: '20 Mar 2025', estado: 'Urgente' },
  { equipo: 'Generador 150 KVA', tipo: 'Preventiva', fecha: '25 Mar 2025', estado: 'Programada' },
  { equipo: 'Compactador Dynapac', tipo: 'Revisión', fecha: '01 Abr 2025', estado: 'Pendiente' },
];

// --- Stat Card ---
const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  subtitle?: string;
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2 border-2 border-foreground bg-secondary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        {changeType === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />}
        {changeType === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />}
        <span className={changeType === 'up' ? 'text-green-600 font-medium' : changeType === 'down' ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
          {change}
        </span>
        <span className="text-muted-foreground">vs mes anterior</span>
      </div>
    </CardContent>
  </Card>
);

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-foreground bg-card p-3 text-xs shadow-md">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4">
          <span>{entry.name}:</span>
          <span className="font-mono font-medium">
            {typeof entry.value === 'number' && entry.value > 1000
              ? formatCLP(entry.value)
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ingresos del Mes"
            value={formatCLP(9100000)}
            change="+21.3%"
            changeType="up"
            icon={DollarSign}
            subtitle="Diciembre 2025"
          />
          <StatCard
            title="Arriendos Activos"
            value="24"
            change="+4"
            changeType="up"
            icon={FileText}
            subtitle="5 próximos a vencer"
          />
          <StatCard
            title="Equipos en Uso"
            value="18 / 32"
            change="56%"
            changeType="neutral"
            icon={Truck}
            subtitle="14 disponibles"
          />
          <StatCard
            title="Saldo por Cobrar"
            value={formatCLP(4930000)}
            change="-12%"
            changeType="down"
            icon={AlertTriangle}
            subtitle="5 clientes con deuda"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Ingresos vs Gastos</CardTitle>
                  <CardDescription>Evolución mensual — 2025</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" /> +21% YoY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,85%)" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="hsl(0,0%,0%)" fill="hsl(0,0%,0%)" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="gastos" name="Gastos" stroke="hsl(0,84%,60%)" fill="hsl(0,84%,60%)" fillOpacity={0.08} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rentals by Status Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Arriendos por Estado</CardTitle>
              <CardDescription>Distribución actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rentalsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="hsl(0,0%,0%)"
                      strokeWidth={2}
                    >
                      {rentalsByStatus.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {rentalsByStatus.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 border border-foreground" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-bold ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Equipment Utilization */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Utilización de Equipos</CardTitle>
              <CardDescription>% de días arrendados últimos 90 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentUtilization} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,85%)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="uso" name="Utilización %" fill="hsl(0,0%,0%)" radius={[0, 2, 2, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Actividad Semanal</CardTitle>
              <CardDescription>Arriendos nuevos, devoluciones y pagos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,85%)" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="nuevos" name="Nuevos" fill="hsl(0,0%,0%)" barSize={14} />
                    <Bar dataKey="devueltos" name="Devueltos" fill="hsl(221,83%,53%)" barSize={14} />
                    <Bar dataKey="pagos" name="Pagos" fill="hsl(142,71%,45%)" barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Clients */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Top Clientes</CardTitle>
                  <CardDescription>Por volumen de arriendos</CardDescription>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topClients.map((client, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 border-2 border-foreground bg-secondary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium leading-tight">{client.nombre}</p>
                        <p className="text-xs text-muted-foreground">{client.arriendos} arriendos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold">{formatCLP(client.total)}</p>
                      {client.saldo > 0 && (
                        <p className="text-xs text-red-600 font-mono">Saldo: {formatCLP(client.saldo)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overdue + Maintenance */}
          <div className="space-y-4">
            {/* Overdue */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Arriendos Atrasados
                    </CardTitle>
                    <CardDescription>Requieren acción inmediata</CardDescription>
                  </div>
                  <Badge variant="destructive" className="font-mono">{overdueRentals.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {overdueRentals.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-2.5 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="text-sm font-mono font-medium">{r.folio}</p>
                        <p className="text-xs text-muted-foreground">{r.cliente}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <Badge variant="outline" className="text-red-600 border-red-300 text-xs font-mono">
                          <Clock className="h-3 w-3 mr-1" />
                          {r.dias}d
                        </Badge>
                        <span className="text-sm font-mono font-bold">{formatCLP(r.saldo)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Mantenciones Próximas
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {maintenanceSchedule.map((m, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-2.5 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{m.equipo}</p>
                        <p className="text-xs text-muted-foreground">{m.tipo} — {m.fecha}</p>
                      </div>
                      <Badge
                        variant={m.estado === 'Urgente' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {m.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
