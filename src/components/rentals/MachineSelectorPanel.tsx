import { useState, useEffect, useMemo, useRef } from 'react';
import { Equipment, RentalItem, RateType } from '@/types/rental';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Trash2,
  Package,
  ScanBarcode,
  X,
  Clock,
  CalendarClock,
  Tag,
  ChevronDown,
  Check,
  Truck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface MachineSelectorPanelProps {
  availableEquipment: Equipment[];
  items: RentalItem[];
  onAddItem: (eq: Equipment) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<RentalItem>) => void;
}

const DAY_PRESETS = [1, 2, 3, 4, 5, 6, 7];

const CATEGORIES = ['Todas', 'Excavadoras', 'Cargadores', 'Compactadores', 'Generadores', 'Grúas', 'Accesorios', 'Andamios'];

const calculateReturnDate = (days: number): Date => {
  const now = new Date();
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

const formatReturnDate = (date: Date): string => {
  return date.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: '2-digit' }) +
    ' ' + date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};

export const MachineSelectorPanel = ({
  availableEquipment,
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: MachineSelectorPanelProps) => {
  const [search, setSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeError, setBarcodeError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [customDaysItemId, setCustomDaysItemId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const categoryRef = useRef<HTMLDivElement>(null);

  const selectedIds = items.map((i) => i.equipmentId);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredEquipment = useMemo(() => {
    return availableEquipment.filter((eq) => {
      if (selectedIds.includes(eq.id)) return false;
      if (!eq.disponible) return false;
      if (selectedCategory !== 'Todas' && eq.categoria !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          eq.nombre.toLowerCase().includes(q) ||
          eq.codigo.toLowerCase().includes(q) ||
          eq.categoria.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [availableEquipment, selectedIds, selectedCategory, search]);

  const handleBarcodeScan = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = barcodeInput.trim();
    if (!value) return;

    const machine = availableEquipment.find(
      (m) => m.codigo.toLowerCase() === value.toLowerCase()
    );

    if (!machine) {
      setBarcodeError(`Sin resultado para "${value}"`);
      setTimeout(() => setBarcodeError(''), 3000);
      setBarcodeInput('');
      return;
    }

    if (selectedIds.includes(machine.id)) {
      setBarcodeError(`"${machine.codigo}" ya está en el arriendo`);
      setTimeout(() => setBarcodeError(''), 3000);
      setBarcodeInput('');
      return;
    }

    onAddItem(machine);
    setBarcodeInput('');
    setBarcodeError('');
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableEquipment.forEach((eq) => {
      if (eq.disponible && !selectedIds.includes(eq.id)) {
        counts[eq.categoria] = (counts[eq.categoria] || 0) + 1;
      }
    });
    return counts;
  }, [availableEquipment, selectedIds]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const deposito = items.reduce((s, i) => s + i.deposito * i.cantidad, 0);
    return { subtotal, deposito, total: subtotal + deposito };
  }, [items]);

  return (
    <div className="flex flex-col h-full">
      {/* Header strip */}
      <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
        <h3 className="font-bold flex items-center gap-2 text-base">
          <Truck className="h-4 w-4" />
          Maquinarias <span className="text-destructive">*</span>
        </h3>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {items.length} seleccionada{items.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Two-column panel */}
      <div className="grid grid-cols-2 gap-0 flex-1 min-h-0 mt-3">
        {/* ── LEFT: Available Equipment ── */}
        <div className="flex flex-col min-h-0 border-r border-border pr-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Disponibles ({filteredEquipment.length})
          </p>

          {/* Category filter */}
          <div ref={categoryRef} className="relative mb-2">
            <button
              type="button"
              onClick={() => setCategoryOpen((v) => !v)}
              className="w-full flex items-center justify-between h-8 px-3 text-sm border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                {selectedCategory}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {categoryOpen && (
              <div className="absolute z-50 w-full mt-1 border border-border rounded-md bg-background shadow-lg max-h-[200px] overflow-y-auto">
                {CATEGORIES.map((cat) => {
                  const count = cat === 'Todas'
                    ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                    : categoryCounts[cat] || 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                        selectedCategory === cat ? 'font-semibold text-primary bg-primary/5' : ''
                      }`}
                    >
                      {cat}
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Barcode scanner */}
          <div className="relative mb-2">
            <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-500" />
            <Input
              placeholder="Escanear código de barras..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeScan}
              className="pl-9 h-8 text-sm font-mono border-blue-200 focus-visible:ring-blue-400"
              autoComplete="off"
            />
            {barcodeInput && (
              <button type="button" onClick={() => { setBarcodeInput(''); setBarcodeError(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {barcodeError && (
            <p className="text-xs text-destructive mb-2">{barcodeError}</p>
          )}

          {/* Equipment list */}
          <div className="flex-1 min-h-0 overflow-y-auto border border-border rounded-md divide-y divide-border">
            {filteredEquipment.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Package className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Sin resultados</p>
              </div>
            ) : (
              filteredEquipment.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => onAddItem(eq)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 text-left transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                        {eq.codigo}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{eq.categoria}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{eq.nombre}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {formatCurrency(eq.precioDia)}/día
                    </p>
                  </div>
                  <div className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: Selected Items ── */}
        <div className="flex flex-col min-h-0 pl-4">
          {/* Header with clock */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              En este arriendo
            </p>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Inicio: {currentTime.toLocaleDateString('es-CL')} {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center">
              <ScanBarcode className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
              <p className="text-sm text-muted-foreground">Selecciona o escanea</p>
              <p className="text-xs text-muted-foreground">maquinarias del panel izquierdo</p>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto border border-border rounded-md divide-y divide-border">
                {items.map((item) => {
                  const returnDate = calculateReturnDate(item.diasEstimados);
                  const isCustom = customDaysItemId === item.id;

                  return (
                    <div key={item.id} className="p-3 space-y-2.5">
                      {/* Machine info + remove */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{item.equipment.codigo}</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {item.equipment.categoria}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item.equipment.nombre}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            {formatCurrency(item.precioUnitario)}/{item.tarifaTipo === 'DIA' ? 'día' : item.tarifaTipo === 'SEMANA' ? 'sem' : 'mes'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Day selector with presets */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Días de arriendo
                          </label>
                          <Select
                            value={item.tarifaTipo}
                            onValueChange={(v) => onUpdateItem(item.id, { tarifaTipo: v as RateType })}
                          >
                            <SelectTrigger className="h-6 w-20 text-[10px] border-none bg-muted/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DIA">Día</SelectItem>
                              <SelectItem value="SEMANA">Semana</SelectItem>
                              <SelectItem value="MES">Mes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {isCustom ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              value={item.diasEstimados}
                              onChange={(e) => onUpdateItem(item.id, { diasEstimados: Number(e.target.value) || 1 })}
                              className="h-8 flex-1 text-sm"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCustomDaysItemId(null)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 flex-wrap">
                            {DAY_PRESETS.map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => onUpdateItem(item.id, { diasEstimados: d })}
                                className={`h-7 w-8 text-xs rounded-md border transition-colors ${
                                  item.diasEstimados === d
                                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setCustomDaysItemId(item.id)}
                              className={`h-7 px-2 text-[10px] rounded-md border transition-colors ${
                                item.diasEstimados > 7
                                  ? 'bg-primary text-primary-foreground border-primary font-bold'
                                  : 'border-border hover:bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              {item.diasEstimados > 7 ? `${item.diasEstimados}d` : 'Más...'}
                            </button>
                          </div>
                        )}

                        {/* Return date preview */}
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          Devolución: {formatReturnDate(returnDate)}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold">{formatCurrency(item.subtotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 space-y-1 shrink-0">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal equipos:</span>
                  <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Garantías:</span>
                  <span className="font-mono">{formatCurrency(totals.deposito)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-1.5 mt-1.5">
                  <span>Total estimado:</span>
                  <span className="font-mono text-lg">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
