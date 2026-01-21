import { RentalFilters, RentalStatus } from '@/types/rental';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, X, CalendarIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface RentalFiltersBarProps {
  filters: RentalFilters;
  onUpdateFilters: (filters: Partial<RentalFilters>) => void;
  onResetFilters: () => void;
}

export const RentalFiltersBar = ({
  filters,
  onUpdateFilters,
  onResetFilters,
}: RentalFiltersBarProps) => {
  const hasActiveFilters =
    filters.search ||
    filters.estado !== 'TODOS' ||
    filters.tipoCliente !== 'TODOS' ||
    filters.fechaDesde ||
    filters.fechaHasta;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por folio, nombre o RUT..."
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.estado}
          onValueChange={(value) => onUpdateFilters({ estado: value as RentalStatus | 'TODOS' })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los estados</SelectItem>
            <SelectItem value="BORRADOR">Borrador</SelectItem>
            <SelectItem value="ACTIVO">Activo</SelectItem>
            <SelectItem value="DEVUELTO">Devuelto</SelectItem>
            <SelectItem value="ATRASADO">Atrasado</SelectItem>
            <SelectItem value="ANULADO">Anulado</SelectItem>
          </SelectContent>
        </Select>

        {/* Client Type Filter */}
        <Select
          value={filters.tipoCliente}
          onValueChange={(value) => onUpdateFilters({ tipoCliente: value as 'PERSONA' | 'EMPRESA' | 'TODOS' })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los tipos</SelectItem>
            <SelectItem value="PERSONA">Persona</SelectItem>
            <SelectItem value="EMPRESA">Empresa</SelectItem>
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[160px] justify-start text-left font-normal',
                !filters.fechaDesde && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.fechaDesde ? formatDate(filters.fechaDesde) : 'Desde'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.fechaDesde}
              onSelect={(date) => onUpdateFilters({ fechaDesde: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[160px] justify-start text-left font-normal',
                !filters.fechaHasta && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.fechaHasta ? formatDate(filters.fechaHasta) : 'Hasta'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.fechaHasta}
              onSelect={(date) => onUpdateFilters({ fechaHasta: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};
