import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Footer() {
  const location = useLocation();
  const isCosmetics = location.pathname.includes('/category/Cosmetics');

  return (
    <footer className={`pt-24 pb-12 border-t ${isCosmetics ? 'bg-rose-50 text-rose-950 border-rose-200' : 'bg-black text-white border-white/5'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <h3 className={`text-3xl font-serif tracking-tighter ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>
                Nobabi <span className={`${isCosmetics ? 'text-rose-400' : 'text-gold-500'} italic`}>{isCosmetics ? 'Cosmetics' : 'Style'}</span>
              </h3>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm font-light ${isCosmetics ? 'text-rose-900/70' : 'text-gray-400'}`}>
              Redefining luxury through a blend of heritage and modern aesthetics. Our atelier brings you the finest selections in fashion and digital craftsmanship.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className={`${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-500 hover:text-gold-500'} transition-colors`}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className={`${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-500 hover:text-gold-500'} transition-colors`}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className={`${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-500 hover:text-gold-500'} transition-colors`}>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className={`text-[10px] font-bold tracking-[0.4em] uppercase ${isCosmetics ? 'text-rose-500' : 'text-gold-500'}`}>Collections</h4>
              <ul className="space-y-4">
                <li><Link to="/category/Panjabi" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Panjabi</Link></li>
                <li><Link to="/category/T-Shirts" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>T-Shirts</Link></li>
                <li><Link to="/category/Shirts" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Shirts</Link></li>
                <li><Link to="/category/Pants" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Pants</Link></li>
                <li><Link to="/category/Shoes" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Shoes</Link></li>
                <li><Link to="/category/Accessories" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Accessories</Link></li>
                <li><Link to="/category/Cosmetics" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Cosmetics</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className={`text-[10px] font-bold tracking-[0.4em] uppercase ${isCosmetics ? 'text-rose-500' : 'text-gold-500'}`}>The House</h4>
              <ul className="space-y-4">
                <li><Link to="#" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Our Story</Link></li>
                <li><Link to="#" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Atelier Services</Link></li>
                <li><Link to="#" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Sustainability</Link></li>
                <li><Link to="#" className={`text-sm transition-colors font-light ${isCosmetics ? 'text-rose-900/70 hover:text-rose-950' : 'text-gray-400 hover:text-white'}`}>Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className={`text-[10px] font-bold tracking-[0.4em] uppercase ${isCosmetics ? 'text-rose-500' : 'text-gold-500'}`}>Newsletter</h4>
              <p className={`text-sm font-light ${isCosmetics ? 'text-rose-900/70' : 'text-gray-400'}`}>Subscribe to receive updates on new collections and exclusive events.</p>
            </div>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className={`w-full bg-transparent border-b py-4 text-xs tracking-widest focus:outline-none transition-colors uppercase ${isCosmetics ? 'border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-300' : 'border-white/20 text-white focus:border-gold-500 placeholder:text-gray-600'}`}
              />
              <button className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-colors ${isCosmetics ? 'text-rose-400 group-hover:text-rose-600' : 'text-gray-400 group-hover:text-gold-500'}`}>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="flex items-center gap-4 pt-4">
              <div className={`h-px flex-1 ${isCosmetics ? 'bg-rose-200' : 'bg-white/5'}`} />
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isCosmetics ? 'text-rose-400' : 'text-gray-600'}`}>Secure Payments</p>
              <div className={`h-px flex-1 ${isCosmetics ? 'bg-rose-200' : 'bg-white/5'}`} />
            </div>
            <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className={`text-[10px] font-bold tracking-tighter ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>BKASH</span>
              <span className={`text-[10px] font-bold tracking-tighter ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>NAGAD</span>
              <span className={`text-[10px] font-bold tracking-tighter ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>ROCKET</span>
              <span className={`text-[10px] font-bold tracking-tighter ${isCosmetics ? 'text-rose-950' : 'text-white'}`}>VISA</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-6 ${isCosmetics ? 'border-rose-200' : 'border-white/5'}`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${isCosmetics ? 'text-rose-400' : 'text-gray-600'}`}>
            &copy; {new Date().getFullYear()} Nobabi {isCosmetics ? 'Cosmetics' : 'Style Atelier'}. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-600 hover:text-white'}`}>Privacy Policy</Link>
            <Link to="#" className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-600 hover:text-white'}`}>Terms of Service</Link>
            <Link to="#" className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-600 hover:text-white'}`}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
