import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Truck,
  FileText,
  DollarSign,
  ScanBarcode,
  Search,
  Plus,
  Wrench,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  User,
  Building2,
  Check,
} from 'lucide-react';
import { mockEquipment } from '@/data/mockEquipment';
import { mockCustomers } from '@/data/mockCustomers';
import { Equipment, RentalItem, RateType } from '@/types/rental';
import { Customer } from '@/types/customer';
import { formatCurrency, formatCLP } from '@/lib/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { MachineSelectorPanel } from '@/components/rentals/MachineSelectorPanel';

// Mock recent activity
const recentActivity = [
  { tipo: 'arriendo', descripcion: 'Nuevo arriendo ARR-2025-0058 — Constructora Andes SpA', hora: 'Hace 15 min', icono: FileText },
  { tipo: 'pago', descripcion: 'Pago recibido $1.200.000 — Minera del Norte Ltda', hora: 'Hace 45 min', icono: DollarSign },
  { tipo: 'devolucion', descripcion: 'Devolución Retroexcavadora CAT 420F — ARR-2025-0042', hora: 'Hace 2 hrs', icono: CheckCircle2 },
  { tipo: 'mantencion', descripcion: 'Mantención programada — Grúa Torre Liebherr', hora: 'Hace 3 hrs', icono: Wrench },
  { tipo: 'atraso', descripcion: 'Arriendo ARR-2025-0038 atrasado 7 días — Juan Pérez Soto', hora: 'Hace 5 hrs', icono: AlertTriangle },
];

