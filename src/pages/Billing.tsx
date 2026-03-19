import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText, DollarSign, Search, Plus, Eye, CreditCard,
  AlertTriangle, Clock, CheckCircle2, XCircle, Receipt,
  TrendingUp, ArrowRight, Calendar, Banknote,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

// ── Types ──────────────────────────────────────────────
type DocType = 'INITIAL' | 'CUT' | 'ADDITIONAL' | 'CREDIT_NOTE';
type DocStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'ANULADO';

interface BillingDocumentDetail {
  id: string;
  equipmentName: string;
  equipmentCode: string;
  diasCobrados: number;
  precioUnitario: number;
  periodoDesde: Date;
  periodoHasta: Date;
  monto: number;
}

interface BillingDocument {
  id: string;
  folio: string;
  rentalFolio: string;
  rentalId: string;
  clienteNombre: string;
  clienteRut: string;
  tipo: DocType;
  estado: DocStatus;
  fechaEmision: Date;
  fechaVencimiento: Date;
  subtotal: number;
  iva: number;
  total: number;
  pagado: number;
  saldo: number;
  detalles: BillingDocumentDetail[];
  observaciones?: string;
}

// ── Mock Data ──────────────────────────────────────────
const mockDocuments: BillingDocument[] = [
  {
    id: 'doc-001',
    folio: 'FAC-2024-0001',
    rentalFolio: 'ARR-2024-0001',
    rentalId: 'rental-001',
    clienteNombre: 'Constructora Andes SpA',
    clienteRut: '76.543.210-K',
    tipo: 'INITIAL',
    estado: 'PARCIAL',
    fechaEmision: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-02-15'),
    subtotal: 1855000,
    iva: 352450,
    total: 2207450,
    pagado: 500000,
    saldo: 1707450,
    detalles: [
      { id: 'det-001', equipmentName: 'Retroexcavadora CAT 420F', equipmentCode: 'RET-001', diasCobrados: 7, precioUnitario: 180000, periodoDesde: new Date('2024-01-15'), periodoHasta: new Date('2024-01-22'), monto: 1260000 },
      { id: 'det-002', equipmentName: 'Rodillo Compactador BOMAG', equipmentCode: 'ROD-001', diasCobrados: 7, precioUnitario: 85000, periodoDesde: new Date('2024-01-15'), periodoHasta: new Date('2024-01-22'), monto: 595000 },
    ],
  },
  {
    id: 'doc-002',
    folio: 'FAC-2024-0002',
    rentalFolio: 'ARR-2024-0002',
    rentalId: 'rental-002',
    clienteNombre: 'Carlos Muñoz Soto',
    clienteRut: '12.345.678-9',
    tipo: 'CUT',
    estado: 'PENDIENTE',
    fechaEmision: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-02-20'),
    subtotal: 840000,
    iva: 159600,
    total: 999600,
    pagado: 0,
    saldo: 999600,
    detalles: [
      { id: 'det-003', equipmentName: 'Minicargador Bobcat S650', equipmentCode: 'MNC-001', diasCobrados: 7, precioUnitario: 120000, periodoDesde: new Date('2024-01-10'), periodoHasta: new Date('2024-01-17'), monto: 840000 },
    ],
  },
  {
    id: 'doc-003',
    folio: 'FAC-2024-0003',
    rentalFolio: 'ARR-2024-0003',
    rentalId: 'rental-003',
    clienteNombre: 'Minera del Norte Ltda',
    clienteRut: '77.888.999-1',
    tipo: 'INITIAL',
    estado: 'PAGADO',
    fechaEmision: new Date('2024-01-05'),
    fechaVencimiento: new Date('2024-02-05'),
    subtotal: 600000,
    iva: 114000,
    total: 714000,
    pagado: 714000,
    saldo: 0,
    detalles: [
      { id: 'det-004', equipmentName: 'Generador 50KVA', equipmentCode: 'GEN-001', diasCobrados: 6, precioUnitario: 65000, periodoDesde: new Date('2024-01-05'), periodoHasta: new Date('2024-01-11'), monto: 390000 },
      { id: 'det-005', equipmentName: 'Placa Compactadora', equipmentCode: 'PLA-001', diasCobrados: 6, precioUnitario: 35000, periodoDesde: new Date('2024-01-05'), periodoHasta: new Date('2024-01-11'), monto: 210000 },
    ],
  },
  {
    id: 'doc-004',
    folio: 'FAC-2024-0004',
    rentalFolio: 'ARR-2024-0001',
    rentalId: 'rental-001',
    clienteNombre: 'Constructora Andes SpA',
    clienteRut: '76.543.210-K',
    tipo: 'CUT',
    estado: 'PENDIENTE',
    fechaEmision: new Date('2024-01-22'),
    fechaVencimiento: new Date('2024-02-22'),
    subtotal: 1590000,
    iva: 302100,
    total: 1892100,
    pagado: 0,
    saldo: 1892100,
    detalles: [
      { id: 'det-006', equipmentName: 'Retroexcavadora CAT 420F', equipmentCode: 'RET-001', diasCobrados: 6, precioUnitario: 180000, periodoDesde: new Date('2024-01-22'), periodoHasta: new Date('2024-01-28'), monto: 1080000 },
      { id: 'det-007', equipmentName: 'Rodillo Compactador BOMAG', equipmentCode: 'ROD-001', diasCobrados: 6, precioUnitario: 85000, periodoDesde: new Date('2024-01-22'), periodoHasta: new Date('2024-01-28'), monto: 510000 },
    ],
  },
  {
    id: 'doc-005',
    folio: 'NC-2024-0001',
    rentalFolio: 'ARR-2024-0003',
    rentalId: 'rental-003',
    clienteNombre: 'Minera del Norte Ltda',
    clienteRut: '77.888.999-1',
    tipo: 'CREDIT_NOTE',
    estado: 'PAGADO',
    fechaEmision: new Date('2024-01-12'),
    fechaVencimiento: new Date('2024-01-12'),
    subtotal: -100000,
    iva: -19000,
    total: -119000,
    pagado: -119000,
    saldo: 0,
    detalles: [
      { id: 'det-008', equipmentName: 'Generador 50KVA', equipmentCode: 'GEN-001', diasCobrados: -1, precioUnitario: 65000, periodoDesde: new Date('2024-01-11'), periodoHasta: new Date('2024-01-12'), monto: -65000 },
      { id: 'det-009', equipmentName: 'Placa Compactadora', equipmentCode: 'PLA-001', diasCobrados: -1, precioUnitario: 35000, periodoDesde: new Date('2024-01-11'), periodoHasta: new Date('2024-01-12'), monto: -35000 },
    ],
    observaciones: 'Devolución anticipada, se descuenta 1 día',
  },
  {
    id: 'doc-006',
    folio: 'FAC-2024-0005',
    rentalFolio: 'ARR-2024-0005',
    rentalId: 'rental-005',
    clienteNombre: 'Andrea Vásquez Molina',
    clienteRut: '16.789.012-3',
    tipo: 'ADDITIONAL',
    estado: 'PENDIENTE',
    fechaEmision: new Date('2024-01-25'),
    fechaVencimiento: new Date('2024-02-10'),
    subtotal: 250000,
    iva: 47500,
    total: 297500,
    pagado: 0,
    saldo: 297500,
    detalles: [
      { id: 'det-010', equipmentName: 'Retroexcavadora JCB 3CX', equipmentCode: 'RET-002', diasCobrados: 3, precioUnitario: 75000, periodoDesde: new Date('2024-01-22'), periodoHasta: new Date('2024-01-25'), monto: 225000 },
      { id: 'det-011', equipmentName: 'Daño en balde', equipmentCode: 'EXTRA', diasCobrados: 1, precioUnitario: 25000, periodoDesde: new Date('2024-01-25'), periodoHasta: new Date('2024-01-25'), monto: 25000 },
    ],
    observaciones: 'Cobro adicional por días extra y daño menor',
  },
];

