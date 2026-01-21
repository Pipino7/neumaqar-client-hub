import { useState, useMemo, useCallback } from 'react';
import { Rental, RentalFilters, RentalStatus, Payment, CreatePaymentDTO, DeliveryDTO, ReturnDTO } from '@/types/rental';
import { mockRentals } from '@/data/mockRentals';

export const useRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [filters, setFilters] = useState<RentalFilters>({
    search: '',
    estado: 'TODOS',
    tipoCliente: 'TODOS',
    fechaDesde: undefined,
    fechaHasta: undefined,
  });

  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          rental.folio.toLowerCase().includes(searchLower) ||
          rental.clienteNombre.toLowerCase().includes(searchLower) ||
          rental.clienteRut.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.estado !== 'TODOS' && rental.estado !== filters.estado) {
        return false;
      }

      // Client type filter
      if (filters.tipoCliente !== 'TODOS' && rental.clienteTipo !== filters.tipoCliente) {
        return false;
      }

      // Date range filters
      if (filters.fechaDesde) {
        const fechaInicio = new Date(rental.fechaInicio);
        if (fechaInicio < filters.fechaDesde) return false;
      }

      if (filters.fechaHasta) {
        const fechaInicio = new Date(rental.fechaInicio);
        if (fechaInicio > filters.fechaHasta) return false;
      }

      return true;
    });
  }, [rentals, filters]);

  const updateFilters = useCallback((newFilters: Partial<RentalFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      estado: 'TODOS',
      tipoCliente: 'TODOS',
      fechaDesde: undefined,
      fechaHasta: undefined,
    });
  }, []);

  const getRentalById = useCallback((id: string): Rental | undefined => {
    return rentals.find((r) => r.id === id);
  }, [rentals]);

  const createRental = useCallback((data: Partial<Rental>): Rental => {
    const newRental: Rental = {
      id: `rental-${Date.now()}`,
      folio: `ARR-${new Date().getFullYear()}-${String(rentals.length + 1).padStart(4, '0')}`,
      clienteId: data.clienteId || '',
      clienteNombre: data.clienteNombre || '',
      clienteRut: data.clienteRut || '',
      clienteTipo: data.clienteTipo || 'PERSONA',
      fechaInicio: data.fechaInicio || new Date(),
      fechaFinEstimada: data.fechaFinEstimada,
      arriendoAbierto: data.arriendoAbierto || false,
      estado: 'BORRADOR',
      items: data.items || [],
      pagos: data.pagos || [],
      operaciones: [],
      subtotal: data.subtotal || 0,
      depositoTotal: data.depositoTotal || 0,
      total: data.total || 0,
      pagado: data.pagado || 0,
      saldo: data.saldo || (data.total || 0),
      requiereDeposito: data.requiereDeposito || false,
      cobroAdelantado: data.cobroAdelantado || false,
      observaciones: data.observaciones,
      entregado: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRentals((prev) => [newRental, ...prev]);
    return newRental;
  }, [rentals.length]);

  const updateRental = useCallback((id: string, data: Partial<Rental>): Rental | undefined => {
    let updated: Rental | undefined;
    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === id) {
          updated = { ...rental, ...data, updatedAt: new Date() };
          return updated;
        }
        return rental;
      })
    );
    return updated;
  }, []);

  const addPayment = useCallback((rentalId: string, paymentData: CreatePaymentDTO): Payment | undefined => {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      rentalId,
      fecha: new Date(),
      metodo: paymentData.metodo,
      monto: paymentData.monto,
      referencia: paymentData.referencia,
      usuario: 'Admin',
      createdAt: new Date(),
    };

    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === rentalId) {
          const newPagado = rental.pagado + paymentData.monto;
          return {
            ...rental,
            pagos: [...rental.pagos, newPayment],
            pagado: newPagado,
            saldo: rental.total - newPagado,
            updatedAt: new Date(),
          };
        }
        return rental;
      })
    );

    return newPayment;
  }, []);

  const markDelivery = useCallback((rentalId: string, deliveryData: DeliveryDTO): boolean => {
    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === rentalId) {
          return {
            ...rental,
            entregado: true,
            fechaEntrega: deliveryData.fecha,
            estado: 'ACTIVO' as RentalStatus,
            operaciones: [
              ...rental.operaciones,
              {
                id: `op-${Date.now()}`,
                rentalId,
                tipo: 'ENTREGA' as const,
                fecha: deliveryData.fecha,
                observacion: deliveryData.observacion,
                usuario: 'Admin',
                createdAt: new Date(),
              },
            ],
            updatedAt: new Date(),
          };
        }
        return rental;
      })
    );
    return true;
  }, []);

  const markReturn = useCallback((rentalId: string, returnData: ReturnDTO): boolean => {
    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === rentalId) {
          return {
            ...rental,
            estado: 'DEVUELTO' as RentalStatus,
            fechaFinReal: returnData.fecha,
            operaciones: [
              ...rental.operaciones,
              {
                id: `op-${Date.now()}`,
                rentalId,
                tipo: 'DEVOLUCION' as const,
                fecha: returnData.fecha,
                observacion: returnData.observacion,
                usuario: 'Admin',
                createdAt: new Date(),
              },
            ],
            updatedAt: new Date(),
          };
        }
        return rental;
      })
    );
    return true;
  }, []);

  const cancelRental = useCallback((rentalId: string, reason?: string): boolean => {
    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === rentalId) {
          return {
            ...rental,
            estado: 'ANULADO' as RentalStatus,
            operaciones: [
              ...rental.operaciones,
              {
                id: `op-${Date.now()}`,
                rentalId,
                tipo: 'CAMBIO_ESTADO' as const,
                fecha: new Date(),
                observacion: reason || 'Arriendo anulado',
                usuario: 'Admin',
                createdAt: new Date(),
              },
            ],
            updatedAt: new Date(),
          };
        }
        return rental;
      })
    );
    return true;
  }, []);

  const confirmRental = useCallback((rentalId: string): boolean => {
    setRentals((prev) =>
      prev.map((rental) => {
        if (rental.id === rentalId && rental.estado === 'BORRADOR') {
          return {
            ...rental,
            estado: 'ACTIVO' as RentalStatus,
            updatedAt: new Date(),
          };
        }
        return rental;
      })
    );
    return true;
  }, []);

  return {
    rentals: filteredRentals,
    allRentals: rentals,
    filters,
    updateFilters,
    resetFilters,
    getRentalById,
    createRental,
    updateRental,
    addPayment,
    markDelivery,
    markReturn,
    cancelRental,
    confirmRental,
  };
};
