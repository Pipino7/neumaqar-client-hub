import { Customer } from '@/types/customer';
import { Rental } from '@/types/customer';
import { mockRentals } from '@/data/mockCustomers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, User, Phone, Mail, MapPin, FileText, Calendar, DollarSign, X } from 'lucide-react';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailModal = ({
  isOpen,
  onClose,
  customer,
}: CustomerDetailModalProps) => {
  if (!customer) return null;

  const customerRentals = mockRentals.filter((r) => r.customerId === customer.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRentalStatusColor = (estado: Rental['estado']) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-chart-2 text-primary-foreground';
      case 'FINALIZADO':
        return 'bg-muted text-foreground';
      case 'CANCELADO':
        return 'bg-destructive text-destructive-foreground';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-2 border-foreground p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b-2 border-foreground sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {customer.tipoCliente === 'EMPRESA' ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              {customer.nombre}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={customer.estado === 'ACTIVO' ? 'default' : 'outline'}>
                {customer.estado}
              </Badge>
              <Badge variant="secondary">
                {customer.tipoCliente === 'EMPRESA' ? 'Empresa' : 'Persona'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Información General */}
          <section>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b-2 border-foreground pb-2">
              <FileText className="h-5 w-5" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                  <span className="font-bold min-w-[100px]">RUT:</span>
                  <span className="font-mono">{customer.rut}</span>
                </div>
                <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                  <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Teléfono:</span>
                    <p>{customer.telefono}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                  <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Email:</span>
                    <p className="break-all">{customer.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Dirección:</span>
                    <p>{customer.direccion}</p>
                  </div>
                </div>
                {customer.contactoSecundario && (
                  <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                    <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Contacto Secundario:</span>
                      <p>{customer.contactoSecundario}</p>
                    </div>
                  </div>
                )}
                {customer.observaciones && (
                  <div className="flex items-start gap-3 p-3 border border-border bg-muted/30">
                    <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Observaciones:</span>
                      <p className="text-sm text-muted-foreground">{customer.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Historial de Arriendos */}
          <section>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b-2 border-foreground pb-2">
              <Calendar className="h-5 w-5" />
              Historial de Arriendos
            </h3>

            {customerRentals.length === 0 ? (
              <div className="border-2 border-dashed border-border p-8 text-center">
                <div className="w-12 h-12 border-2 border-foreground mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Este cliente no tiene arriendos registrados.
                </p>
              </div>
            ) : (
              <div className="border-2 border-foreground">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-foreground bg-muted hover:bg-muted">
                      <TableHead className="font-bold">Maquinaria</TableHead>
                      <TableHead className="font-bold">Fecha Inicio</TableHead>
                      <TableHead className="font-bold">Fecha Fin</TableHead>
                      <TableHead className="font-bold">Estado</TableHead>
                      <TableHead className="font-bold text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerRentals.map((rental) => (
                      <TableRow key={rental.id} className="border-b border-border">
                        <TableCell className="font-medium">{rental.maquinaria}</TableCell>
                        <TableCell>
                          {format(rental.fechaInicio, 'dd MMM yyyy', { locale: es })}
                        </TableCell>
                        <TableCell>
                          {format(rental.fechaFin, 'dd MMM yyyy', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRentalStatusColor(rental.estado)}>
                            {rental.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(rental.montoTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Estado de Cuenta (Placeholder) */}
          <section>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b-2 border-foreground pb-2">
              <DollarSign className="h-5 w-5" />
              Estado de Cuenta
            </h3>
            <div className="border-2 border-dashed border-border p-8 text-center">
              <div className="w-12 h-12 border-2 border-foreground mx-auto mb-3 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Módulo de facturación próximamente disponible.
              </p>
            </div>
          </section>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
            <span>
              Creado: {format(customer.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
            <span>
              Última actualización: {format(customer.updatedAt, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>
        </div>

        <div className="p-6 border-t-2 border-foreground sticky bottom-0 bg-background">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
