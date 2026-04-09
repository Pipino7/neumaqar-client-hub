import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  Package,
  Eye,
  Edit,
  Wrench,
  Clock,
  MoreHorizontal,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCLP } from '@/lib/utils/formatters';

type EquipmentStatus = 'DISPONIBLE' | 'EN_ARRIENDO' | 'MANTENCION' | 'FUERA_SERVICIO';

interface EquipmentItem {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  estado: EquipmentStatus;
  precioDia: number;
  precioSemana: number;
  precioMes: number;
  ultimaMantencion?: string;
  proximaMantencion?: string;
  clienteActual?: string;
  ubicacion?: string;
}

const mockMachinery: EquipmentItem[] = [
  { id: 'eq-001', codigo: 'RET-001', nombre: 'Retroexcavadora CAT 420F', categoria: 'Excavadoras', estado: 'EN_ARRIENDO', precioDia: 180000, precioSemana: 900000, precioMes: 2800000, ultimaMantencion: '2024-01-15', proximaMantencion: '2024-04-15', clienteActual: 'Constructora Los Andes SpA', ubicacion: 'Obra Av. Principal 1234' },
  { id: 'eq-002', codigo: 'MNC-001', nombre: 'Minicargador Bobcat S650', categoria: 'Cargadores', estado: 'DISPONIBLE', precioDia: 120000, precioSemana: 600000, precioMes: 1800000, ultimaMantencion: '2024-02-01', proximaMantencion: '2024-05-01', ubicacion: 'Bodega Central' },
  { id: 'eq-003', codigo: 'ROD-001', nombre: 'Rodillo Compactador BOMAG', categoria: 'Compactadores', estado: 'MANTENCION', precioDia: 85000, precioSemana: 450000, precioMes: 1400000, ultimaMantencion: '2024-02-20', proximaMantencion: '2024-02-28', ubicacion: 'Taller Mecánico' },
  { id: 'eq-004', codigo: 'GEN-001', nombre: 'Generador 50KVA', categoria: 'Generadores', estado: 'DISPONIBLE', precioDia: 65000, precioSemana: 350000, precioMes: 1100000, ultimaMantencion: '2024-01-10', proximaMantencion: '2024-04-10', ubicacion: 'Bodega Central' },
  { id: 'eq-005', codigo: 'GRU-001', nombre: 'Grúa Horquilla 3T', categoria: 'Grúas', estado: 'EN_ARRIENDO', precioDia: 95000, precioSemana: 500000, precioMes: 1500000, ultimaMantencion: '2024-02-05', proximaMantencion: '2024-05-05', clienteActual: 'Juan Pérez González', ubicacion: 'Parcela 45, Colina' },
  { id: 'eq-006', codigo: 'PLA-001', nombre: 'Placa Compactadora', categoria: 'Compactadores', estado: 'DISPONIBLE', precioDia: 35000, precioSemana: 180000, precioMes: 550000, ultimaMantencion: '2024-02-15', proximaMantencion: '2024-05-15', ubicacion: 'Bodega Central' },
  { id: 'eq-007', codigo: 'MAR-001', nombre: 'Martillo Demoledor', categoria: 'Accesorios', estado: 'FUERA_SERVICIO', precioDia: 75000, precioSemana: 400000, precioMes: 1200000, ultimaMantencion: '2024-01-20', ubicacion: 'Taller Externo - Reparación' },
  { id: 'eq-008', codigo: 'AND-001', nombre: 'Andamio Tubular 10m', categoria: 'Andamios', estado: 'EN_ARRIENDO', precioDia: 25000, precioSemana: 130000, precioMes: 400000, ultimaMantencion: '2024-02-10', proximaMantencion: '2024-08-10', clienteActual: 'Pinturas Express Ltda', ubicacion: 'Edificio Torre Norte' },
  { id: 'eq-009', codigo: 'RET-002', nombre: 'Retroexcavadora JCB 3CX', categoria: 'Excavadoras', estado: 'DISPONIBLE', precioDia: 170000, precioSemana: 850000, precioMes: 2600000, ultimaMantencion: '2024-02-18', proximaMantencion: '2024-05-18', ubicacion: 'Bodega Central' },
  { id: 'eq-010', codigo: 'GEN-002', nombre: 'Generador 100KVA', categoria: 'Generadores', estado: 'MANTENCION', precioDia: 95000, precioSemana: 500000, precioMes: 1600000, ultimaMantencion: '2024-02-22', proximaMantencion: '2024-02-25', ubicacion: 'Taller Mecánico' },
];

