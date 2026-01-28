import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Eye,
  Edit,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  {
    id: 'eq-001',
    codigo: 'RET-001',
    nombre: 'Retroexcavadora CAT 420F',
    categoria: 'Excavadoras',
    estado: 'EN_ARRIENDO',
    precioDia: 180000,
    precioSemana: 900000,
    precioMes: 2800000,
    ultimaMantencion: '2024-01-15',
    proximaMantencion: '2024-04-15',
    clienteActual: 'Constructora Los Andes SpA',
    ubicacion: 'Obra Av. Principal 1234',
  },
  {
    id: 'eq-002',
    codigo: 'MNC-001',
    nombre: 'Minicargador Bobcat S650',
    categoria: 'Cargadores',
    estado: 'DISPONIBLE',
    precioDia: 120000,
    precioSemana: 600000,
    precioMes: 1800000,
    ultimaMantencion: '2024-02-01',
    proximaMantencion: '2024-05-01',
    ubicacion: 'Bodega Central',
  },
  {
    id: 'eq-003',
    codigo: 'ROD-001',
    nombre: 'Rodillo Compactador BOMAG',
    categoria: 'Compactadores',
    estado: 'MANTENCION',
    precioDia: 85000,
    precioSemana: 450000,
    precioMes: 1400000,
    ultimaMantencion: '2024-02-20',
    proximaMantencion: '2024-02-28',
    ubicacion: 'Taller Mecánico',
  },
  {
    id: 'eq-004',
    codigo: 'GEN-001',
    nombre: 'Generador 50KVA',
    categoria: 'Generadores',
    estado: 'DISPONIBLE',
    precioDia: 65000,
    precioSemana: 350000,
    precioMes: 1100000,
    ultimaMantencion: '2024-01-10',
    proximaMantencion: '2024-04-10',
    ubicacion: 'Bodega Central',
  },
  {
    id: 'eq-005',
    codigo: 'GRU-001',
    nombre: 'Grúa Horquilla 3T',
    categoria: 'Grúas',
    estado: 'EN_ARRIENDO',
    precioDia: 95000,
    precioSemana: 500000,
    precioMes: 1500000,
    ultimaMantencion: '2024-02-05',
    proximaMantencion: '2024-05-05',
    clienteActual: 'Juan Pérez González',
    ubicacion: 'Parcela 45, Colina',
  },
  {
    id: 'eq-006',
    codigo: 'PLA-001',
    nombre: 'Placa Compactadora',
    categoria: 'Compactadores',
    estado: 'DISPONIBLE',
    precioDia: 35000,
    precioSemana: 180000,
    precioMes: 550000,
    ultimaMantencion: '2024-02-15',
    proximaMantencion: '2024-05-15',
    ubicacion: 'Bodega Central',
  },
  {
    id: 'eq-007',
    codigo: 'MAR-001',
    nombre: 'Martillo Demoledor',
    categoria: 'Accesorios',
    estado: 'FUERA_SERVICIO',
    precioDia: 75000,
    precioSemana: 400000,
    precioMes: 1200000,
    ultimaMantencion: '2024-01-20',
    ubicacion: 'Taller Externo - Reparación',
  },
  {
    id: 'eq-008',
    codigo: 'AND-001',
    nombre: 'Andamio Tubular 10m',
    categoria: 'Andamios',
    estado: 'EN_ARRIENDO',
    precioDia: 25000,
    precioSemana: 130000,
    precioMes: 400000,
    ultimaMantencion: '2024-02-10',
    proximaMantencion: '2024-08-10',
    clienteActual: 'Pinturas Express Ltda',
    ubicacion: 'Edificio Torre Norte',
  },
  {
    id: 'eq-009',
    codigo: 'RET-002',
    nombre: 'Retroexcavadora JCB 3CX',
    categoria: 'Excavadoras',
    estado: 'DISPONIBLE',
    precioDia: 170000,
    precioSemana: 850000,
    precioMes: 2600000,
    ultimaMantencion: '2024-02-18',
    proximaMantencion: '2024-05-18',
    ubicacion: 'Bodega Central',
  },
  {
    id: 'eq-010',
    codigo: 'GEN-002',
    nombre: 'Generador 100KVA',
    categoria: 'Generadores',
    estado: 'MANTENCION',
    precioDia: 95000,
    precioSemana: 500000,
    precioMes: 1600000,
    ultimaMantencion: '2024-02-22',
    proximaMantencion: '2024-02-25',
    ubicacion: 'Taller Mecánico',
  },
];

