import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const isCosmetics = location.pathname.includes('/category/Cosmetics');

  return (
    <>
      <nav className={`sticky top-0 z-40 w-full backdrop-blur-md border-b ${isCosmetics ? 'bg-rose-50/95 border-rose-200' : 'bg-black/95 border-white/10'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <span className={`text-xl sm:text-2xl font-bold tracking-widest font-serif ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>
                  NOBABI <span className={`${isCosmetics ? 'text-rose-400' : 'text-gold-500'} font-normal italic`}>{isCosmetics ? 'COSMETICS' : 'STYLE'}</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4 sm:gap-8 ml-auto">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link to="/" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Home</Link>
                <Link to="/category/Panjabi" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Panjabi</Link>
                <Link to="/category/T-Shirts" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>T-Shirts</Link>
                <Link to="/category/Shirts" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Shirts</Link>
                <Link to="/category/Pants" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Pants</Link>
                <Link to="/category/Shoes" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Shoes</Link>
                <Link to="/category/Accessories" className={`${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Accessories</Link>
                <Link to="/category/Cosmetics" className={`${isCosmetics ? 'text-rose-500' : 'text-white hover:text-gold-500'} transition-colors text-[10px] font-bold tracking-[0.3em] uppercase`}>Cosmetics</Link>
              </div>

              <div className="flex items-center gap-1 sm:gap-4">
                <div className="hidden xl:flex relative">
                  <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isCosmetics ? 'text-rose-400' : 'text-gray-400'}`} />
                  <input
                    type="search"
                    placeholder="SEARCH..."
                    className={`h-9 w-40 xl:w-56 rounded-none border-b bg-transparent pl-10 pr-4 text-[10px] tracking-widest outline-none transition-all uppercase ${isCosmetics ? 'border-rose-200 text-rose-950 focus:border-rose-400 placeholder-rose-300' : 'border-white/20 text-white focus:border-gold-500 placeholder-gray-500'}`}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className={`relative rounded-none h-11 w-11 ${isCosmetics ? 'text-rose-900 hover:text-rose-500 hover:bg-rose-100' : 'text-white hover:text-gold-500 hover:bg-white/5'}`}>
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className={`absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${isCosmetics ? 'bg-rose-400 text-white' : 'bg-gold-500 text-black'}`}>
                        {totalItems}
                      </span>
                    )}
                  </Button>

                  {isAuthenticated ? (
                    <div className="flex items-center gap-1">
                      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                        <Button variant="ghost" size="icon" className={`rounded-none h-11 w-11 ${isCosmetics ? 'text-rose-900 hover:text-rose-500 hover:bg-rose-100' : 'text-white hover:text-gold-500 hover:bg-white/5'}`}>
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={logout} className={`hidden sm:flex text-[10px] uppercase tracking-widest font-bold h-11 px-4 ${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-400 hover:text-gold-500'}`}>Logout</Button>
                    </div>
                  ) : (
                    <Link to="/login">
                      <Button variant="ghost" size="icon" className={`rounded-none h-11 w-11 ${isCosmetics ? 'text-rose-900 hover:text-rose-500 hover:bg-rose-100' : 'text-white hover:text-gold-500 hover:bg-white/5'}`}>
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`rounded-none h-11 w-11 ${isCosmetics ? 'text-rose-900 hover:text-rose-500 hover:bg-rose-100' : 'text-white hover:text-gold-500 hover:bg-white/5'}`}>
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t animate-in slide-in-from-top duration-300 ${isCosmetics ? 'border-rose-200 bg-rose-50' : 'border-white/10 bg-black'}`}>
            <div className="space-y-1 px-4 pb-6 pt-4">
              <Link to="/" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/category/Panjabi" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Panjabi</Link>
              <Link to="/category/T-Shirts" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>T-Shirts</Link>
              <Link to="/category/Shirts" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Shirts</Link>
              <Link to="/category/Pants" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Pants</Link>
              <Link to="/category/Shoes" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Shoes</Link>
              <Link to="/category/Accessories" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-900 hover:bg-rose-100 hover:text-rose-500' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
              <Link to="/category/Cosmetics" className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-500 hover:bg-rose-100' : 'text-white hover:bg-white/5 hover:text-gold-500'}`} onClick={() => setIsMobileMenuOpen(false)}>Cosmetics</Link>
              
              <div className={`pt-4 pb-2 border-t mt-4 ${isCosmetics ? 'border-rose-200' : 'border-white/10'}`}>
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link 
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
                      className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-500 hover:bg-rose-100' : 'text-gold-500 hover:bg-white/5'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-400 hover:bg-rose-100 hover:text-rose-600' : 'text-gray-400 hover:bg-white/5 hover:text-gold-500'}`}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className={`block px-3 py-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-500 hover:bg-rose-100' : 'text-gold-500 hover:bg-white/5'}`}
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
