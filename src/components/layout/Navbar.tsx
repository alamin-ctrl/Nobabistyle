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
      <nav className="sticky top-0 z-40 w-full bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-10" />
                <span className="text-2xl font-bold tracking-tight text-white hidden sm:block font-serif">
                  Nobabi <span className="text-gold-400">Style</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium tracking-wide uppercase">Home</Link>
                <Link to="/category/Men" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium tracking-wide uppercase">Shop</Link>
                <Link to="/category/Women" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium tracking-wide uppercase">Store</Link>
                <Link to="/contact" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium tracking-wide uppercase">Contact</Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:flex relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="h-9 w-48 lg:w-64 rounded-full border border-gray-700 bg-gray-800/50 text-white pl-9 pr-4 text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-400"
                  />
                </div>

                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative text-gray-300 hover:text-gold-400 hover:bg-gray-800/50 rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-black">
                      {totalItems}
                    </span>
                  )}
                </Button>

                {isAuthenticated ? (
                  <div className="hidden sm:flex items-center gap-4">
                    <Link 
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors tracking-wide"
                    >
                      {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gold-400 hover:bg-gray-800/50 rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout} className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full px-6">Logout</Button>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="text-gray-300 hover:text-gold-400 hover:bg-gray-800/50 rounded-full px-6">Login</Button>
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-gold-400 hover:bg-gray-800/50 rounded-full">
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-gold-400 uppercase tracking-wide">Home</Link>
              <Link to="/category/Men" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-gold-400 uppercase tracking-wide">Shop</Link>
              <Link to="/category/Women" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-gold-400 uppercase tracking-wide">Store</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-gold-400 uppercase tracking-wide">Contact</Link>
              
              <div className="pt-4 pb-2 border-t border-gray-800 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gold-400 hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gold-400 hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
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
