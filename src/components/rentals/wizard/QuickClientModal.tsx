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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { quickClientSchema, QuickClientFormData } from '@/lib/validations/rental';
import { Customer } from '@/types/customer';
import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { formatRut } from '@/lib/validations/customer';

interface QuickClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: Customer) => void;
}

export const QuickClientModal = ({ open, onClose, onSubmit }: QuickClientModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuickClientFormData>({
    resolver: zodResolver(quickClientSchema),
    defaultValues: {
      tipoCliente: 'PERSONA',
      nombre: '',
      rut: '',
      telefono: '',
      email: '',
    },
  });

  const tipoCliente = form.watch('tipoCliente');

  const handleSubmit = async (data: QuickClientFormData) => {
    setIsSubmitting(true);
    try {
      // Create a mock client
      const newClient: Customer = {
        id: `client-${Date.now()}`,
        tipoCliente: data.tipoCliente,
        nombre: data.nombre,
        rut: data.rut,
        telefono: data.telefono || '',
        email: data.email || '',
        direccion: '',
        estado: 'ACTIVO',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onSubmit(newClient);
      form.reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    form.setValue('rut', formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Crear Cliente Rápido
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipoCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERSONA">Persona Natural</SelectItem>
                      <SelectItem value="EMPRESA">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoCliente === 'PERSONA' ? 'Nombre completo' : 'Razón social'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={tipoCliente === 'PERSONA' ? 'Juan Pérez' : 'Empresa S.A.'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12.345.678-9"
                      {...field}
                      onChange={handleRutChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+56 9 1234 5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="correo@ejemplo.cl" {...field} />
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
                Crear cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
