export type CustomerType = 'PERSONA' | 'EMPRESA';

export type CustomerStatus = 'ACTIVO' | 'INACTIVO';

export interface Customer {
  id: string;
  tipoCliente: CustomerType;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  contactoSecundario?: string;
  observaciones?: string;
  estado: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rental {
  id: string;
  customerId: string;
  maquinaria: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
  montoTotal: number;
}

export interface CustomerFilters {
  search: string;
  tipoCliente: CustomerType | 'TODOS';
  estado: CustomerStatus | 'TODOS';
}
