import { Customer } from '@/types/customer';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Power } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
}

export const CustomerTable = ({ 
  customers, 
  onView, 
  onEdit, 
  onToggleStatus 
}: CustomerTableProps) => {
  if (customers.length === 0) {
    return (
      <div className="border-2 border-foreground p-12 text-center bg-card">
        <div className="w-16 h-16 border-2 border-foreground mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="font-bold text-lg mb-2">Sin resultados</h3>
        <p className="text-muted-foreground">
          No se encontraron clientes con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-foreground bg-muted hover:bg-muted">
            <TableHead className="font-bold">Nombre / Razón Social</TableHead>
            <TableHead className="font-bold">RUT</TableHead>
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold">Teléfono</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="font-bold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow 
              key={customer.id} 
              className="border-b border-border hover:bg-accent/50"
            >
              <TableCell className="font-medium">{customer.nombre}</TableCell>
              <TableCell className="font-mono text-sm">{customer.rut}</TableCell>
              <TableCell>
                <Badge 
                  variant={customer.tipoCliente === 'EMPRESA' ? 'default' : 'secondary'}
                  className="font-medium"
                >
                  {customer.tipoCliente === 'EMPRESA' ? 'Empresa' : 'Persona'}
                </Badge>
              </TableCell>
              <TableCell>{customer.telefono}</TableCell>
              <TableCell className="text-sm">{customer.email}</TableCell>
              <TableCell>
                <Badge 
                  variant={customer.estado === 'ACTIVO' ? 'default' : 'outline'}
                  className={customer.estado === 'ACTIVO' ? 'bg-chart-2 text-primary-foreground' : ''}
                >
                  {customer.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(customer)}
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(customer)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={customer.estado === 'ACTIVO' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => onToggleStatus(customer)}
                    title={customer.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
