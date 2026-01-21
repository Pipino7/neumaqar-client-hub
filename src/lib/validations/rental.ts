import { z } from 'zod';

export const rentalItemSchema = z.object({
  equipmentId: z.string().min(1, 'Equipo requerido'),
  cantidad: z.number().min(1, 'Cantidad mínima es 1'),
  tarifaTipo: z.enum(['DIA', 'SEMANA', 'MES']),
  precioUnitario: z.number().min(0, 'Precio no puede ser negativo'),
  diasEstimados: z.number().min(1, 'Días mínimos es 1'),
  deposito: z.number().min(0, 'Depósito no puede ser negativo'),
});

export const paymentSchema = z.object({
  monto: z.number().min(1, 'Monto debe ser mayor a 0'),
  metodo: z.enum(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'MIXTO']),
  referencia: z.string().optional(),
});

export const deliverySchema = z.object({
  fecha: z.date(),
  observacion: z.string().optional(),
});

export const returnSchema = z.object({
  fecha: z.date(),
  observacion: z.string().optional(),
  devolucionParcial: z.boolean(),
  itemsDevueltos: z.array(z.string()).optional(),
});

export const createRentalSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  items: z.array(rentalItemSchema).min(1, 'Debe agregar al menos un equipo'),
  fechaInicio: z.date(),
  fechaFinEstimada: z.date().optional(),
  arriendoAbierto: z.boolean(),
  requiereDeposito: z.boolean(),
  cobroAdelantado: z.boolean(),
  observaciones: z.string().optional(),
  abonoInicial: z.object({
    monto: z.number().min(0),
    metodo: z.enum(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'MIXTO']),
    referencia: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (!data.arriendoAbierto && data.fechaFinEstimada) {
    return data.fechaFinEstimada >= data.fechaInicio;
  }
  return true;
}, {
  message: 'Fecha fin debe ser posterior a fecha inicio',
  path: ['fechaFinEstimada'],
});

export const quickClientSchema = z.object({
  tipoCliente: z.enum(['PERSONA', 'EMPRESA']),
  nombre: z.string().min(2, 'Nombre requerido'),
  rut: z.string().min(8, 'RUT requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

export type CreateRentalFormData = z.infer<typeof createRentalSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type DeliveryFormData = z.infer<typeof deliverySchema>;
export type ReturnFormData = z.infer<typeof returnSchema>;
export type QuickClientFormData = z.infer<typeof quickClientSchema>;
