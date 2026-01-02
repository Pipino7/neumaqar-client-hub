import { ReactNode } from 'react';
import { 
  Truck, 
  Users, 
  FileText, 
  Settings, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clientes', href: '/customers', active: true },
  { icon: Truck, label: 'Maquinaria', href: '/machinery' },
  { icon: FileText, label: 'Arriendos', href: '/rentals' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={`
          ${collapsed ? 'w-16' : 'w-64'} 
          border-r-2 border-foreground bg-card 
          flex flex-col transition-all duration-300
        `}
      >
        {/* Logo */}
        <div className="h-16 border-b-2 border-foreground flex items-center justify-center px-4">
          {!collapsed && (
            <h1 className="font-bold text-xl tracking-tight">NEUMAQAR</h1>
          )}
          {collapsed && (
            <span className="font-bold text-xl">N</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 
                border-b border-border/50
                hover:bg-accent transition-colors
                ${item.active ? 'bg-primary text-primary-foreground' : ''}
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t-2 border-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b-2 border-foreground bg-card px-6 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Gestión de Clientes</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin</span>
            <div className="w-8 h-8 border-2 border-foreground bg-accent flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
