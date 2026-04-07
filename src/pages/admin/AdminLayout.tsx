import { Outlet, Navigate, NavLink, useLocation, Link } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, CreditCard, Menu, X, BarChart3, FileText, LogOut, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

type NavItem = {
  name: string;
  path: string;
  icon: any;
};

export function AdminLayout() {
  const { user, isAuthenticated, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const navItems: NavItem[] = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Inventory', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Payments', path: '/admin/payment-config', icon: CreditCard },
  ];

  const renderNavItems = (isMobile: boolean) => {
    return navItems.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 border-l-2 ${
            isActive
              ? 'border-gold-500 text-gray-900 bg-gold-50/30'
              : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <item.icon className={`h-4 w-4 ${location.pathname === item.path ? 'text-gold-600' : ''}`} />
        {item.name}
      </NavLink>
    ));
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-50">
        <Link to="/" className="text-lg font-serif tracking-tighter">
          Nobabi <span className="italic text-gold-600">Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-white shadow-2xl flex flex-col" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 flex items-center justify-between border-b border-gray-50">
                <h2 className="text-xl font-serif tracking-tighter">Nobabi <span className="italic text-gold-600">Admin</span></h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 py-8">
                {renderNavItems(true)}
              </nav>
              <div className="p-8 border-t border-gray-50">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-10">
          <Link to="/" className="text-2xl font-serif tracking-tighter block">
            Nobabi <span className="italic text-gold-600">Admin</span>
          </Link>
          <p className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold mt-2">Management Suite</p>
        </div>
        
        <nav className="flex-1 py-4">
          {renderNavItems(false)}
        </nav>

        <div className="p-10 space-y-8">
          <div className="bg-black p-6 space-y-4">
            <div className="flex items-center gap-2 text-gold-500">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Root Access</span>
            </div>
            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
              Logged in as <br />
              <span className="text-white font-bold">{user?.email}</span>
            </p>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-colors group"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-[#FAFAFA]">
        <div className="p-8 md:p-16 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
