import { useState, useMemo } from 'react';
import { Customer } from '@/types/customer';
import { mockCustomers } from '@/data/mockCustomers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserPlus, Check, User, Building2 } from 'lucide-react';

interface ClientStepProps {
  selectedClient: Customer | null;
  onSelectClient: (client: Customer) => void;
  onCreateQuickClient: () => void;
}

export const ClientStep = ({ selectedClient, onSelectClient, onCreateQuickClient }: ClientStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery) return mockCustomers.filter((c) => c.estado === 'ACTIVO').slice(0, 5);
    
    const query = searchQuery.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.estado === 'ACTIVO' &&
        (c.nombre.toLowerCase().includes(query) || c.rut.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Seleccionar Cliente</h3>
        <p className="text-sm text-muted-foreground">
          Busque y seleccione el cliente para este arriendo
        </p>
      </div>

      {/* Selected client display */}
      {selectedClient && (
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {selectedClient.tipoCliente === 'PERSONA' ? (
                    <User className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{selectedClient.nombre}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedClient.rut}</p>
                </div>
              </div>
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Seleccionado
              </Badge>
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="ml-2">{selectedClient.telefono}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">{selectedClient.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o RUT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={onCreateQuickClient} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Crear cliente rápido
        </Button>
      </div>

      {/* Client list */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron clientes con ese criterio
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedClient?.id === client.id ? 'border-primary' : ''
              }`}
              onClick={() => onSelectClient(client)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {client.tipoCliente === 'PERSONA' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{client.nombre}</p>
                      <p className="text-sm text-muted-foreground font-mono">{client.rut}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {client.tipoCliente === 'PERSONA' ? 'Persona' : 'Empresa'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
