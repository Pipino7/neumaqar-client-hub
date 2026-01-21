import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Info } from 'lucide-react';
import { formatDate, calculateDaysBetween } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { CreateRentalFormData } from '@/lib/validations/rental';

export const DatesStep = () => {
  const form = useFormContext<CreateRentalFormData>();
  const arriendoAbierto = form.watch('arriendoAbierto');
  const fechaInicio = form.watch('fechaInicio');
  const fechaFinEstimada = form.watch('fechaFinEstimada');

  const diasEstimados = 
    !arriendoAbierto && fechaInicio && fechaFinEstimada
      ? calculateDaysBetween(fechaInicio, fechaFinEstimada)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Fechas y Condiciones</h3>
        <p className="text-sm text-muted-foreground">
          Configure las fechas y condiciones del arriendo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dates Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Período de Arriendo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fechaInicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de inicio</FormLabel>
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
                          {field.value ? formatDate(field.value) : 'Seleccionar fecha'}
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
              name="arriendoAbierto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Arriendo abierto</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Sin fecha de fin definida
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!arriendoAbierto && (
              <FormField
                control={form.control}
                name="fechaFinEstimada"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha fin estimada</FormLabel>
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
                            {field.value ? formatDate(field.value) : 'Seleccionar fecha'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < (fechaInicio || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {diasEstimados && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Duración estimada: <strong>{diasEstimados} días</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Condiciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="requiereDeposito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requiere depósito</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Cobrar garantía por los equipos
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cobroAdelantado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cobro adelantado</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Requiere pago antes de la entrega
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas o condiciones especiales..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