const statusConfig: Record<EquipmentStatus, { label: string; dotClass: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DISPONIBLE: { label: 'Disponible', dotClass: 'bg-emerald-500', badgeVariant: 'outline' },
  EN_ARRIENDO: { label: 'En Arriendo', dotClass: 'bg-blue-500', badgeVariant: 'outline' },
  MANTENCION: { label: 'Mantención', dotClass: 'bg-amber-500', badgeVariant: 'outline' },
  FUERA_SERVICIO: { label: 'Fuera Servicio', dotClass: 'bg-red-500', badgeVariant: 'destructive' },
};

type FilterTab = 'TODOS' | EquipmentStatus;

const Machinery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('TODOS');

  const stats = useMemo(() => ({
    total: mockMachinery.length,
    disponible: mockMachinery.filter((e) => e.estado === 'DISPONIBLE').length,
    enArriendo: mockMachinery.filter((e) => e.estado === 'EN_ARRIENDO').length,
    mantencion: mockMachinery.filter((e) => e.estado === 'MANTENCION').length,
    fueraServicio: mockMachinery.filter((e) => e.estado === 'FUERA_SERVICIO').length,
  }), []);

  const filtered = useMemo(() => {
    let items = mockMachinery;
    if (activeTab !== 'TODOS') {
      items = items.filter((e) => e.estado === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (e) =>
          e.nombre.toLowerCase().includes(q) ||
          e.codigo.toLowerCase().includes(q) ||
          e.categoria.toLowerCase().includes(q) ||
          e.clienteActual?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [searchQuery, activeTab]);

  const tabs: { key: FilterTab; label: string; count: number; dot?: string }[] = [
    { key: 'TODOS', label: 'Todos', count: stats.total },
    { key: 'DISPONIBLE', label: 'Disponible', count: stats.disponible, dot: 'bg-emerald-500' },
    { key: 'EN_ARRIENDO', label: 'En Arriendo', count: stats.enArriendo, dot: 'bg-blue-500' },
    { key: 'MANTENCION', label: 'Mantención', count: stats.mantencion, dot: 'bg-amber-500' },
    { key: 'FUERA_SERVICIO', label: 'Fuera Servicio', count: stats.fueraServicio, dot: 'bg-red-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Maquinaria</h1>
            <p className="text-sm text-muted-foreground">{stats.total} equipos registrados</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Package className="h-4 w-4" />
                Agregar Equipo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Tag className="h-4 w-4" />
                Nueva Marca
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Nueva Categoría
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                Gestionar Marcas y Categorías
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                {tab.label}
                <span className="text-[10px] text-muted-foreground ml-0.5">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar código, nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[100px] text-xs font-semibold">Código</TableHead>
                <TableHead className="text-xs font-semibold">Equipo</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell">Categoría</TableHead>
                <TableHead className="text-xs font-semibold">Estado</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">Ubicación / Cliente</TableHead>
                <TableHead className="text-xs font-semibold text-right">$/Día</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No se encontraron equipos</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((eq) => {
                  const st = statusConfig[eq.estado];
                  return (
                    <TableRow key={eq.id} className="group cursor-pointer">
                      <TableCell className="font-mono text-xs text-muted-foreground py-2.5">
                        {eq.codigo}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-sm font-medium">{eq.nombre}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2.5">
                        <span className="text-xs text-muted-foreground">{eq.categoria}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${st.dotClass}`} />
                          <span className="text-xs">{st.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-2.5">
                        {eq.clienteActual ? (
                          <div>
                            <span className="text-xs font-medium">{eq.clienteActual}</span>
                            {eq.ubicacion && (
                              <span className="text-[11px] text-muted-foreground block">{eq.ubicacion}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">{eq.ubicacion ?? '—'}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-2.5">
                        <span className="text-sm font-medium tabular-nums">{formatCLP(eq.precioDia)}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" />Ver Detalle</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem><Wrench className="h-3.5 w-3.5 mr-2" />Mantención</DropdownMenuItem>
                            <DropdownMenuItem><Clock className="h-3.5 w-3.5 mr-2" />Historial</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>{filtered.length} de {stats.total} equipos</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.disponible} disponibles</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />{stats.enArriendo} arrendados</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{stats.mantencion} mantención</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Machinery;
