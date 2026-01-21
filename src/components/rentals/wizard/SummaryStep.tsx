import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Customer } from '@/types/customer';
import { RentalItem, PaymentMethod } from '@/types/rental';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Building2, CreditCard, Package } from 'lucide-react';
import { formatCurrency, formatDate, getRateLabel } from '@/lib/utils/formatters';
import { CreateRentalFormData } from '@/lib/validations/rental';

interface SummaryStepProps {
  selectedClient: Customer | null;
  items: RentalItem[];
}

export const SummaryStep = ({ selectedClient, items }: SummaryStepProps) => {
  const form = useFormContext<CreateRentalFormData>();
  const [includePayment, setIncludePayment] = useState(false);

  const requiereDeposito = form.watch('requiereDeposito');
  const fechaInicio = form.watch('fechaInicio');
  const fechaFinEstimada = form.watch('fechaFinEstimada');
  const arriendoAbierto = form.watch('arriendoAbierto');
  const abonoMonto = form.watch('abonoInicial.monto') || 0;

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const depositoTotal = requiereDeposito
    ? items.reduce((sum, i) => sum + i.deposito * i.cantidad, 0)
    : 0;
  const total = subtotal + depositoTotal;
  const saldo = total - abonoMonto;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Resumen del Arriendo</h3>
        <p className="text-sm text-muted-foreground">
          Verifique los datos y registre un pago inicial si corresponde
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Summary */}
        <div className="space-y-4">
          {/* Client Summary */}
          {selectedClient && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {selectedClient.tipoCliente === 'PERSONA' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Building2 className="h-4 w-4" />
                  )}
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium">{selectedClient.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RUT:</span>
                    <span className="font-mono">{selectedClient.rut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="outline">
                      {selectedClient.tipoCliente === 'PERSONA' ? 'Persona' : 'Empresa'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dates Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">{formatDate(fechaInicio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fin estimado:</span>
                  <span className="font-medium">
                    {arriendoAbierto ? (
                      <span className="italic text-muted-foreground">Abierto</span>
                    ) : (
                      formatDate(fechaFinEstimada)
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Equipos ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.equipment.nombre}</span>
                      <span className="text-muted-foreground ml-2">
                        x{item.cantidad} ({getRateLabel(item.tarifaTipo)})
                      </span>
                    </div>
                    <span className="font-mono">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Totals & Payment */}
        <div className="space-y-4">
          {/* Totals */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal equipos:</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                {requiereDeposito && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Depósito/Garantía:</span>
                    <span className="font-mono">{formatCurrency(depositoTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>Total arriendo:</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
                {includePayment && abonoMonto > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Abono inicial:</span>
                      <span className="font-mono">-{formatCurrency(abonoMonto)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Saldo pendiente:</span>
                      <span className={`font-mono ${saldo > 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {formatCurrency(saldo)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Initial Payment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pago Inicial (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="includePayment"
                    checked={includePayment}
                    onCheckedChange={(checked) => {
                      setIncludePayment(!!checked);
                      if (!checked) {
                        form.setValue('abonoInicial', undefined);
                      }
                    }}
                  />
                  <label
                    htmlFor="includePayment"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Registrar abono inicial
                  </label>
                </div>

                {includePayment && (
                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="abonoInicial.monto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto del abono</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="abonoInicial.metodo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de pago</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                              <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                              <SelectItem value="TARJETA">Tarjeta</SelectItem>
                              <SelectItem value="MIXTO">Mixto</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="abonoInicial.referencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referencia (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nº de comprobante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
