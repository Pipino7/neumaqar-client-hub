import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Search, Plus, Package, AlertTriangle, XCircle, ArrowUpDown,
  Droplets, Filter, Wrench, Cable, Cog, Zap, TrendingDown, TrendingUp,
  MapPin, Truck, BarChart3, Download,
} from 'lucide-react';
import { mockProducts, productCategories } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';

const iconMap: Record<string, React.ElementType> = {
  Droplets, Filter, Wrench, Cable, Cog, Zap,
};

const estadoBadge = (estado: Product['estado']) => {
  switch (estado) {
    case 'DISPONIBLE':
      return <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-300">Disponible</Badge>;
    case 'STOCK_BAJO':
      return <Badge className="bg-amber-500/15 text-amber-700 border-amber-300">Stock Bajo</Badge>;
    case 'AGOTADO':
      return <Badge variant="destructive">Agotado</Badge>;
  }
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEstado, setSelectedEstado] = useState('all');
  const [activeTab, setActiveTab] = useState('inventario');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchSearch = !searchQuery ||
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.proveedor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.categoria === selectedCategory;
      const matchEstado = selectedEstado === 'all' || p.estado === selectedEstado;
      return matchSearch && matchCat && matchEstado;
    });
  }, [searchQuery, selectedCategory, selectedEstado]);

  const stats = useMemo(() => {
    const total = mockProducts.length;
    const disponibles = mockProducts.filter(p => p.estado === 'DISPONIBLE').length;
    const stockBajo = mockProducts.filter(p => p.estado === 'STOCK_BAJO').length;
    const agotados = mockProducts.filter(p => p.estado === 'AGOTADO').length;
    const valorTotal = mockProducts.reduce((acc, p) => acc + (p.precioVenta * p.stock), 0);
    return { total, disponibles, stockBajo, agotados, valorTotal };
  }, []);

  const categoryStats = useMemo(() => {
    return productCategories.map(cat => {
      const items = mockProducts.filter(p => p.categoria === cat.id);
      const totalStock = items.reduce((acc, p) => acc + p.stock, 0);
      const alertas = items.filter(p => p.estado !== 'DISPONIBLE').length;
      return { ...cat, items: items.length, totalStock, alertas };
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-2 border-foreground">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Package className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Total Productos</p><p className="text-2xl font-bold">{stats.total}</p></div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">Disponibles</p><p className="text-2xl font-bold text-emerald-600">{stats.disponibles}</p></div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-xs text-muted-foreground">Stock Bajo</p><p className="text-2xl font-bold text-amber-600">{stats.stockBajo}</p></div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div><p className="text-xs text-muted-foreground">Agotados</p><p className="text-2xl font-bold text-red-600">{stats.agotados}</p></div>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><BarChart3 className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Valor Inventario</p><p className="text-lg font-bold">{formatCurrency(stats.valorTotal)}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="inventario">📦 Inventario</TabsTrigger>
              <TabsTrigger value="categorias">🗂️ Por Categoría</TabsTrigger>
              <TabsTrigger value="alertas">⚠️ Alertas Stock</TabsTrigger>
              <TabsTrigger value="proveedores">🚚 Proveedores</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Exportar</Button>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Nuevo Producto</Button>
            </div>
          </div>

          {/* ── Inventario ── */}
          <TabsContent value="inventario" className="space-y-4">
            {/* Filters */}
            <Card className="border-2 border-foreground">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, código o proveedor..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categoría" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {productCategories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                      <SelectItem value="STOCK_BAJO">Stock Bajo</SelectItem>
                      <SelectItem value="AGOTADO">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-2 border-foreground">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">Código</TableHead>
                    <TableHead className="font-bold">Producto</TableHead>
                    <TableHead className="font-bold">Categoría</TableHead>
                    <TableHead className="font-bold text-center">Stock</TableHead>
                    <TableHead className="font-bold text-center">Mín.</TableHead>
                    <TableHead className="font-bold text-right">P. Compra</TableHead>
                    <TableHead className="font-bold text-right">P. Venta</TableHead>
                    <TableHead className="font-bold text-center">Estado</TableHead>
                    <TableHead className="font-bold">Ubicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const cat = productCategories.find(c => c.id === p.categoria);
                    return (
                      <TableRow
                        key={p.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => setSelectedProduct(p)}
                      >
                        <TableCell className="font-mono font-bold text-xs">{p.codigo}</TableCell>
                        <TableCell className="font-medium">{p.nombre}</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: cat?.color, color: cat?.color }}>
                            {cat?.nombre}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold text-lg ${p.stock === 0 ? 'text-red-600' : p.stock <= p.stockMinimo ? 'text-amber-600' : ''}`}>
                            {p.stock}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">{p.unidad}</span>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{p.stockMinimo}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrency(p.precioCompra)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(p.precioVenta)}</TableCell>
                        <TableCell className="text-center">{estadoBadge(p.estado)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.ubicacion}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="p-3 border-t text-sm text-muted-foreground">
                Mostrando {filtered.length} de {mockProducts.length} productos
              </div>
            </Card>
          </TabsContent>

          {/* ── Categorías ── */}
          <TabsContent value="categorias" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((cat) => {
                const Icon = iconMap[cat.icon] || Package;
                const catProducts = mockProducts.filter(p => p.categoria === cat.id);
                return (
                  <Card key={cat.id} className="border-2 border-foreground hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${cat.color}20` }}>
                            <Icon className="h-5 w-5" style={{ color: cat.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{cat.nombre}</CardTitle>
                            <p className="text-xs text-muted-foreground">{cat.items} productos · {cat.totalStock} unidades</p>
                          </div>
                        </div>
                        {cat.alertas > 0 && (
                          <Badge variant="destructive" className="text-xs">{cat.alertas} alertas</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {catProducts.map(p => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-accent/50 cursor-pointer text-sm"
                            onClick={() => setSelectedProduct(p)}
                          >
                            <span className="truncate flex-1">{p.nombre}</span>
                            <div className="flex items-center gap-2 ml-2">
                              <span className={`font-bold ${p.stock === 0 ? 'text-red-600' : p.stock <= p.stockMinimo ? 'text-amber-600' : ''}`}>
                                {p.stock}
                              </span>
                              {estadoBadge(p.estado)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Alertas ── */}
          <TabsContent value="alertas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agotados */}
              <Card className="border-2 border-red-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" /> Productos Agotados
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {mockProducts.filter(p => p.estado === 'AGOTADO').map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                      <div>
                        <p className="font-medium text-sm">{p.nombre}</p>
                        <p className="text-xs text-muted-foreground">{p.codigo} · {p.proveedor}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                        <Truck className="h-3 w-3 mr-1" />Pedir
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stock Bajo */}
              <Card className="border-2 border-amber-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" /> Stock Bajo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {mockProducts.filter(p => p.estado === 'STOCK_BAJO').map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div>
                        <p className="font-medium text-sm">{p.nombre}</p>
                        <p className="text-xs text-muted-foreground">{p.codigo} · Stock: {p.stock}/{p.stockMinimo}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                        <Truck className="h-3 w-3 mr-1" />Reabastecer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Proveedores ── */}
          <TabsContent value="proveedores" className="space-y-4">
            {(() => {
              const proveedores = [...new Set(mockProducts.map(p => p.proveedor))];
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proveedores.map(prov => {
                    const items = mockProducts.filter(p => p.proveedor === prov);
                    const alertas = items.filter(p => p.estado !== 'DISPONIBLE').length;
                    return (
                      <Card key={prov} className="border-2 border-foreground">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Truck className="h-4 w-4" />{prov}
                            </CardTitle>
                            {alertas > 0 && <Badge variant="destructive" className="text-xs">{alertas}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{items.length} productos</p>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-1">
                          {items.map(p => (
                            <div key={p.id} className="flex items-center justify-between text-sm py-1">
                              <span className="truncate flex-1">{p.nombre}</span>
                              <span className={`font-bold ml-2 ${p.stock === 0 ? 'text-red-600' : ''}`}>{p.stock}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedProduct?.nombre}
              </DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Código</p>
                    <p className="font-mono font-bold">{selectedProduct.codigo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Estado</p>
                    {estadoBadge(selectedProduct.estado)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stock Actual</p>
                    <p className="text-2xl font-bold">{selectedProduct.stock} <span className="text-sm font-normal text-muted-foreground">{selectedProduct.unidad}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stock Mínimo</p>
                    <p className="text-2xl font-bold">{selectedProduct.stockMinimo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Precio Compra</p>
                    <p className="font-medium">{formatCurrency(selectedProduct.precioCompra)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Precio Venta</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedProduct.precioVenta)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Margen</p>
                    <p className="font-bold text-emerald-600">
                      {Math.round(((selectedProduct.precioVenta - selectedProduct.precioCompra) / selectedProduct.precioCompra) * 100)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{selectedProduct.proveedor}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedProduct.ubicacion}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm"><TrendingDown className="h-4 w-4 mr-1" />Registrar Salida</Button>
                  <Button className="flex-1" size="sm" variant="outline"><TrendingUp className="h-4 w-4 mr-1" />Registrar Entrada</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Products;
