import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DollarSign, Lock, Unlock, ArrowUpRight, ArrowDownLeft,
  Clock, Receipt, TrendingUp, Banknote, CreditCard, ArrowRightLeft,
  Search, Plus, Minus, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

type CashMovement = {
  id: string;
  hora: string;
  tipo: 'INGRESO' | 'EGRESO' | 'PAGO_ARRIENDO' | 'ABONO' | 'DEVOLUCION_DEPOSITO';
  descripcion: string;
  metodo: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA';
  monto: number;
  folio?: string;
  usuario: string;
};

const mockMovimientos: CashMovement[] = [
  { id: '1', hora: '08:05', tipo: 'INGRESO', descripcion: 'Apertura de caja', metodo: 'EFECTIVO', monto: 50000, usuario: 'Carlos M.' },
  { id: '2', hora: '08:32', tipo: 'PAGO_ARRIENDO', descripcion: 'Pago arriendo ARR-2025-0012', metodo: 'EFECTIVO', monto: 185000, folio: 'ARR-2025-0012', usuario: 'Carlos M.' },
  { id: '3', hora: '09:15', tipo: 'ABONO', descripcion: 'Abono arriendo ARR-2025-0009', metodo: 'TRANSFERENCIA', monto: 120000, folio: 'ARR-2025-0009', usuario: 'Carlos M.' },
  { id: '4', hora: '09:45', tipo: 'PAGO_ARRIENDO', descripcion: 'Pago total ARR-2025-0015', metodo: 'TARJETA', monto: 340000, folio: 'ARR-2025-0015', usuario: 'Carlos M.' },
  { id: '5', hora: '10:20', tipo: 'EGRESO', descripcion: 'Compra insumos limpieza', metodo: 'EFECTIVO', monto: -15000, usuario: 'Carlos M.' },
  { id: '6', hora: '11:00', tipo: 'PAGO_ARRIENDO', descripcion: 'Pago arriendo ARR-2025-0018', metodo: 'EFECTIVO', monto: 95000, folio: 'ARR-2025-0018', usuario: 'Carlos M.' },
  { id: '7', hora: '11:30', tipo: 'DEVOLUCION_DEPOSITO', descripcion: 'Devolución depósito ARR-2025-0005', metodo: 'EFECTIVO', monto: -200000, folio: 'ARR-2025-0005', usuario: 'Carlos M.' },
  { id: '8', hora: '12:10', tipo: 'ABONO', descripcion: 'Abono parcial ARR-2025-0021', metodo: 'EFECTIVO', monto: 75000, folio: 'ARR-2025-0021', usuario: 'Carlos M.' },
  { id: '9', hora: '13:45', tipo: 'PAGO_ARRIENDO', descripcion: 'Pago arriendo ARR-2025-0023', metodo: 'TRANSFERENCIA', monto: 260000, folio: 'ARR-2025-0023', usuario: 'Carlos M.' },
  { id: '10', hora: '14:20', tipo: 'EGRESO', descripcion: 'Pago proveedor combustible', metodo: 'TRANSFERENCIA', monto: -45000, usuario: 'Carlos M.' },
];

const tipoConfig: Record<string, { label: string; color: string; icon: typeof ArrowUpRight }> = {
  INGRESO: { label: 'Ingreso', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: ArrowUpRight },
  EGRESO: { label: 'Egreso', color: 'bg-red-100 text-red-800 border-red-300', icon: ArrowDownLeft },
  PAGO_ARRIENDO: { label: 'Pago Arriendo', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Receipt },
  ABONO: { label: 'Abono', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Plus },
  DEVOLUCION_DEPOSITO: { label: 'Dev. Depósito', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Minus },
};

const metodoIcon: Record<string, typeof Banknote> = {
  EFECTIVO: Banknote,
  TRANSFERENCIA: ArrowRightLeft,
  TARJETA: CreditCard,
};

