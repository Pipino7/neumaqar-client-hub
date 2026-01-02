import { z } from 'zod';

// Validación de RUT chileno
const formatRut = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
};

const validateRut = (rut: string): boolean => {
  const cleanRut = formatRut(rut);
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDv = 11 - (sum % 11);
  const dvMap: { [key: number]: string } = { 11: '0', 10: 'K' };
  const expectedDvChar = dvMap[expectedDv] || expectedDv.toString();
  
  return dv === expectedDvChar;
};

export const customerSchema = z.object({
  tipoCliente: z.enum(['PERSONA', 'EMPRESA'], {
    required_error: 'Seleccione el tipo de cliente',
  }),
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  rut: z
    .string()
    .min(8, 'El RUT debe tener al menos 8 caracteres')
    .max(12, 'El RUT no puede exceder 12 caracteres')
    .refine(validateRut, 'RUT inválido'),
  telefono: z
    .string()
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .regex(/^[+]?[\d\s-]+$/, 'Formato de teléfono inválido'),
  email: z
    .string()
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  direccion: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  contactoSecundario: z
    .string()
    .max(100, 'El contacto secundario no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  observaciones: z
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const formatRutDisplay = (rut: string): string => {
  const clean = formatRut(rut);
  if (clean.length < 2) return clean;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
};
