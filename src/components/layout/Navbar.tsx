import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const { isAuthenticated, user, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <img src="/logo.png" alt="Logo" className="h-10 transition-transform duration-500 group-hover:scale-110" />
                <span className="text-2xl font-bold tracking-tighter text-black hidden sm:block font-serif">
                  NOBABI <span className="text-gold-500 font-normal">STYLE</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-8 ml-auto">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-10">
                <Link to="/" className="text-gray-900 hover:text-gold-600 transition-colors text-xs font-semibold tracking-[0.2em] uppercase">Home</Link>
                <Link to="/category/Men" className="text-gray-900 hover:text-gold-600 transition-colors text-xs font-semibold tracking-[0.2em] uppercase">Men</Link>
                <Link to="/category/Women" className="text-gray-900 hover:text-gold-600 transition-colors text-xs font-semibold tracking-[0.2em] uppercase">Women</Link>
                <Link to="/category/Digital" className="text-gray-900 hover:text-gold-600 transition-colors text-xs font-semibold tracking-[0.2em] uppercase">Digital</Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden xl:flex relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="h-9 w-40 xl:w-56 rounded-full border border-gray-200 bg-gray-50 text-gray-900 pl-10 pr-4 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative text-gray-900 hover:text-gold-600 hover:bg-gold-50 rounded-full">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                        {totalItems}
                      </span>
                    )}
                  </Button>

                  {isAuthenticated ? (
                    <div className="flex items-center gap-1">
                      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                        <Button variant="ghost" size="icon" className="text-gray-900 hover:text-gold-600 hover:bg-gold-50 rounded-full">
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:flex text-gray-500 hover:text-red-600 text-[10px] uppercase tracking-widest font-bold">Logout</Button>
                    </div>
                  ) : (
                    <Link to="/login">
                      <Button variant="ghost" size="icon" className="text-gray-900 hover:text-gold-600 hover:bg-gold-50 rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900 hover:text-gold-600 hover:bg-gold-50 rounded-full">
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-300">
            <div className="space-y-1 px-4 pb-6 pt-4">
              <Link to="/" className="block px-3 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gold-50 hover:text-gold-600 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/category/Men" className="block px-3 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gold-50 hover:text-gold-600 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
              <Link to="/category/Women" className="block px-3 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gold-50 hover:text-gold-600 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
              <Link to="/category/Digital" className="block px-3 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gold-50 hover:text-gold-600 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Digital</Link>
              
              <div className="pt-4 pb-2 border-t border-gray-100 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link 
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
                      className="block px-3 py-3 rounded-lg text-sm font-bold text-gold-600 hover:bg-gold-50 uppercase tracking-widest"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left block px-3 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-3 py-3 rounded-lg text-sm font-bold text-gold-600 hover:bg-gold-50 uppercase tracking-widest"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