const statusConfig: Record<EquipmentStatus, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  DISPONIBLE: {
    label: 'Disponible',
    icon: CheckCircle2,
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  EN_ARRIENDO: {
    label: 'En Arriendo',
    icon: Clock,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  MANTENCION: {
    label: 'En Mantención',
    icon: Wrench,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  FUERA_SERVICIO: {
    label: 'Fuera de Servicio',
    icon: AlertTriangle,
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
};

const Machinery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<EquipmentStatus, boolean>>({
    DISPONIBLE: true,
    EN_ARRIENDO: true,
    MANTENCION: true,
    FUERA_SERVICIO: true,
  });

  const filteredMachinery = useMemo(() => {
    if (!searchQuery) return mockMachinery;
    const query = searchQuery.toLowerCase();
    return mockMachinery.filter(
      (eq) =>
        eq.nombre.toLowerCase().includes(query) ||
        eq.codigo.toLowerCase().includes(query) ||
        eq.categoria.toLowerCase().includes(query) ||
        eq.clienteActual?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedByStatus = useMemo(() => {
    const groups: Record<EquipmentStatus, EquipmentItem[]> = {
      DISPONIBLE: [],
      EN_ARRIENDO: [],
      MANTENCION: [],
      FUERA_SERVICIO: [],
    };
    filteredMachinery.forEach((eq) => {
      groups[eq.estado].push(eq);
    });
    return groups;
  }, [filteredMachinery]);

  const stats = useMemo(() => ({
    total: mockMachinery.length,
    disponible: mockMachinery.filter((e) => e.estado === 'DISPONIBLE').length,
    enArriendo: mockMachinery.filter((e) => e.estado === 'EN_ARRIENDO').length,
    mantencion: mockMachinery.filter((e) => e.estado === 'MANTENCION').length,
    fueraServicio: mockMachinery.filter((e) => e.estado === 'FUERA_SERVICIO').length,
  }), []);

  const toggleSection = (status: EquipmentStatus) => {
    setOpenSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inventario de Maquinaria</h1>
            <p className="text-muted-foreground">
              Gestiona el estado y disponibilidad de tus equipos
            </p>
          </div>
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Agregar Equipo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Equipos</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-700">{stats.disponible}</div>
              <div className="text-sm text-green-600">Disponibles</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-700">{stats.enArriendo}</div>
              <div className="text-sm text-blue-600">En Arriendo</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-700">{stats.mantencion}</div>
              <div className="text-sm text-amber-600">Mantención</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-700">{stats.fueraServicio}</div>
              <div className="text-sm text-red-600">Fuera Servicio</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nombre, categoría o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tree View by Status */}
        <div className="space-y-4">
          {(Object.keys(statusConfig) as EquipmentStatus[]).map((status) => {
            const config = statusConfig[status];
            const items = groupedByStatus[status];
            const Icon = config.icon;

            return (
              <Collapsible
                key={status}
                open={openSections[status]}
                onOpenChange={() => toggleSection(status)}
              >
                <Card className={`border-2 ${config.bgColor}`}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {openSections[status] ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <Icon className={`h-5 w-5 ${config.color}`} />
                          <CardTitle className="text-lg">{config.label}</CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            {items.length}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No hay equipos en este estado
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {items.map((eq) => (
                            <EquipmentCard key={eq.id} equipment={eq} />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

const EquipmentCard = ({ equipment }: { equipment: EquipmentItem }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-background border-2 border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">{equipment.codigo}</span>
            <span className="font-semibold">{equipment.nombre}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span>{equipment.categoria}</span>
            <span>•</span>
            <span>{formatCLP(equipment.precioDia)}/día</span>
            {equipment.ubicacion && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px]">{equipment.ubicacion}</span>
              </>
            )}
          </div>
          {equipment.clienteActual && (
            <div className="text-sm text-primary font-medium mt-1">
              Cliente: {equipment.clienteActual}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Wrench className="h-4 w-4 mr-2" />
              Enviar a Mantención
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="h-4 w-4 mr-2" />
              Ver Historial
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Machinery;
