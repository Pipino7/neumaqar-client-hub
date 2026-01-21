export type RentalStatus = 'BORRADOR' | 'ACTIVO' | 'DEVUELTO' | 'ATRASADO' | 'ANULADO';

export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'MIXTO';

export type RateType = 'DIA' | 'SEMANA' | 'MES';

export interface Equipment {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precioDia: number;
  precioSemana: number;
  precioMes: number;
  depositoSugerido: number;
  disponible: boolean;
  imagenUrl?: string;
}

export interface RentalItem {
  id: string;
  equipmentId: string;
  equipment: Equipment;
  cantidad: number;
  tarifaTipo: RateType;
  precioUnitario: number;
  diasEstimados: number;
  deposito: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  rentalId: string;
  fecha: Date;
  metodo: PaymentMethod;
  monto: number;
  referencia?: string;
  usuario?: string;
  createdAt: Date;
}

export interface RentalOperation {
  id: string;
  rentalId: string;
  tipo: 'ENTREGA' | 'DEVOLUCION' | 'CAMBIO_ESTADO';
  fecha: Date;
  observacion?: string;
  usuario?: string;
  createdAt: Date;
}

export interface Rental {
  id: string;
  folio: string;
  clienteId: string;
  clienteNombre: string;
  clienteRut: string;
  clienteTipo: 'PERSONA' | 'EMPRESA';
  fechaInicio: Date;
  fechaFinEstimada?: Date;
  fechaFinReal?: Date;
  arriendoAbierto: boolean;
  estado: RentalStatus;
  items: RentalItem[];
  pagos: Payment[];
  operaciones: RentalOperation[];
  subtotal: number;
  depositoTotal: number;
  total: number;
  pagado: number;
  saldo: number;
  requiereDeposito: boolean;
  cobroAdelantado: boolean;
  observaciones?: string;
  entregado: boolean;
  fechaEntrega?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalFilters {
  search: string;
  estado: RentalStatus | 'TODOS';
  tipoCliente: 'PERSONA' | 'EMPRESA' | 'TODOS';
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface CreateRentalItem {
  equipmentId: string;
  cantidad: number;
  tarifaTipo: RateType;
  precioUnitario: number;
  diasEstimados: number;
  deposito: number;
}

export interface CreateRentalDTO {
  clienteId: string;
  items: CreateRentalItem[];
  fechaInicio: Date;
  fechaFinEstimada?: Date;
  arriendoAbierto: boolean;
  requiereDeposito: boolean;
  cobroAdelantado: boolean;
  observaciones?: string;
  abonoInicial?: {
    monto: number;
    metodo: PaymentMethod;
    referencia?: string;
  };
}

export interface CreatePaymentDTO {
  monto: number;
  metodo: PaymentMethod;
  referencia?: string;
}

export interface DeliveryDTO {
  fecha: Date;
  observacion?: string;
}

export interface ReturnDTO {
  fecha: Date;
  observacion?: string;
  devolucionParcial: boolean;
  itemsDevueltos?: string[];
}