export default function Caja() {
  const [cajaAbierta, setCajaAbierta] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [showApertura, setShowApertura] = useState(false);
  const [showCierre, setShowCierre] = useState(false);
  const [showMovimiento, setShowMovimiento] = useState(false);
  const [montoApertura, setMontoApertura] = useState('50000');

  const movimientosFiltrados = mockMovimientos.filter((m) => {
    if (search) {
      const s = search.toLowerCase();
      if (!m.descripcion.toLowerCase().includes(s) && !(m.folio?.toLowerCase().includes(s))) return false;
    }
    if (filtroTipo !== 'TODOS' && m.tipo !== filtroTipo) return false;
    return true;
  });

  const totalEfectivo = mockMovimientos.filter(m => m.metodo === 'EFECTIVO').reduce((s, m) => s + m.monto, 0);
  const totalTransferencia = mockMovimientos.filter(m => m.metodo === 'TRANSFERENCIA').reduce((s, m) => s + m.monto, 0);
  const totalTarjeta = mockMovimientos.filter(m => m.metodo === 'TARJETA').reduce((s, m) => s + m.monto, 0);
  const totalIngresos = mockMovimientos.filter(m => m.monto > 0).reduce((s, m) => s + m.monto, 0);
  const totalEgresos = mockMovimientos.filter(m => m.monto < 0).reduce((s, m) => s + Math.abs(m.monto), 0);
  const saldoActual = mockMovimientos.reduce((s, m) => s + m.monto, 0);

  if (!cajaAbierta) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-md border-2 border-foreground shadow-md">
            <CardHeader className="text-center border-b-2 border-foreground">
              <div className="mx-auto w-16 h-16 border-2 border-foreground bg-secondary flex items-center justify-center mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Caja Cerrada</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                No hay una caja abierta en este momento
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 border-2 border-foreground bg-secondary">
                <p className="text-xs font-mono text-muted-foreground mb-1">ÚLTIMO CIERRE</p>
                <p className="font-semibold">17/03/2026 — 18:30 hrs</p>
                <p className="text-sm text-muted-foreground">por Carlos M.</p>
                <p className="text-sm mt-2">Saldo final: <span className="font-bold">{formatCurrency(865000)}</span></p>
              </div>
              <Button
                className="w-full h-12 text-base font-bold border-2 border-foreground"
                onClick={() => setShowApertura(true)}
              >
                <Unlock className="h-5 w-5 mr-2" />
                Abrir Caja
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showApertura} onOpenChange={setShowApertura}>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Apertura de Caja</DialogTitle>
              <DialogDescription>Registra el monto inicial en efectivo</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Monto inicial (efectivo)</label>
                <Input
                  type="number"
                  value={montoApertura}
                  onChange={(e) => setMontoApertura(e.target.value)}
                  className="border-2 border-foreground font-mono text-lg"
                />
              </div>
              <div className="p-3 border-2 border-foreground bg-secondary text-sm">
                <p className="font-mono text-muted-foreground">Fecha: 18/03/2026</p>
                <p className="font-mono text-muted-foreground">Hora: {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="font-mono text-muted-foreground">Usuario: Carlos M.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApertura(false)}>Cancelar</Button>
              <Button onClick={() => { setCajaAbierta(true); setShowApertura(false); }}>
                <Unlock className="h-4 w-4 mr-2" /> Confirmar Apertura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header con estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-foreground bg-emerald-100 flex items-center justify-center">
              <Unlock className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Caja Abierta</h1>
              <p className="text-sm text-muted-foreground font-mono">
                Apertura: 18/03/2026 08:00 — Carlos M.
              </p>
            </div>
            <Badge className="bg-emerald-600 text-white border-0 ml-2">ABIERTA</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-2 border-foreground" onClick={() => setShowMovimiento(true)}>
              <Plus className="h-4 w-4 mr-1" /> Movimiento
            </Button>
            <Button
              variant="destructive"
              className="border-2 border-foreground"
              onClick={() => setShowCierre(true)}
            >
              <Lock className="h-4 w-4 mr-1" /> Cerrar Caja
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">SALDO ACTUAL</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(saldoActual)}</p>
              <p className="text-xs text-muted-foreground mt-1">{mockMovimientos.length} movimientos hoy</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">INGRESOS</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalIngresos)}</p>
              <p className="text-xs text-muted-foreground mt-1">{mockMovimientos.filter(m => m.monto > 0).length} operaciones</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">EGRESOS</span>
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalEgresos)}</p>
              <p className="text-xs text-muted-foreground mt-1">{mockMovimientos.filter(m => m.monto < 0).length} operaciones</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">HORA APERTURA</span>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold font-mono">08:00</p>
              <p className="text-xs text-muted-foreground mt-1">Hace {Math.floor((Date.now() - new Date().setHours(8, 0, 0, 0)) / 3600000)}h activa</p>
            </CardContent>
          </Card>
        </div>

        {/* Desglose por método de pago */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-green-50 flex items-center justify-center flex-shrink-0">
                <Banknote className="h-6 w-6 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono text-muted-foreground">EFECTIVO</p>
                <p className="text-xl font-bold">{formatCurrency(totalEfectivo)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{mockMovimientos.filter(m => m.metodo === 'EFECTIVO').length} mov.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-blue-50 flex items-center justify-center flex-shrink-0">
                <ArrowRightLeft className="h-6 w-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono text-muted-foreground">TRANSFERENCIA</p>
                <p className="text-xl font-bold">{formatCurrency(totalTransferencia)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{mockMovimientos.filter(m => m.metodo === 'TRANSFERENCIA').length} mov.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-xs">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-violet-50 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-violet-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono text-muted-foreground">TARJETA</p>
                <p className="text-xl font-bold">{formatCurrency(totalTarjeta)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{mockMovimientos.filter(m => m.metodo === 'TARJETA').length} mov.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de movimientos */}
        <Card className="border-2 border-foreground shadow-xs">
          <CardHeader className="border-b-2 border-foreground pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-lg">Movimientos del Día</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar folio, descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-64 border-2 border-foreground"
                  />
                </div>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-44 border-2 border-foreground">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos</SelectItem>
                    <SelectItem value="PAGO_ARRIENDO">Pago Arriendo</SelectItem>
                    <SelectItem value="ABONO">Abono</SelectItem>
                    <SelectItem value="INGRESO">Ingreso</SelectItem>
                    <SelectItem value="EGRESO">Egreso</SelectItem>
                    <SelectItem value="DEVOLUCION_DEPOSITO">Dev. Depósito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-foreground">
                  <TableHead className="font-mono text-xs">HORA</TableHead>
                  <TableHead className="font-mono text-xs">TIPO</TableHead>
                  <TableHead className="font-mono text-xs">DESCRIPCIÓN</TableHead>
                  <TableHead className="font-mono text-xs">FOLIO</TableHead>
                  <TableHead className="font-mono text-xs">MÉTODO</TableHead>
                  <TableHead className="font-mono text-xs text-right">MONTO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientosFiltrados.map((m) => {
                  const config = tipoConfig[m.tipo];
                  const MetodoIcon = metodoIcon[m.metodo];
                  const isNegative = m.monto < 0;
                  return (
                    <TableRow key={m.id} className="border-b border-border/50 hover:bg-accent/50">
                      <TableCell className="font-mono text-sm">{m.hora}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${config.color} border text-xs`}>
                          <config.icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{m.descripcion}</TableCell>
                      <TableCell>
                        {m.folio ? (
                          <span className="font-mono text-xs bg-secondary px-2 py-1 border border-foreground">{m.folio}</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MetodoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          {m.metodo === 'EFECTIVO' ? 'Efectivo' : m.metodo === 'TRANSFERENCIA' ? 'Transfer.' : 'Tarjeta'}
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-mono font-bold text-sm ${isNegative ? 'text-red-600' : 'text-emerald-700'}`}>
                        {isNegative ? '−' : '+'} {formatCurrency(Math.abs(m.monto))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {movimientosFiltrados.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No se encontraron movimientos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Nuevo Movimiento */}
      <Dialog open={showMovimiento} onOpenChange={setShowMovimiento}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Registrar Movimiento</DialogTitle>
            <DialogDescription>Ingresa un movimiento manual a la caja</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Tipo</label>
              <Select defaultValue="INGRESO">
                <SelectTrigger className="border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INGRESO">Ingreso</SelectItem>
                  <SelectItem value="EGRESO">Egreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Monto</label>
              <Input type="number" placeholder="0" className="border-2 border-foreground font-mono text-lg" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Método de pago</label>
              <Select defaultValue="EFECTIVO">
                <SelectTrigger className="border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                  <SelectItem value="TARJETA">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Descripción</label>
              <Input placeholder="Detalle del movimiento..." className="border-2 border-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMovimiento(false)}>Cancelar</Button>
            <Button onClick={() => setShowMovimiento(false)}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Cierre de Caja */}
      <Dialog open={showCierre} onOpenChange={setShowCierre}>
        <DialogContent className="border-2 border-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Cierre de Caja
            </DialogTitle>
            <DialogDescription>Revisa el resumen antes de cerrar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border-2 border-foreground bg-secondary">
                <p className="text-xs font-mono text-muted-foreground">TOTAL INGRESOS</p>
                <p className="text-lg font-bold text-emerald-700">{formatCurrency(totalIngresos)}</p>
              </div>
              <div className="p-3 border-2 border-foreground bg-secondary">
                <p className="text-xs font-mono text-muted-foreground">TOTAL EGRESOS</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(totalEgresos)}</p>
              </div>
            </div>

            <Separator className="border-foreground" />

            <div className="space-y-2">
              <p className="text-sm font-semibold">Desglose por método:</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm p-2 border border-foreground">
                  <span className="flex items-center gap-2"><Banknote className="h-4 w-4" /> Efectivo</span>
                  <span className="font-mono font-bold">{formatCurrency(totalEfectivo)}</span>
                </div>
                <div className="flex justify-between text-sm p-2 border border-foreground">
                  <span className="flex items-center gap-2"><ArrowRightLeft className="h-4 w-4" /> Transferencia</span>
                  <span className="font-mono font-bold">{formatCurrency(totalTransferencia)}</span>
                </div>
                <div className="flex justify-between text-sm p-2 border border-foreground">
                  <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Tarjeta</span>
                  <span className="font-mono font-bold">{formatCurrency(totalTarjeta)}</span>
                </div>
              </div>
            </div>

            <Separator className="border-foreground" />

            <div className="p-4 border-2 border-foreground bg-primary text-primary-foreground">
              <div className="flex justify-between items-center">
                <span className="font-semibold">SALDO FINAL</span>
                <span className="text-2xl font-bold font-mono">{formatCurrency(saldoActual)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1">Efectivo contado en caja</label>
              <Input type="number" placeholder="Ingresa monto contado" className="border-2 border-foreground font-mono" />
              <p className="text-xs text-muted-foreground mt-1">Se comparará con el saldo esperado en efectivo</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCierre(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { setCajaAbierta(false); setShowCierre(false); }}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
