import { useState } from 'react';
import { Customer, CustomerFilters, CustomerType, CustomerStatus } from '@/types/customer';
import { mockCustomers } from '@/data/mockCustomers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);

  const filterCustomers = (filters: CustomerFilters): Customer[] => {
    return customers.filter((customer) => {
      const matchesSearch =
        filters.search === '' ||
        customer.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.rut.toLowerCase().includes(filters.search.toLowerCase());

      const matchesTipo =
        filters.tipoCliente === 'TODOS' || customer.tipoCliente === filters.tipoCliente;

      const matchesEstado =
        filters.estado === 'TODOS' || customer.estado === filters.estado;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  };

  const getCustomerById = (id: string): Customer | undefined => {
    return customers.find((c) => c.id === id);
  };

  const createCustomer = async (data: Omit<Customer, 'id' | 'estado' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCustomer: Customer = {
      ...data,
      id: Date.now().toString(),
      estado: 'ACTIVO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCustomers((prev) => [...prev, newCustomer]);
    setIsLoading(false);
    return newCustomer;
  };

  const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let updatedCustomer: Customer | undefined;

    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id === id) {
          updatedCustomer = { ...customer, ...data, updatedAt: new Date() };
          return updatedCustomer;
        }
        return customer;
      })
    );

    setIsLoading(false);
    return updatedCustomer!;
  };

  const toggleCustomerStatus = async (id: string): Promise<void> => {
    const customer = getCustomerById(id);
    if (customer) {
      const newStatus: CustomerStatus = customer.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      await updateCustomer(id, { estado: newStatus });
    }
  };

  return {
    customers,
    isLoading,
    filterCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    toggleCustomerStatus,
  };
};