// ── Helpers ────────────────────────────────────────────
const tipoLabel: Record<DocType, string> = {
  INITIAL: 'Inicial',
  CUT: 'Corte',
  ADDITIONAL: 'Adicional',
  CREDIT_NOTE: 'Nota Crédito',
};
const tipoBadgeVariant: Record<DocType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  INITIAL: 'default',
  CUT: 'secondary',
  ADDITIONAL: 'outline',
  CREDIT_NOTE: 'destructive',
};
const estadoBadge: Record<DocStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  PENDIENTE: { label: 'Pendiente', className: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock },
  PARCIAL: { label: 'Parcial', className: 'bg-blue-100 text-blue-800 border-blue-300', icon: TrendingUp },
  PAGADO: { label: 'Pagado', className: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 },
  ANULADO: { label: 'Anulado', className: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
};

const isVencido = (doc: BillingDocument) =>
  doc.estado !== 'PAGADO' && doc.estado !== 'ANULADO' && new Date() > doc.fechaVencimiento;

// ── Component ──────────────────────────────────────────
const Billing = () => {
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<DocStatus | 'TODOS'>('TODOS');
  const [filterTipo, setFilterTipo] = useState<DocType | 'TODOS'>('TODOS');
  const [selectedDoc, setSelectedDoc] = useState<BillingDocument | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [payDoc, setPayDoc] = useState<BillingDocument | null>(null);

  const filtered = mockDocuments.filter(doc => {
    const matchSearch = search === '' ||
      doc.folio.toLowerCase().includes(search.toLowerCase()) ||
      doc.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      doc.rentalFolio.toLowerCase().includes(search.toLowerCase()) ||
      doc.clienteRut.includes(search);
    const matchEstado = filterEstado === 'TODOS' || doc.estado === filterEstado;
    const matchTipo = filterTipo === 'TODOS' || doc.tipo === filterTipo;
    return matchSearch && matchEstado && matchTipo;
  });

  // KPIs
  const totalPendiente = mockDocuments.filter(d => d.estado === 'PENDIENTE' || d.estado === 'PARCIAL').reduce((s, d) => s + d.saldo, 0);
  const totalFacturado = mockDocuments.filter(d => d.tipo !== 'CREDIT_NOTE').reduce((s, d) => s + d.total, 0);
  const totalCobrado = mockDocuments.reduce((s, d) => s + d.pagado, 0);
  const docsVencidos = mockDocuments.filter(isVencido).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Por Cobrar</p>
                <p className="text-xl font-bold font-mono">{formatCurrency(totalPendiente)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Facturado</p>
                <p className="text-xl font-bold font-mono">{formatCurrency(totalFacturado)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Cobrado</p>
                <p className="text-xl font-bold font-mono">{formatCurrency(totalCobrado)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Docs Vencidos</p>
                <p className="text-xl font-bold font-mono">{docsVencidos}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar folio, cliente, RUT o arriendo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 border-2 border-foreground"
                  />
                </div>
                <Select value={filterEstado} onValueChange={v => setFilterEstado(v as DocStatus | 'TODOS')}>
                  <SelectTrigger className="w-[160px] border-2 border-foreground">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los estados</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="PARCIAL">Parcial</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                    <SelectItem value="ANULADO">Anulado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTipo} onValueChange={v => setFilterTipo(v as DocType | 'TODOS')}>
                  <SelectTrigger className="w-[160px] border-2 border-foreground">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los tipos</SelectItem>
                    <SelectItem value="INITIAL">Inicial</SelectItem>
                    <SelectItem value="CUT">Corte</SelectItem>
                    <SelectItem value="ADDITIONAL">Adicional</SelectItem>
                    <SelectItem value="CREDIT_NOTE">Nota Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-2 border-foreground gap-2" onClick={() => setShowNewDocModal(true)}>
                  <Receipt className="h-4 w-4" /> Emitir Corte
                </Button>
                <Button className="gap-2 border-2 border-foreground" onClick={() => setShowNewDocModal(true)}>
                  <Plus className="h-4 w-4" /> Nuevo Documento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
          <CardHeader className="border-b-2 border-foreground pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" /> Documentos de Cobro
              <Badge variant="secondary" className="ml-2 font-mono">{filtered.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-foreground bg-muted/50">
                  <TableHead className="font-bold">Folio</TableHead>
                  <TableHead className="font-bold">Tipo</TableHead>
                  <TableHead className="font-bold">Cliente</TableHead>
                  <TableHead className="font-bold">Arriendo</TableHead>
                  <TableHead className="font-bold">Emisión</TableHead>
                  <TableHead className="font-bold">Vencimiento</TableHead>
                  <TableHead className="font-bold text-right">Total</TableHead>
                  <TableHead className="font-bold text-right">Saldo</TableHead>
                  <TableHead className="font-bold text-center">Estado</TableHead>
                  <TableHead className="font-bold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(doc => {
                  const vencido = isVencido(doc);
                  const est = estadoBadge[doc.estado];
                  const EstIcon = est.icon;
                  return (
                    <TableRow key={doc.id} className={`border-b border-border/50 ${vencido ? 'bg-red-50/50' : ''}`}>
                      <TableCell className="font-mono font-bold text-sm">{doc.folio}</TableCell>
                      <TableCell>
                        <Badge variant={tipoBadgeVariant[doc.tipo]} className="border border-foreground text-xs">
                          {tipoLabel[doc.tipo]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{doc.clienteNombre}</p>
                          <p className="text-xs text-muted-foreground font-mono">{doc.clienteRut}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{doc.rentalFolio}</TableCell>
                      <TableCell className="text-sm">{formatDate(doc.fechaEmision)}</TableCell>
                      <TableCell className="text-sm">
                        <span className={vencido ? 'text-red-600 font-bold' : ''}>
                          {formatDate(doc.fechaVencimiento)}
                          {vencido && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-sm">
                        {formatCurrency(doc.total)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm">
                        <span className={doc.saldo > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                          {formatCurrency(doc.saldo)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${est.className} border gap-1 text-xs`}>
                          <EstIcon className="h-3 w-3" />
                          {est.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDoc(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(doc.estado === 'PENDIENTE' || doc.estado === 'PARCIAL') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                              onClick={() => { setPayDoc(doc); setShowPayModal(true); }}
                            >
                              <Banknote className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                      No se encontraron documentos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Resumen por cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardHeader className="border-b-2 border-foreground pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Cuentas Vencidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {mockDocuments.filter(isVencido).map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{doc.clienteNombre}</p>
                    <p className="text-xs text-muted-foreground font-mono">{doc.folio} · {doc.rentalFolio}</p>
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Vencido hace {Math.ceil((Date.now() - doc.fechaVencimiento.getTime()) / 86400000)} días
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-red-700">{formatCurrency(doc.saldo)}</p>
                    <Button variant="outline" size="sm" className="mt-1 h-7 text-xs border-foreground gap-1" onClick={() => { setPayDoc(doc); setShowPayModal(true); }}>
                      <CreditCard className="h-3 w-3" /> Cobrar
                    </Button>
                  </div>
                </div>
              ))}
              {mockDocuments.filter(isVencido).length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">Sin documentos vencidos</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-[var(--shadow-sm)]">
            <CardHeader className="border-b-2 border-foreground pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Arriendos Activos sin Corte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { rental: 'ARR-2024-0002', cliente: 'Carlos Muñoz Soto', equipo: 'Minicargador Bobcat S650', diasSinCorte: 14, estimado: 1680000 },
                { rental: 'ARR-2024-0005', cliente: 'Andrea Vásquez Molina', equipo: 'Retroexcavadora JCB 3CX', diasSinCorte: 8, estimado: 600000 },
                { rental: 'ARR-2024-0001', cliente: 'Constructora Andes SpA', equipo: 'Retroexcavadora CAT 420F + 1 más', diasSinCorte: 6, estimado: 1590000 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{item.cliente}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.rental} · {item.equipo}</p>
                    <p className="text-xs text-amber-600 font-medium mt-1">{item.diasSinCorte} días sin facturar</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono">{formatCurrency(item.estimado)}</p>
                    <Button variant="outline" size="sm" className="mt-1 h-7 text-xs border-foreground gap-1" onClick={() => setShowNewDocModal(true)}>
                      <Receipt className="h-3 w-3" /> Emitir Corte
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl border-2 border-foreground shadow-[var(--shadow-md)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono">{selectedDoc?.folio}</span>
              {selectedDoc && <Badge variant={tipoBadgeVariant[selectedDoc.tipo]} className="border border-foreground">{tipoLabel[selectedDoc.tipo]}</Badge>}
            </DialogTitle>
            <DialogDescription>Detalle del documento de cobro</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase">Cliente</p>
                  <p className="font-medium">{selectedDoc.clienteNombre}</p>
                  <p className="font-mono text-xs text-muted-foreground">{selectedDoc.clienteRut}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">Arriendo</p>
                  <p className="font-mono font-medium">{selectedDoc.rentalFolio}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">Emisión</p>
                  <p>{formatDate(selectedDoc.fechaEmision)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">Vencimiento</p>
                  <p className={isVencido(selectedDoc) ? 'text-red-600 font-bold' : ''}>{formatDate(selectedDoc.fechaVencimiento)}</p>
                </div>
              </div>

              <div className="border-2 border-foreground">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-foreground bg-muted/50">
                      <TableHead className="font-bold text-xs">Equipo</TableHead>
                      <TableHead className="font-bold text-xs text-center">Días</TableHead>
                      <TableHead className="font-bold text-xs">Período</TableHead>
                      <TableHead className="font-bold text-xs text-right">P/U</TableHead>
                      <TableHead className="font-bold text-xs text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDoc.detalles.map(det => (
                      <TableRow key={det.id}>
                        <TableCell className="text-sm">
                          <p className="font-medium">{det.equipmentName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{det.equipmentCode}</p>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">{det.diasCobrados}</TableCell>
                        <TableCell className="text-xs">{formatDate(det.periodoDesde)} → {formatDate(det.periodoHasta)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(det.precioUnitario)}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-sm">{formatCurrency(det.monto)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(selectedDoc.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">IVA 19%</span><span className="font-mono">{formatCurrency(selectedDoc.iva)}</span></div>
                  <div className="flex justify-between border-t-2 border-foreground pt-1 font-bold"><span>Total</span><span className="font-mono">{formatCurrency(selectedDoc.total)}</span></div>
                  <div className="flex justify-between text-emerald-700"><span>Pagado</span><span className="font-mono">{formatCurrency(selectedDoc.pagado)}</span></div>
                  <div className="flex justify-between font-bold text-amber-700"><span>Saldo</span><span className="font-mono">{formatCurrency(selectedDoc.saldo)}</span></div>
                </div>
              </div>

              {selectedDoc.observaciones && (
                <p className="text-sm text-muted-foreground border-t border-border pt-2">{selectedDoc.observaciones}</p>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedDoc && (selectedDoc.estado === 'PENDIENTE' || selectedDoc.estado === 'PARCIAL') && (
              <Button className="gap-2 border-2 border-foreground" onClick={() => { setPayDoc(selectedDoc); setShowPayModal(true); setSelectedDoc(null); }}>
                <Banknote className="h-4 w-4" /> Registrar Pago
              </Button>
            )}
            <Button variant="outline" className="border-2 border-foreground" onClick={() => setSelectedDoc(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Pay Modal ── */}
      <Dialog open={showPayModal} onOpenChange={v => { setShowPayModal(v); if (!v) setPayDoc(null); }}>
        <DialogContent className="max-w-md border-2 border-foreground shadow-[var(--shadow-md)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Banknote className="h-5 w-5" /> Registrar Pago</DialogTitle>
            <DialogDescription>Ingresa los datos del pago para {payDoc?.folio}</DialogDescription>
          </DialogHeader>
          {payDoc && (
            <div className="space-y-4">
              <div className="bg-muted/50 border-2 border-foreground p-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Documento</span><span className="font-mono font-bold">{payDoc.folio}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Cliente</span><span className="font-medium">{payDoc.clienteNombre}</span></div>
                <div className="flex justify-between text-sm font-bold"><span>Saldo pendiente</span><span className="font-mono text-amber-700">{formatCurrency(payDoc.saldo)}</span></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Monto a pagar</label>
                  <Input type="number" placeholder="0" className="border-2 border-foreground font-mono mt-1" defaultValue={payDoc.saldo} />
                </div>
                <div>
                  <label className="text-sm font-medium">Método de pago</label>
                  <Select defaultValue="EFECTIVO">
                    <SelectTrigger className="border-2 border-foreground mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                      <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                      <SelectItem value="TARJETA">Tarjeta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Referencia (opcional)</label>
                  <Input placeholder="Nº transferencia, voucher, etc." className="border-2 border-foreground mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Observación (opcional)</label>
                  <Textarea placeholder="Notas del pago..." className="border-2 border-foreground mt-1 resize-none" rows={2} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-2 border-foreground" onClick={() => { setShowPayModal(false); setPayDoc(null); }}>Cancelar</Button>
            <Button className="gap-2 border-2 border-foreground" onClick={() => { setShowPayModal(false); setPayDoc(null); }}>
              <CheckCircle2 className="h-4 w-4" /> Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New Document Modal ── */}
      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent className="max-w-lg border-2 border-foreground shadow-[var(--shadow-md)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Emitir Documento de Cobro</DialogTitle>
            <DialogDescription>Selecciona el arriendo y tipo de documento a emitir</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Arriendo</label>
              <Select>
                <SelectTrigger className="border-2 border-foreground mt-1"><SelectValue placeholder="Seleccionar arriendo activo..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARR-2024-0001">ARR-2024-0001 · Constructora Andes SpA</SelectItem>
                  <SelectItem value="ARR-2024-0002">ARR-2024-0002 · Carlos Muñoz Soto</SelectItem>
                  <SelectItem value="ARR-2024-0005">ARR-2024-0005 · Andrea Vásquez Molina</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de documento</label>
              <Select defaultValue="CUT">
                <SelectTrigger className="border-2 border-foreground mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INITIAL">Inicial — Cobro al inicio del arriendo</SelectItem>
                  <SelectItem value="CUT">Corte — Cobro periódico por uso</SelectItem>
                  <SelectItem value="ADDITIONAL">Adicional — Extras, daños, multas</SelectItem>
                  <SelectItem value="CREDIT_NOTE">Nota de Crédito — Devolución</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Período desde</label>
                <Input type="date" className="border-2 border-foreground mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Período hasta</label>
                <Input type="date" className="border-2 border-foreground mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Observaciones (opcional)</label>
              <Textarea placeholder="Notas adicionales..." className="border-2 border-foreground mt-1 resize-none" rows={2} />
            </div>
            <div className="bg-muted/50 border-2 border-foreground p-3 space-y-1 text-sm">
              <p className="font-bold text-xs uppercase text-muted-foreground mb-2">Vista previa (se calculará automáticamente)</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Equipos incluidos</span><span>Se cargan del arriendo</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal estimado</span><span className="font-mono">—</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">IVA 19%</span><span className="font-mono">—</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total</span><span className="font-mono">—</span></div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-2 border-foreground" onClick={() => setShowNewDocModal(false)}>Cancelar</Button>
            <Button className="gap-2 border-2 border-foreground" onClick={() => setShowNewDocModal(false)}>
              <ArrowRight className="h-4 w-4" /> Generar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
