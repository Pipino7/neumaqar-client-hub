import { useState, useMemo } from 'react';
import { Equipment, RentalItem, RateType } from '@/types/rental';
import { useEquipment } from '@/hooks/useEquipment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Trash2, Package } from 'lucide-react';
import { formatCurrency, getRateLabel } from '@/lib/utils/formatters';

interface EquipmentStepProps {
  items: RentalItem[];
  onUpdateItems: (items: RentalItem[]) => void;
}

export const EquipmentStep = ({ items, onUpdateItems }: EquipmentStepProps) => {
  const { equipment, searchQuery, setSearchQuery, getEquipmentById, getPriceByRate } = useEquipment();

  const addItem = (eq: Equipment) => {
    const existingItem = items.find((i) => i.equipmentId === eq.id);
    if (existingItem) {
      // Increment quantity
      const updated = items.map((i) =>
        i.equipmentId === eq.id
          ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioUnitario * i.diasEstimados }
          : i
      );
      onUpdateItems(updated);
    } else {
      // Add new item
      const newItem: RentalItem = {
        id: `item-${Date.now()}`,
        equipmentId: eq.id,
        equipment: eq,
        cantidad: 1,
        tarifaTipo: 'DIA',
        precioUnitario: eq.precioDia,
        diasEstimados: 1,
        deposito: eq.depositoSugerido,
        subtotal: eq.precioDia,
      };
      onUpdateItems([...items, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    onUpdateItems(items.filter((i) => i.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<RentalItem>) => {
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const newItem = { ...item, ...updates };
        
        // Recalculate price if rate type changed
        if (updates.tarifaTipo) {
          newItem.precioUnitario = getPriceByRate(item.equipmentId, updates.tarifaTipo);
        }
        
        // Recalculate subtotal
        newItem.subtotal = newItem.cantidad * newItem.precioUnitario * newItem.diasEstimados;
        
        return newItem;
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const deposito = items.reduce((sum, i) => sum + i.deposito * i.cantidad, 0);
    return { subtotal, deposito, total: subtotal + deposito };
  }, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Agregar Equipos</h3>
        <p className="text-sm text-muted-foreground">
          Seleccione los equipos y maquinaria para el arriendo
        </p>
      </div>

      {/* Search Equipment */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipo por nombre o código..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
        {equipment.map((eq) => (
          <Card key={eq.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {eq.codigo}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {eq.categoria}
                    </Badge>
                  </div>
                  <p className="font-medium mt-1 truncate">{eq.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(eq.precioDia)}/día
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => addItem(eq)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Items Table */}
      {items.length > 0 && (
        <div className="border-2 border-foreground rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Equipo</TableHead>
                <TableHead className="font-bold w-[80px]">Cant.</TableHead>
                <TableHead className="font-bold w-[120px]">Tarifa</TableHead>
                <TableHead className="font-bold w-[80px]">Días</TableHead>
                <TableHead className="font-bold text-right">Precio</TableHead>
                <TableHead className="font-bold text-right">Subtotal</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.equipment.nombre}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.equipment.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(e) => updateItem(item.id, { cantidad: Number(e.target.value) || 1 })}
                      className="w-16 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.tarifaTipo}
                      onValueChange={(val) => updateItem(item.id, { tarifaTipo: val as RateType })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIA">Día</SelectItem>
                        <SelectItem value="SEMANA">Semana</SelectItem>
                        <SelectItem value="MES">Mes</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.diasEstimados}
                      onChange={(e) => updateItem(item.id, { diasEstimados: Number(e.target.value) || 1 })}
                      className="w-16 h-8"
                    />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.precioUnitario)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Totals */}
      {items.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal equipos:</span>
                <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Depósitos/Garantías:</span>
                <span className="font-mono">{formatCurrency(totals.deposito)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border pt-2">
                <span>Total estimado:</span>
                <span className="font-mono">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay equipos agregados</p>
          <p className="text-sm text-muted-foreground mt-1">
            Busque y seleccione equipos para agregarlos al arriendo
          </p>
        </div>
      )}
    </div>
  );
};
