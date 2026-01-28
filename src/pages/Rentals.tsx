import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RentalTable } from '@/components/rentals/RentalTable';
import { RentalFiltersBar } from '@/components/rentals/RentalFiltersBar';
import { PaymentModal } from '@/components/rentals/PaymentModal';
import { DeliveryModal } from '@/components/rentals/DeliveryModal';
import { ReturnModal } from '@/components/rentals/ReturnModal';
import { CancelRentalDialog } from '@/components/rentals/CancelRentalDialog';
import { PaginationControls } from '@/components/customers/PaginationControls';
import { useRentals } from '@/hooks/useRentals';
import { usePagination } from '@/hooks/usePagination';
import { Rental, RentalFilters } from '@/types/rental';
import { PaymentFormData, DeliveryFormData, ReturnFormData } from '@/lib/validations/rental';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText } from 'lucide-react';

const RentalsPage = () => {
  const { toast } = useToast();
  const {
    rentals,
    filters,
    updateFilters,
    resetFilters,
    addPayment,
    markDelivery,
    markReturn,
    cancelRental,
    confirmRental,
  } = useRentals();

  // Modal states
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    totalItems,
  } = usePagination({ data: rentals, itemsPerPage: 10 });

  // Filter handlers
  const handleUpdateFilters = (newFilters: Partial<RentalFilters>) => {
    updateFilters(newFilters);
    resetPagination();
  };

  const handleResetFilters = () => {
    resetFilters();
    resetPagination();
  };

  // View rental details
  const handleViewRental = (rental: Rental) => {
    // TODO: Implementar modal de detalle
    console.log('Ver detalle:', rental);
    toast({
      title: 'Ver detalle',
      description: `Arriendo ${rental.folio} - Próximamente`,
    });
  };

  // Edit rental
  const handleEditRental = (rental: Rental) => {
    // TODO: Implementar edición
    console.log('Editar:', rental);
    toast({
      title: 'Editar arriendo',
      description: `Edición de ${rental.folio} - Próximamente`,
    });
  };

  // Payment handlers
  const handleOpenPaymentModal = (rental: Rental) => {
    setSelectedRental(rental);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (rentalId: string, data: PaymentFormData) => {
    addPayment(rentalId, {
      monto: data.monto,
      metodo: data.metodo,
      referencia: data.referencia,
    });
    toast({
      title: 'Pago registrado',
      description: `Se ha registrado un pago de $${data.monto.toLocaleString('es-CL')}`,
    });
    setIsPaymentModalOpen(false);
    setSelectedRental(null);
  };

  // Delivery handlers
  const handleOpenDeliveryModal = (rental: Rental) => {
    setSelectedRental(rental);
    setIsDeliveryModalOpen(true);
  };

  const handleDeliverySubmit = (rentalId: string, data: DeliveryFormData) => {
    markDelivery(rentalId, {
      fecha: data.fecha,
      observacion: data.observacion,
    });
    toast({
      title: 'Entrega registrada',
      description: 'Los equipos han sido marcados como entregados.',
    });
    setIsDeliveryModalOpen(false);
    setSelectedRental(null);
  };

  // Return handlers
  const handleOpenReturnModal = (rental: Rental) => {
    setSelectedRental(rental);
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = (rentalId: string, data: ReturnFormData) => {
    markReturn(rentalId, {
      fecha: data.fecha,
      observacion: data.observacion,
      devolucionParcial: data.devolucionParcial,
      itemsDevueltos: data.itemsDevueltos,
    });
    toast({
      title: 'Devolución registrada',
      description: 'Los equipos han sido devueltos correctamente.',
    });
    setIsReturnModalOpen(false);
    setSelectedRental(null);
  };

  // Cancel handlers
  const handleOpenCancelDialog = (rental: Rental) => {
    setSelectedRental(rental);
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = (rentalId: string) => {
    cancelRental(rentalId);
    toast({
      title: 'Arriendo anulado',
      description: 'El arriendo ha sido anulado correctamente.',
      variant: 'destructive',
    });
    setIsCancelDialogOpen(false);
    setSelectedRental(null);
  };

  // Confirm rental
  const handleConfirmRental = (rental: Rental) => {
    confirmRental(rental.id);
    toast({
      title: 'Arriendo confirmado',
      description: `El arriendo ${rental.folio} ha sido activado.`,
    });
  };

  // Create new rental
  const handleCreateRental = () => {
    // TODO: Implementar wizard de creación
    toast({
      title: 'Nuevo arriendo',
      description: 'Wizard de creación - Próximamente',
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Arriendos</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los arriendos de maquinaria
            </p>
          </div>
        </div>
        <Button onClick={handleCreateRental} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Arriendo
        </Button>
      </div>

      {/* Filters */}
      <RentalFiltersBar
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Table */}
      <div className="mt-4">
        <RentalTable
          rentals={paginatedData}
          onView={handleViewRental}
          onEdit={handleEditRental}
          onAddPayment={handleOpenPaymentModal}
          onDeliver={handleOpenDeliveryModal}
          onReturn={handleOpenReturnModal}
          onCancel={handleOpenCancelDialog}
          onConfirm={handleConfirmRental}
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
      <PaymentModal
        rental={selectedRental}
        open={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedRental(null);
        }}
        onSubmit={handlePaymentSubmit}
      />

      <DeliveryModal
        rental={selectedRental}
        open={isDeliveryModalOpen}
        onClose={() => {
          setIsDeliveryModalOpen(false);
          setSelectedRental(null);
        }}
        onSubmit={handleDeliverySubmit}
      />

      <ReturnModal
        rental={selectedRental}
        open={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedRental(null);
        }}
        onSubmit={handleReturnSubmit}
      />

      <CancelRentalDialog
        rental={selectedRental}
        open={isCancelDialogOpen}
        onClose={() => {
          setIsCancelDialogOpen(false);
          setSelectedRental(null);
        }}
        onConfirm={handleCancelConfirm}
      />
    </DashboardLayout>
  );
};

export default RentalsPage;
