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
import { returnSchema, ReturnFormData } from '@/lib/validations/rental';
import { Rental } from '@/types/rental';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

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

  if (!rental) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Registrar Devolución
          </DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Folio:</span>
            <span className="font-mono font-medium">{rental.folio}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-medium">{rental.clienteNombre}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm font-medium mb-2">Equipos a devolver:</p>
            <ul className="space-y-1">
              {rental.items.map((item) => (
                <li key={item.id} className="text-sm text-muted-foreground">
                  • {item.equipment.nombre} x{item.cantidad}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de devolución</FormLabel>
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
              name="devolucionParcial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Devolución parcial</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Marcar si no se devuelven todos los equipos
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Estado de los equipos, daños, faltantes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar devolución
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
