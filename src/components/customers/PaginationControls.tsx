import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between p-4 border-2 border-t-0 border-foreground bg-card">
        <span className="text-sm text-muted-foreground">
          {totalItems} cliente{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between p-4 border-2 border-t-0 border-foreground bg-card">
      <span className="text-sm text-muted-foreground">
        {totalItems} cliente{totalItems !== 1 ? 's' : ''} • Página {currentPage} de {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => typeof page === 'number' && onGoToPage(page)}
            disabled={typeof page !== 'number'}
            className="min-w-[32px]"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
