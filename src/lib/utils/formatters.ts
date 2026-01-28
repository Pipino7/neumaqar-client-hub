export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCLP = formatCurrency;

export const formatDate = (date: Date | undefined): string => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: Date | undefined): string => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getRateLabel = (rate: 'DIA' | 'SEMANA' | 'MES'): string => {
  const labels = {
    DIA: 'Día',
    SEMANA: 'Semana',
    MES: 'Mes',
  };
  return labels[rate];
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    EFECTIVO: 'Efectivo',
    TRANSFERENCIA: 'Transferencia',
    TARJETA: 'Tarjeta',
    MIXTO: 'Mixto',
  };
  return labels[method] || method;
};

export const calculateDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (fechaFinEstimada: Date | undefined, estado: string): boolean => {
  if (!fechaFinEstimada || estado === 'DEVUELTO' || estado === 'ANULADO') return false;
  return new Date() > new Date(fechaFinEstimada);
};