// KPI Card
const KPICard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{value}</p>
        </div>
        <div className="p-2 border-2 border-foreground bg-secondary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { toast } = useToast();
  const [machineCode, setMachineCode] = useState('');
  const [foundEquipment, setFoundEquipment] = useState<Equipment | null>(null);
  const [searchError, setSearchError] = useState(false);

  // Rental creation modal (full screen)
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [preselectedEquipment, setPreselectedEquipment] = useState<Equipment | null>(null);

  // Rental modal state
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);

  const handleSearch = () => {
    if (!machineCode.trim()) return;
    const found = mockEquipment.find(
      (eq) => eq.codigo.toLowerCase() === machineCode.trim().toLowerCase()
    );
    if (found) {
      setFoundEquipment(found);
      setSearchError(false);
    } else {
      setFoundEquipment(null);
      setSearchError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const openRentalWithEquipment = (eq: Equipment) => {
    setPreselectedEquipment(eq);
    const item: RentalItem = {
      id: `item-${Date.now()}`,
      equipmentId: eq.id,
      equipment: eq,
      cantidad: 1,
      tarifaTipo: 'DIA',
      precioUnitario: eq.precioDia,
      diasEstimados: 1,
      deposito: eq.depositoSugerido,
      subtotal: eq.precioDia,
    };
    setRentalItems([item]);
    setSelectedClient(null);
    setClientSearch('');
    setEquipmentSearch('');
    setIsRentalModalOpen(true);
  };

  const openMaintenanceToast = (eq: Equipment) => {
    toast({
      title: 'Mantención iniciada',
      description: `Se registró orden de mantención para ${eq.nombre} (${eq.codigo})`,
    });
  };

  // --- Rental modal helpers ---
  const filteredClients = useMemo(() => {
    if (!clientSearch) return mockCustomers.filter((c) => c.estado === 'ACTIVO').slice(0, 6);
    const q = clientSearch.toLowerCase();
    return mockCustomers.filter(
      (c) => c.estado === 'ACTIVO' && (c.nombre.toLowerCase().includes(q) || c.rut.toLowerCase().includes(q))
    );
  }, [clientSearch]);

  const filteredEquipment = useMemo(() => {
    if (!equipmentSearch) return mockEquipment.filter((eq) => eq.disponible);
    const q = equipmentSearch.toLowerCase();
    return mockEquipment.filter(
      (eq) => eq.disponible && (eq.nombre.toLowerCase().includes(q) || eq.codigo.toLowerCase().includes(q))
    );
  }, [equipmentSearch]);

  const addItemToRental = (eq: Equipment) => {
    const exists = rentalItems.find((i) => i.equipmentId === eq.id);
    if (exists) return;
    const newItem: RentalItem = {
      id: `item-${Date.now()}`,
      equipmentId: eq.id,
      equipment: eq,
      cantidad: 1,
      tarifaTipo: 'DIA',
      precioUnitario: eq.precioDia,
      diasEstimados: 1,
      deposito: eq.depositoSugerido,
      subtotal: eq.precioDia,
    };
    setRentalItems((prev) => [...prev, newItem]);
  };

  const removeItemFromRental = (itemId: string) => {
    setRentalItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateRentalItem = (itemId: string, updates: Partial<RentalItem>) => {
    setRentalItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newItem = { ...item, ...updates };
        if (updates.tarifaTipo) {
          const eq = item.equipment;
          newItem.precioUnitario =
            updates.tarifaTipo === 'DIA' ? eq.precioDia :
            updates.tarifaTipo === 'SEMANA' ? eq.precioSemana : eq.precioMes;
        }
        newItem.subtotal = newItem.cantidad * newItem.precioUnitario * newItem.diasEstimados;
        return newItem;
      })
    );
  };

  const totals = useMemo(() => {
    const subtotal = rentalItems.reduce((s, i) => s + i.subtotal, 0);
    const deposito = rentalItems.reduce((s, i) => s + i.deposito * i.cantidad, 0);
    return { subtotal, deposito, total: subtotal + deposito };
  }, [rentalItems]);

  const handleCreateRental = () => {
    if (!selectedClient || rentalItems.length === 0) return;
    toast({
      title: 'Arriendo creado',
      description: `Arriendo para ${selectedClient.nombre} con ${rentalItems.length} equipo(s) por ${formatCurrency(totals.total)}`,
    });
    setIsRentalModalOpen(false);
    setFoundEquipment(null);
    setMachineCode('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido a Neumaqar — Sistema de gestión</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Clientes Registrados" value="3" icon={Users} />
          <KPICard title="Maquinaria" value="10" icon={Truck} />
          <KPICard title="Arriendos Activos" value="5" icon={FileText} />
          <KPICard title="Ingresos Mes" value={formatCLP(24000000)} icon={DollarSign} />
        </div>

        {/* Quick Operation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-foreground bg-secondary">
                <ScanBarcode className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Operación rápida de máquinas</CardTitle>
                <CardDescription>Escanea o ingresa un código para operar rápidamente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scanner input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Escanea o ingresa código de máquina... (ej: RET-001)"
                  value={machineCode}
                  onChange={(e) => { setMachineCode(e.target.value); setSearchError(false); setFoundEquipment(null); }}
                  onKeyDown={handleKeyDown}
                  className="pl-12 h-12 text-base border-2 border-foreground"
                  autoFocus
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="h-12 px-6">
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Button>
            </div>

            {/* Search error */}
            {searchError && (
              <div className="border-2 border-destructive bg-destructive/5 p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
                <p className="font-medium text-destructive">Máquina no encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  El código "{machineCode}" no corresponde a ninguna máquina registrada
                </p>
              </div>
            )}

            {/* Found equipment - Action buttons */}
            {foundEquipment && (
              <div className="border-2 border-foreground bg-card">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary border-2 border-foreground">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{foundEquipment.nombre}</h3>
                        <Badge variant="outline" className="font-mono">{foundEquipment.codigo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{foundEquipment.categoria} — {foundEquipment.descripcion}</p>
                    </div>
                  </div>
                  <Badge variant={foundEquipment.disponible ? 'default' : 'destructive'}>
                    {foundEquipment.disponible ? 'Disponible' : 'En Arriendo'}
                  </Badge>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Precio/día</p>
                      <p className="font-mono font-bold">{formatCurrency(foundEquipment.precioDia)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precio/semana</p>
                      <p className="font-mono font-bold">{formatCurrency(foundEquipment.precioSemana)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precio/mes</p>
                      <p className="font-mono font-bold">{formatCurrency(foundEquipment.precioMes)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={() => openRentalWithEquipment(foundEquipment)}
                      disabled={!foundEquipment.disponible}
                    >
                      <FileText className="h-5 w-5" />
                      Crear Arriendo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2"
                      onClick={() => openMaintenanceToast(foundEquipment)}
                    >
                      <Wrench className="h-5 w-5" />
                      Mantención
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!foundEquipment && !searchError && (
              <div className="border-2 border-dashed border-border p-8 text-center">
                <ScanBarcode className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="text-muted-foreground">Ingresa un código de máquina o escanea un código de barras</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-colors">
                  <div className="p-2 bg-secondary border border-border">
                    <act.icono className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{act.descripcion}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {act.hora}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== FULL-SCREEN RENTAL CREATION MODAL ========== */}
      <Dialog open={isRentalModalOpen} onOpenChange={setIsRentalModalOpen}>
        <DialogContent className="max-w-[98vw] w-[1600px] h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-8 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-2xl">Nuevo Arriendo</DialogTitle>
            <DialogDescription>Complete los datos para crear un nuevo arriendo</DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 h-full">
              {/* LEFT: Client Selection */}
              <div className="space-y-4 flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente <span className="text-destructive">*</span>
                  </h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <UserPlus className="h-3.5 w-3.5" />
                    Nuevo
                  </Button>
                </div>

                {/* Selected client */}
                {selectedClient && (
                  <Card className="border-2 border-primary bg-primary/5">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 flex items-center justify-center border border-primary/30">
                          {selectedClient.tipoCliente === 'PERSONA' ? <User className="h-5 w-5 text-primary" /> : <Building2 className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{selectedClient.nombre}</p>
                          <p className="text-xs text-muted-foreground font-mono">{selectedClient.rut}</p>
                        </div>
                        <Badge variant="default" className="gap-1 text-xs">
                          <Check className="h-3 w-3" /> OK
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-1 flex-1 min-h-0 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`flex items-center gap-3 p-3 cursor-pointer border transition-colors hover:bg-muted/50 ${
                        selectedClient?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="h-8 w-8 bg-muted flex items-center justify-center">
                        {client.tipoCliente === 'PERSONA' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{client.nombre}</p>
                        <p className="text-xs text-muted-foreground font-mono">{client.rut}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{client.tipoCliente === 'PERSONA' ? 'Persona' : 'Empresa'}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Equipment - MachineSelectorPanel */}
              <div className="flex flex-col h-full overflow-hidden">
                <MachineSelectorPanel
                  availableEquipment={mockEquipment}
                  items={rentalItems}
                  onAddItem={addItemToRental}
                  onRemoveItem={removeItemFromRental}
                  onUpdateItem={updateRentalItem}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-8 py-4 flex items-center justify-between shrink-0">
            <p className="text-sm text-muted-foreground">
              {selectedClient ? `Cliente: ${selectedClient.nombre}` : 'Sin cliente seleccionado'} — {rentalItems.length} equipo(s)
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsRentalModalOpen(false)}>Cancelar</Button>
              <Button
                size="lg"
                disabled={!selectedClient || rentalItems.length === 0}
                onClick={handleCreateRental}
                className="gap-2 px-8"
              >
                <FileText className="h-5 w-5" />
                Crear Arriendo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;
