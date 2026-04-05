import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, CreditCard, Menu, X, BarChart3, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';

type NavItem = {
  name: string;
  path: string;
  icon: any;
};

export function AdminLayout() {
  const { user, isAuthenticated } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Users & Roles', path: '/admin/users', icon: Users },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Payment Config', path: '/admin/payment-config', icon: CreditCard },
  ];

  const renderNavItems = (isMobile: boolean) => {
    return navItems.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`
        }
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </NavLink>
    ));
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1">
              {renderNavItems(true)}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="px-4 space-y-1 pb-6">
          {renderNavItems(false)}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
