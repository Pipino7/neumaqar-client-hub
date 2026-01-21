import { Rental, RentalStatus } from '@/types/rental';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, CreditCard, Truck, RotateCcw, XCircle, MoreHorizontal, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils/formatters';

interface RentalTableProps {
  rentals: Rental[];
  onView: (rental: Rental) => void;
  onEdit: (rental: Rental) => void;
  onAddPayment: (rental: Rental) => void;
  onDeliver: (rental: Rental) => void;
  onReturn: (rental: Rental) => void;
  onCancel: (rental: Rental) => void;
  onConfirm: (rental: Rental) => void;
}

const getStatusBadge = (status: RentalStatus, fechaFinEstimada?: Date) => {
  const overdue = isOverdue(fechaFinEstimada, status);
  
  const variants: Record<RentalStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    BORRADOR: { variant: 'secondary', label: 'Borrador' },
    ACTIVO: { variant: 'default', label: overdue ? 'Atrasado' : 'Activo' },
    DEVUELTO: { variant: 'outline', label: 'Devuelto' },
    ATRASADO: { variant: 'destructive', label: 'Atrasado' },
    ANULADO: { variant: 'secondary', label: 'Anulado' },
  };

  const config = variants[status];
  
  if (overdue && status === 'ACTIVO') {
    return <Badge variant="destructive">{config.label}</Badge>;
  }

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const RentalTable = ({
  rentals,
  onView,
  onEdit,
  onAddPayment,
  onDeliver,
  onReturn,
  onCancel,
  onConfirm,
}: RentalTableProps) => {
  if (rentals.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
        <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sin arriendos</h3>
        <p className="text-muted-foreground">No se encontraron arriendos con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-bold">Folio</TableHead>
            <TableHead className="font-bold">Cliente</TableHead>
            <TableHead className="font-bold">RUT</TableHead>
            <TableHead className="font-bold">Inicio</TableHead>
            <TableHead className="font-bold">Fin Est.</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="font-bold text-right">Total</TableHead>
            <TableHead className="font-bold text-right">Pagado</TableHead>
            <TableHead className="font-bold text-right">Saldo</TableHead>
            <TableHead className="font-bold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id} className="hover:bg-muted/30">
              <TableCell className="font-mono font-medium">{rental.folio}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{rental.clienteNombre}</span>
                  <Badge variant="outline" className="w-fit text-xs mt-1">
                    {rental.clienteTipo === 'PERSONA' ? 'Persona' : 'Empresa'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-mono">{rental.clienteRut}</TableCell>
              <TableCell>{formatDate(rental.fechaInicio)}</TableCell>
              <TableCell>
                {rental.arriendoAbierto ? (
                  <span className="text-muted-foreground italic">Abierto</span>
                ) : (
                  formatDate(rental.fechaFinEstimada)
                )}
              </TableCell>
              <TableCell>{getStatusBadge(rental.estado, rental.fechaFinEstimada)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(rental.total)}</TableCell>
              <TableCell className="text-right text-muted-foreground">{formatCurrency(rental.pagado)}</TableCell>
              <TableCell className={`text-right font-semibold ${rental.saldo > 0 ? 'text-destructive' : 'text-green-600'}`}>
                {formatCurrency(rental.saldo)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(rental)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </DropdownMenuItem>
                    
                    {rental.estado === 'BORRADOR' && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(rental)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onConfirm(rental)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar arriendo
                        </DropdownMenuItem>
                      </>
                    )}

                    {(rental.estado === 'ACTIVO' || rental.estado === 'ATRASADO') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAddPayment(rental)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Registrar pago
                        </DropdownMenuItem>
                        {!rental.entregado && (
                          <DropdownMenuItem onClick={() => onDeliver(rental)}>
                            <Truck className="mr-2 h-4 w-4" />
                            Marcar entrega
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onReturn(rental)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Registrar devolución
                        </DropdownMenuItem>
                      </>
                    )}

                    {(rental.estado === 'BORRADOR' || rental.estado === 'ACTIVO') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onCancel(rental)}
                          className="text-destructive focus:text-destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Anular
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
