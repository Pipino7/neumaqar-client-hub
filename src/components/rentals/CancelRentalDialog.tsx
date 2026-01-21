import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Rental } from '@/types/rental';
import { XCircle } from 'lucide-react';

interface CancelRentalDialogProps {
  rental: Rental | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (rentalId: string) => void;
}

export const CancelRentalDialog = ({ rental, open, onClose, onConfirm }: CancelRentalDialogProps) => {
  if (!rental) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Anular Arriendo
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea anular el arriendo <strong>{rental.folio}</strong>?
            <br /><br />
            Esta acción no se puede deshacer. El arriendo quedará marcado como anulado
            y los equipos volverán a estar disponibles.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(rental.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, anular arriendo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
