export interface Product {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMinimo: number;
  precioCompra: number;
  precioVenta: number;
  ubicacion: string;
  proveedor: string;
  estado: 'DISPONIBLE' | 'STOCK_BAJO' | 'AGOTADO';
  ultimaCompra?: Date;
}

export interface ProductCategory {
  id: string;
  nombre: string;
  color: string;
  icon: string;
}
