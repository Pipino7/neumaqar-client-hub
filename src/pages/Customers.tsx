import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerFiltersBar } from '@/components/customers/CustomerFiltersBar';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { CustomerDetailModal } from '@/components/customers/CustomerDetailModal';
import { PaginationControls } from '@/components/customers/PaginationControls';
import { useCustomers } from '@/hooks/useCustomers';
import { usePagination } from '@/hooks/usePagination';
import { Customer, CustomerFilters } from '@/types/customer';
import { CustomerFormData } from '@/lib/validations/customer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users } from 'lucide-react';

const CustomersPage = () => {
  const { toast } = useToast();
  const {
    isLoading,
    filterCustomers,
    createCustomer,
    updateCustomer,
    toggleCustomerStatus,
  } = useCustomers();

  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    tipoCliente: 'TODOS',
    estado: 'TODOS',
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return filterCustomers(filters);
  }, [filters, filterCustomers]);

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    totalItems,
  } = usePagination({ data: filteredCustomers, itemsPerPage: 5 });

  const handleClearFilters = () => {
    setFilters({
      search: '',
      tipoCliente: 'TODOS',
      estado: 'TODOS',
    });
    resetPagination();
  };

  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
    resetPagination();
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleToggleStatus = async (customer: Customer) => {
    await toggleCustomerStatus(customer.id);
    toast({
      title: customer.estado === 'ACTIVO' ? 'Cliente desactivado' : 'Cliente activado',
      description: `${customer.nombre} ha sido ${customer.estado === 'ACTIVO' ? 'desactivado' : 'activado'} correctamente.`,
    });
  };

  const handleFormSubmit = async (data: CustomerFormData) => {
    if (selectedCustomer) {
      await updateCustomer(selectedCustomer.id, data);
      toast({
        title: 'Cliente actualizado',
        description: `${data.nombre} ha sido actualizado correctamente.`,
      });
    } else {
      await createCustomer({
        tipoCliente: data.tipoCliente,
        nombre: data.nombre,
        rut: data.rut,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
        contactoSecundario: data.contactoSecundario,
        observaciones: data.observaciones,
      });
      toast({
        title: 'Cliente creado',
        description: `${data.nombre} ha sido creado correctamente.`,
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los clientes de arriendo de maquinaria
            </p>
          </div>
        </div>
        <Button onClick={handleCreateCustomer} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters */}
      <CustomerFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <div className="mt-4">
        <CustomerTable
          customers={paginatedData}
          onView={handleViewCustomer}
          onEdit={handleEditCustomer}
          onToggleStatus={handleToggleStatus}
        />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onGoToPage={goToPage}
        />
      </div>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
        isLoading={isLoading}
      />

      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        customer={selectedCustomer}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
