import { CustomerFilters, CustomerType, CustomerStatus } from '@/types/customer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface CustomerFiltersBarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  onClearFilters: () => void;
}

export const CustomerFiltersBar = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: CustomerFiltersBarProps) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.tipoCliente !== 'TODOS' ||
    filters.estado !== 'TODOS';

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-foreground bg-card">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o RUT..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Type Filter */}
      <Select
        value={filters.tipoCliente}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, tipoCliente: value as CustomerType | 'TODOS' })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los tipos</SelectItem>
          <SelectItem value="PERSONA">Persona</SelectItem>
          <SelectItem value="EMPRESA">Empresa</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.estado}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, estado: value as CustomerStatus | 'TODOS' })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los estados</SelectItem>
          <SelectItem value="ACTIVO">Activo</SelectItem>
          <SelectItem value="INACTIVO">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
};
