import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { returnSchema, ReturnFormData } from '@/lib/validations/rental';
import { Rental } from '@/types/rental';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  Loader2,
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface ReturnModalProps {
  rental: Rental | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (rentalId: string, data: ReturnFormData) => void;
}

export const ReturnModal = ({ rental, open, onClose, onSubmit }: ReturnModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      fecha: new Date(),
      observacion: '',
      devolucionParcial: false,
      itemsDevueltos: [],
    },
  });

  const returnDate = form.watch('fecha') || new Date();

  const calculations = useMemo(() => {
    if (!rental) return null;

    const inicio = new Date(rental.fechaInicio);
    const finEstimada = rental.fechaFinEstimada ? new Date(rental.fechaFinEstimada) : null;
    const devolucion = new Date(returnDate);

    // Days calculations
    const diasTotales = Math.max(1, Math.ceil((devolucion.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
    const diasEstimados = finEstimada
      ? Math.max(1, Math.ceil((finEstimada.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))
      : diasTotales;
    const diasDiferencia = diasTotales - diasEstimados;
    const estaAtrasado = finEstimada ? devolucion > finEstimada : false;
    const estaAnticipado = finEstimada ? devolucion < finEstimada : false;

    // Cost calculations (mock extra cost per day based on rental total)
    const costoDiario = rental.items.reduce((sum, item) => {
      return sum + (item.equipment.precioDia * item.cantidad);
    }, 0);

    const costoExtra = estaAtrasado ? diasDiferencia * costoDiario : 0;
    const descuentoAnticipo = estaAnticipado ? Math.abs(diasDiferencia) * costoDiario : 0;

    const totalOriginal = rental.total;
    const totalAjustado = totalOriginal + costoExtra - descuentoAnticipo;
    const saldoFinal = totalAjustado - rental.pagado;

    return {
      inicio,
      finEstimada,
      diasTotales,
      diasEstimados,
      diasDiferencia,
      estaAtrasado,
      estaAnticipado,
      costoDiario,
      costoExtra,
      descuentoAnticipo,
      totalOriginal,
      totalAjustado,
      saldoFinal,
    };
  }, [rental, returnDate]);

  const handleSubmit = async (data: ReturnFormData) => {
    if (!rental) return;
    setIsSubmitting(true);
    try {
      onSubmit(rental.id, data);
      form.reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rental || !calculations) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <RotateCcw className="h-5 w-5 text-primary" />
            Devolución de Arriendo
            <Badge variant="outline" className="ml-2 font-mono">{rental.folio}</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Client & Rental Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Cliente</p>
            <p className="font-semibold text-sm">{rental.clienteNombre}</p>
            <p className="text-xs text-muted-foreground font-mono">{rental.clienteRut}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Período arriendo</p>
            <p className="font-semibold text-sm">{formatDate(calculations.inicio)}</p>
            <p className="text-xs text-muted-foreground">
              {calculations.finEstimada
                ? `hasta ${formatDate(calculations.finEstimada)}`
                : 'Arriendo abierto'}
            </p>
          </div>
        </div>

        {/* Equipment List with checkboxes */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipos en arriendo</p>
          </div>
          <div className="divide-y divide-border">
            {rental.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{item.equipment.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.equipment.codigo} · x{item.cantidad}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-medium">
                  {formatCurrency(item.equipment.precioDia)}/día
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Days Calculation - The Hero Section */}
        <div className={cn(
          "rounded-lg border-2 p-4",
          calculations.estaAtrasado
            ? "border-destructive/50 bg-destructive/5"
            : calculations.estaAnticipado
              ? "border-green-500/50 bg-green-500/5"
              : "border-primary/50 bg-primary/5"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {calculations.estaAtrasado ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <Clock className="h-5 w-5 text-primary" />
              )}
              <span className="font-semibold text-sm">Cálculo de Días</span>
            </div>
            {calculations.estaAtrasado && (
              <Badge variant="destructive" className="text-xs">
                {calculations.diasDiferencia} días de atraso
              </Badge>
            )}
            {calculations.estaAnticipado && (
              <Badge className="text-xs bg-green-500/10 text-green-700 border-green-500/30">
                {Math.abs(calculations.diasDiferencia)} días anticipado
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-background/80 rounded-md p-2.5">
              <p className="text-2xl font-bold">{calculations.diasEstimados}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Días pactados</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className={cn(
              "rounded-md p-2.5",
              calculations.estaAtrasado
                ? "bg-destructive/10"
                : calculations.estaAnticipado
                  ? "bg-green-500/10"
                  : "bg-background/80"
            )}>
              <p className="text-2xl font-bold">{calculations.diasTotales}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Días reales</p>
            </div>
          </div>

          {calculations.diasDiferencia !== 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Costo diario total
                </span>
                <span className="font-mono">{formatCurrency(calculations.costoDiario)}</span>
              </div>
              {calculations.estaAtrasado && (
                <div className="flex items-center justify-between text-sm mt-1.5">
                  <span className="text-destructive font-medium">
                    Cargo extra ({calculations.diasDiferencia} días)
                  </span>
                  <span className="font-mono font-semibold text-destructive">
                    +{formatCurrency(calculations.costoExtra)}
                  </span>
                </div>
              )}
              {calculations.estaAnticipado && (
                <div className="flex items-center justify-between text-sm mt-1.5">
                  <span className="text-green-600 font-medium">
                    Descuento ({Math.abs(calculations.diasDiferencia)} días)
                  </span>
                  <span className="font-mono font-semibold text-green-600">
                    -{formatCurrency(calculations.descuentoAnticipo)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total original</span>
            <span className="font-mono">{formatCurrency(calculations.totalOriginal)}</span>
          </div>
          {calculations.costoExtra > 0 && (
            <div className="flex justify-between text-sm text-destructive">
              <span>+ Cargo por atraso</span>
              <span className="font-mono">+{formatCurrency(calculations.costoExtra)}</span>
            </div>
          )}
          {calculations.descuentoAnticipo > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>- Descuento anticipo</span>
              <span className="font-mono">-{formatCurrency(calculations.descuentoAnticipo)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total ajustado</span>
            <span className="font-mono">{formatCurrency(calculations.totalAjustado)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pagado</span>
            <span className="font-mono text-green-600">-{formatCurrency(rental.pagado)}</span>
          </div>
          <Separator />
          <div className={cn(
            "flex justify-between font-bold text-base pt-1",
            calculations.saldoFinal > 0 ? "text-destructive" : "text-green-600"
          )}>
            <span>{calculations.saldoFinal > 0 ? 'Saldo pendiente' : 'A favor del cliente'}</span>
            <span className="font-mono">{formatCurrency(Math.abs(calculations.saldoFinal))}</span>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha devolución</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? formatDate(field.value) : 'Seleccionar'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="devolucionParcial"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <div className="flex items-center space-x-3 h-10 px-3 border border-input rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer !mt-0">
                        Devolución parcial
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Estado de equipos, daños, faltantes..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1",
                  calculations.saldoFinal > 0 && "bg-destructive hover:bg-destructive/90"
                )}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {calculations.saldoFinal > 0
                  ? `Devolver (Saldo: ${formatCurrency(calculations.saldoFinal)})`
                  : 'Confirmar devolución'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
