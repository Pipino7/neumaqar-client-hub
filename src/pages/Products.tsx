import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Search, Plus, Package, AlertTriangle, XCircle,
  Droplets, Filter, Wrench, Cable, Cog, Zap, TrendingDown, TrendingUp,
  MapPin, Truck, Download, ChevronRight, Eye, ArrowDownUp,
  ShoppingCart, LayoutGrid, List,
} from 'lucide-react';
import { mockProducts, productCategories } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';

const iconMap: Record<string, React.ElementType> = {
  Droplets, Filter, Wrench, Cable, Cog, Zap,
};

const estadoConfig: Record<Product['estado'], { label: string; dot: string }> = {
  DISPONIBLE: { label: 'OK', dot: 'bg-emerald-500' },
  STOCK_BAJO: { label: 'Bajo', dot: 'bg-amber-500' },
  AGOTADO: { label: 'Sin stock', dot: 'bg-red-500' },
};

const StockBar = ({ stock, min }: { stock: number; min: number }) => {
  const pct = min === 0 ? 100 : Math.min((stock / (min * 3)) * 100, 100);
  const color = stock === 0 ? 'bg-red-500' : stock <= min ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(productCategories.map(c => c.id))
  );
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchSearch = !searchQuery ||
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = !selectedCategory || p.categoria === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    total: mockProducts.length,
    disponibles: mockProducts.filter(p => p.estado === 'DISPONIBLE').length,
    stockBajo: mockProducts.filter(p => p.estado === 'STOCK_BAJO').length,
    agotados: mockProducts.filter(p => p.estado === 'AGOTADO').length,
    valorTotal: mockProducts.reduce((a, p) => a + p.precioVenta * p.stock, 0),
  }), []);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filtered.forEach(p => {
      if (!groups[p.categoria]) groups[p.categoria] = [];
      groups[p.categoria].push(p);
    });
    return groups;
  }, [filtered]);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header row ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bodega & Productos</h1>
            <p className="text-sm text-muted-foreground">Inventario de repuestos, insumos y consumibles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Exportar</Button>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Nuevo Producto</Button>
          </div>
        </div>

        {/* ── Quick stats strip ── */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { label: 'Total', value: stats.total, icon: Package, accent: 'bg-primary/10' },
            { label: 'Disponibles', value: stats.disponibles, icon: TrendingUp, accent: 'bg-emerald-500/10' },
            { label: 'Stock bajo', value: stats.stockBajo, icon: AlertTriangle, accent: 'bg-amber-500/10' },
            { label: 'Agotados', value: stats.agotados, icon: XCircle, accent: 'bg-red-500/10' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card shrink-0">
              <div className={`p-1.5 rounded-md ${s.accent}`}><s.icon className="h-4 w-4" /></div>
              <div>
                <p className="text-[11px] text-muted-foreground leading-none">{s.label}</p>
                <p className="text-lg font-bold leading-tight">{s.value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card shrink-0">
            <div className="p-1.5 rounded-md bg-primary/10"><ShoppingCart className="h-4 w-4" /></div>
            <div>
              <p className="text-[11px] text-muted-foreground leading-none">Valor total</p>
              <p className="text-lg font-bold leading-tight">{formatCurrency(stats.valorTotal)}</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar: search + category chips + view toggle ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar código o nombre..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 transition-colors ${viewMode === 'compact' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                !selectedCategory ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
              }`}
            >
              Todos ({mockProducts.length})
            </button>
            {productCategories.map(cat => {
              const Icon = iconMap[cat.icon] || Package;
              const count = mockProducts.filter(p => p.categoria === cat.id).length;
              const alertas = mockProducts.filter(p => p.categoria === cat.id && p.estado !== 'DISPONIBLE').length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.nombre} ({count})
                  {alertas > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold">{alertas}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content: grouped by category ── */}
        <div className="space-y-4">
          {productCategories
            .filter(cat => !selectedCategory || cat.id === selectedCategory)
            .filter(cat => groupedByCategory[cat.id]?.length > 0)
            .map(cat => {
              const Icon = iconMap[cat.icon] || Package;
              const products = groupedByCategory[cat.id] || [];
              const isOpen = expandedCategories.has(cat.id);
              const alertCount = products.filter(p => p.estado !== 'DISPONIBLE').length;

              return (
                <Collapsible key={cat.id} open={isOpen} onOpenChange={() => toggleCategory(cat.id)}>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-foreground bg-card hover:bg-accent/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${cat.color}18` }}>
                          <Icon className="h-5 w-5" style={{ color: cat.color }} />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-sm">{cat.nombre}</span>
                          <span className="text-xs text-muted-foreground ml-2">{products.length} items</span>
                        </div>
                        {alertCount > 0 && (
                          <Badge variant="destructive" className="text-[10px] h-5">{alertCount} alerta{alertCount > 1 ? 's' : ''}</Badge>
                        )}
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {products.map(p => {
                          const cfg = estadoConfig[p.estado];
                          return (
                            <Card
                              key={p.id}
                              className={`border hover:shadow-md transition-all cursor-pointer group/card ${
                                p.estado === 'AGOTADO' ? 'border-red-200 bg-red-50/30' :
                                p.estado === 'STOCK_BAJO' ? 'border-amber-200 bg-amber-50/30' : ''
                              }`}
                              onClick={() => setSelectedProduct(p)}
                            >
                              <CardContent className="p-4 space-y-3">
                                {/* Top: code + status */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="font-mono text-[11px] text-muted-foreground">{p.codigo}</span>
                                    <h3 className="font-semibold text-sm leading-tight mt-0.5">{p.nombre}</h3>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                    <span className="text-[10px] font-medium text-muted-foreground">{cfg.label}</span>
                                  </div>
                                </div>

                                {/* Stock visual */}
                                <div>
                                  <div className="flex items-end justify-between mb-1">
                                    <span className={`text-2xl font-black leading-none ${
                                      p.stock === 0 ? 'text-red-600' : p.stock <= p.stockMinimo ? 'text-amber-600' : ''
                                    }`}>
                                      {p.stock}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">mín. {p.stockMinimo}</span>
                                  </div>
                                  <StockBar stock={p.stock} min={p.stockMinimo} />
                                </div>

                                {/* Price + location */}
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold">{formatCurrency(p.precioVenta)}</span>
                                  <span className="text-muted-foreground flex items-center gap-1 truncate ml-2">
                                    <MapPin className="h-3 w-3 shrink-0" />{p.ubicacion.split(' - ')[1] || p.ubicacion}
                                  </span>
                                </div>

                                {/* Hover actions */}
                                <div className="flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                                    <TrendingDown className="h-3 w-3 mr-1" />Salida
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />Entrada
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      /* Compact list view */
                      <div className="border rounded-lg overflow-hidden divide-y">
                        {products.map(p => {
                          const cfg = estadoConfig[p.estado];
                          return (
                            <div
                              key={p.id}
                              className="flex items-center gap-4 px-4 py-2.5 hover:bg-accent/40 cursor-pointer transition-colors"
                              onClick={() => setSelectedProduct(p)}
                            >
                              <span className="font-mono text-xs text-muted-foreground w-16 shrink-0">{p.codigo}</span>
                              <span className="font-medium text-sm flex-1 truncate">{p.nombre}</span>
                              <div className="w-24 shrink-0">
                                <StockBar stock={p.stock} min={p.stockMinimo} />
                              </div>
                              <span className={`text-sm font-bold w-10 text-right ${
                                p.stock === 0 ? 'text-red-600' : p.stock <= p.stockMinimo ? 'text-amber-600' : ''
                              }`}>{p.stock}</span>
                              <div className="flex items-center gap-1.5 w-16 shrink-0">
                                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                <span className="text-[10px]">{cfg.label}</span>
                              </div>
                              <span className="text-xs font-medium w-20 text-right shrink-0">{formatCurrency(p.precioVenta)}</span>
                              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm">Ajusta los filtros o agrega un nuevo producto</p>
          </div>
        )}

        {/* ── Detail modal ── */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedProduct?.nombre}
              </DialogTitle>
            </DialogHeader>
            {selectedProduct && (() => {
              const cfg = estadoConfig[selectedProduct.estado];
              const margin = Math.round(((selectedProduct.precioVenta - selectedProduct.precioCompra) / selectedProduct.precioCompra) * 100);
              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{selectedProduct.codigo}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <span className="text-sm font-medium">{cfg.label}</span>
                    </div>
                  </div>

                  {/* Big stock display */}
                  <div className="text-center py-4 border rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Stock Actual</p>
                    <p className={`text-5xl font-black ${
                      selectedProduct.stock === 0 ? 'text-red-600' : selectedProduct.stock <= selectedProduct.stockMinimo ? 'text-amber-600' : ''
                    }`}>{selectedProduct.stock}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedProduct.unidad} · mínimo {selectedProduct.stockMinimo}</p>
                    <div className="w-48 mx-auto mt-3">
                      <StockBar stock={selectedProduct.stock} min={selectedProduct.stockMinimo} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="border rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground">Compra</p>
                      <p className="font-bold text-sm">{formatCurrency(selectedProduct.precioCompra)}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground">Venta</p>
                      <p className="font-bold text-sm">{formatCurrency(selectedProduct.precioVenta)}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground">Margen</p>
                      <p className="font-bold text-sm text-emerald-600">{margin}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Proveedor</p>
                      <p className="font-medium flex items-center gap-1"><Truck className="h-3 w-3" />{selectedProduct.proveedor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Ubicación</p>
                      <p className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedProduct.ubicacion}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button className="flex-1"><TrendingDown className="h-4 w-4 mr-1" />Registrar Salida</Button>
                    <Button className="flex-1" variant="outline"><TrendingUp className="h-4 w-4 mr-1" />Registrar Entrada</Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Products;
