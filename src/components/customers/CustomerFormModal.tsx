import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer } from '@/types/customer';
import { customerSchema, CustomerFormData, formatRutDisplay } from '@/lib/validations/customer';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Building2, User } from 'lucide-react';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  customer?: Customer | null;
  isLoading?: boolean;
}

export const CustomerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading = false,
}: CustomerFormModalProps) => {
  const isEditing = !!customer;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      tipoCliente: 'PERSONA',
      nombre: '',
      rut: '',
      telefono: '',
      email: '',
      direccion: '',
      contactoSecundario: '',
      observaciones: '',
    },
  });

  const tipoCliente = form.watch('tipoCliente');

  useEffect(() => {
    if (customer) {
      form.reset({
        tipoCliente: customer.tipoCliente,
        nombre: customer.nombre,
        rut: customer.rut,
        telefono: customer.telefono,
        email: customer.email,
        direccion: customer.direccion,
        contactoSecundario: customer.contactoSecundario || '',
        observaciones: customer.observaciones || '',
      });
    } else {
      form.reset({
        tipoCliente: 'PERSONA',
        nombre: '',
        rut: '',
        telefono: '',
        email: '',
        direccion: '',
        contactoSecundario: '',
        observaciones: '',
      });
    }
  }, [customer, form]);

  const handleSubmit = async (data: CustomerFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-foreground p-0 gap-0">
        <DialogHeader className="p-6 border-b-2 border-foreground">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Building2 className="h-5 w-5" />
                Editar Cliente
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Nuevo Cliente
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
            {/* Tipo de Cliente */}
            <FormField
              control={form.control}
              name="tipoCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Tipo de Cliente *</FormLabel>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={field.value === 'PERSONA' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => field.onChange('PERSONA')}
                    >
                      <User className="h-4 w-4" />
                      Persona Natural
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'EMPRESA' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => field.onChange('EMPRESA')}
                    >
                      <Building2 className="h-4 w-4" />
                      Empresa
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {tipoCliente === 'EMPRESA' ? 'Razón Social *' : 'Nombre Completo *'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        tipoCliente === 'EMPRESA'
                          ? 'Ej: Constructora Andes SpA'
                          : 'Ej: Juan Carlos Pérez González'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RUT y Teléfono */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">RUT *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 12.345.678-9" {...field} />
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
                    <FormLabel className="font-bold">Teléfono *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: +56 9 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ej: contacto@empresa.cl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Dirección *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Av. Industrial 1234, Pudahuel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contacto Secundario (solo para empresas) */}
            {tipoCliente === 'EMPRESA' && (
              <FormField
                control={form.control}
                name="contactoSecundario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Contacto Secundario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Juan Pérez - Gerente de Operaciones - +56 9 8765 4321"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre el cliente..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t-2 border-foreground">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  'Actualizar Cliente'
                ) : (
                  'Crear Cliente'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
