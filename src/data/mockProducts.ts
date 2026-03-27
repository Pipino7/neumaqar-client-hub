import { Product, ProductCategory } from '@/types/product';

export const productCategories: ProductCategory[] = [
  { id: 'cat-1', nombre: 'Aceites y Lubricantes', color: 'hsl(45, 90%, 50%)', icon: 'Droplets' },
  { id: 'cat-2', nombre: 'Filtros', color: 'hsl(200, 70%, 50%)', icon: 'Filter' },
  { id: 'cat-3', nombre: 'Repuestos Hidráulicos', color: 'hsl(0, 70%, 50%)', icon: 'Wrench' },
  { id: 'cat-4', nombre: 'Correas y Mangueras', color: 'hsl(140, 60%, 40%)', icon: 'Cable' },
  { id: 'cat-5', nombre: 'Elementos de Desgaste', color: 'hsl(280, 50%, 50%)', icon: 'Cog' },
  { id: 'cat-6', nombre: 'Electricidad', color: 'hsl(30, 80%, 50%)', icon: 'Zap' },
];

export const mockProducts: Product[] = [
  // Aceites y Lubricantes
  { id: 'p-1', codigo: 'ACE-001', nombre: 'Aceite Motor 15W-40 (20L)', categoria: 'cat-1', unidad: 'Bidón', stock: 12, stockMinimo: 5, precioCompra: 45000, precioVenta: 62000, ubicacion: 'Bodega A - Estante 1', proveedor: 'Lubricantes del Sur', estado: 'DISPONIBLE', ultimaCompra: new Date('2025-01-15') },
  { id: 'p-2', codigo: 'ACE-002', nombre: 'Aceite Hidráulico ISO 68 (20L)', categoria: 'cat-1', unidad: 'Bidón', stock: 8, stockMinimo: 4, precioCompra: 52000, precioVenta: 71000, ubicacion: 'Bodega A - Estante 1', proveedor: 'Lubricantes del Sur', estado: 'DISPONIBLE', ultimaCompra: new Date('2025-02-10') },
  { id: 'p-3', codigo: 'ACE-003', nombre: 'Grasa Multiuso EP2 (18kg)', categoria: 'cat-1', unidad: 'Balde', stock: 3, stockMinimo: 3, precioCompra: 38000, precioVenta: 52000, ubicacion: 'Bodega A - Estante 2', proveedor: 'Lubricantes del Sur', estado: 'STOCK_BAJO' },
  { id: 'p-4', codigo: 'ACE-004', nombre: 'Aceite Transmisión 80W-90 (5L)', categoria: 'cat-1', unidad: 'Envase', stock: 0, stockMinimo: 6, precioCompra: 18000, precioVenta: 26000, ubicacion: 'Bodega A - Estante 1', proveedor: 'Distribuidora Norte', estado: 'AGOTADO' },
  // Filtros
  { id: 'p-5', codigo: 'FIL-001', nombre: 'Filtro Aceite CAT 1R-0751', categoria: 'cat-2', unidad: 'Unidad', stock: 15, stockMinimo: 8, precioCompra: 12000, precioVenta: 18500, ubicacion: 'Bodega B - Rack 1', proveedor: 'CAT Parts Chile', estado: 'DISPONIBLE', ultimaCompra: new Date('2025-03-01') },
  { id: 'p-6', codigo: 'FIL-002', nombre: 'Filtro Combustible CAT 1R-0750', categoria: 'cat-2', unidad: 'Unidad', stock: 10, stockMinimo: 6, precioCompra: 15000, precioVenta: 22000, ubicacion: 'Bodega B - Rack 1', proveedor: 'CAT Parts Chile', estado: 'DISPONIBLE' },
  { id: 'p-7', codigo: 'FIL-003', nombre: 'Filtro Aire Primario P532503', categoria: 'cat-2', unidad: 'Unidad', stock: 4, stockMinimo: 4, precioCompra: 28000, precioVenta: 39000, ubicacion: 'Bodega B - Rack 2', proveedor: 'Donaldson Chile', estado: 'STOCK_BAJO' },
  { id: 'p-8', codigo: 'FIL-004', nombre: 'Filtro Hidráulico HF6586', categoria: 'cat-2', unidad: 'Unidad', stock: 7, stockMinimo: 3, precioCompra: 32000, precioVenta: 45000, ubicacion: 'Bodega B - Rack 2', proveedor: 'Fleetguard', estado: 'DISPONIBLE' },
  // Repuestos Hidráulicos
  { id: 'p-9', codigo: 'HID-001', nombre: 'Sello Kit Cilindro 320D', categoria: 'cat-3', unidad: 'Kit', stock: 2, stockMinimo: 2, precioCompra: 85000, precioVenta: 120000, ubicacion: 'Bodega C - Caja 5', proveedor: 'Hidráulica Sur', estado: 'STOCK_BAJO' },
  { id: 'p-10', codigo: 'HID-002', nombre: 'Bomba Hidráulica Reman', categoria: 'cat-3', unidad: 'Unidad', stock: 1, stockMinimo: 1, precioCompra: 450000, precioVenta: 620000, ubicacion: 'Bodega C - Piso', proveedor: 'Hidráulica Sur', estado: 'DISPONIBLE' },
  { id: 'p-11', codigo: 'HID-003', nombre: 'Válvula Control Flujo', categoria: 'cat-3', unidad: 'Unidad', stock: 0, stockMinimo: 2, precioCompra: 180000, precioVenta: 250000, ubicacion: 'Bodega C - Caja 3', proveedor: 'Parker Chile', estado: 'AGOTADO' },
  // Correas y Mangueras
  { id: 'p-12', codigo: 'COR-001', nombre: 'Correa Alternador 6PK2135', categoria: 'cat-4', unidad: 'Unidad', stock: 6, stockMinimo: 3, precioCompra: 15000, precioVenta: 22000, ubicacion: 'Bodega B - Rack 3', proveedor: 'Gates Chile', estado: 'DISPONIBLE' },
  { id: 'p-13', codigo: 'COR-002', nombre: 'Manguera Hidráulica 1/2" x 2m', categoria: 'cat-4', unidad: 'Unidad', stock: 8, stockMinimo: 4, precioCompra: 22000, precioVenta: 32000, ubicacion: 'Bodega B - Rack 3', proveedor: 'Parker Chile', estado: 'DISPONIBLE' },
  // Elementos de Desgaste
  { id: 'p-14', codigo: 'DES-001', nombre: 'Diente Balde Excavadora', categoria: 'cat-5', unidad: 'Unidad', stock: 20, stockMinimo: 10, precioCompra: 8000, precioVenta: 13500, ubicacion: 'Bodega D - Pallet 1', proveedor: 'ESCO Chile', estado: 'DISPONIBLE' },
  { id: 'p-15', codigo: 'DES-002', nombre: 'Cuchilla Topadora 8E-4193', categoria: 'cat-5', unidad: 'Unidad', stock: 2, stockMinimo: 4, precioCompra: 95000, precioVenta: 135000, ubicacion: 'Bodega D - Pallet 2', proveedor: 'ESCO Chile', estado: 'STOCK_BAJO' },
  // Electricidad
  { id: 'p-16', codigo: 'ELE-001', nombre: 'Batería 12V 150Ah', categoria: 'cat-6', unidad: 'Unidad', stock: 3, stockMinimo: 2, precioCompra: 120000, precioVenta: 165000, ubicacion: 'Bodega A - Piso', proveedor: 'Baterías Pro', estado: 'DISPONIBLE' },
  { id: 'p-17', codigo: 'ELE-002', nombre: 'Motor Arranque 24V Reman', categoria: 'cat-6', unidad: 'Unidad', stock: 0, stockMinimo: 1, precioCompra: 280000, precioVenta: 380000, ubicacion: 'Bodega C - Estante 4', proveedor: 'Electro Maq', estado: 'AGOTADO' },
  { id: 'p-18', codigo: 'ELE-003', nombre: 'Alternador 24V 70A', categoria: 'cat-6', unidad: 'Unidad', stock: 1, stockMinimo: 1, precioCompra: 220000, precioVenta: 310000, ubicacion: 'Bodega C - Estante 4', proveedor: 'Electro Maq', estado: 'DISPONIBLE' },
];
