import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <h3 className="text-3xl font-serif tracking-tighter text-white">
                Nobabi <span className="text-gold-500 italic">Style</span>
              </h3>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm font-light">
              Redefining luxury through a blend of heritage and modern aesthetics. Our atelier brings you the finest selections in fashion and digital craftsmanship.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-500">Collections</h4>
              <ul className="space-y-4">
                <li><Link to="/category/Men" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Men's Atelier</Link></li>
                <li><Link to="/category/Women" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Women's Atelier</Link></li>
                <li><Link to="/category/Kids" className="text-sm text-gray-400 hover:text-white transition-colors font-light">The Petite Line</Link></li>
                <li><Link to="/category/Digital" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Digital Assets</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-500">The House</h4>
              <ul className="space-y-4">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Our Story</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Atelier Services</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Sustainability</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-500">Newsletter</h4>
              <p className="text-sm text-gray-400 font-light">Subscribe to receive updates on new collections and exclusive events.</p>
            </div>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/20 py-4 text-xs tracking-widest focus:outline-none focus:border-gold-500 transition-colors uppercase placeholder:text-gray-600"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 group-hover:text-gold-500 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-white/5" />
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Secure Payments</p>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="text-[10px] font-bold tracking-tighter">BKASH</span>
              <span className="text-[10px] font-bold tracking-tighter">NAGAD</span>
              <span className="text-[10px] font-bold tracking-tighter">ROCKET</span>
              <span className="text-[10px] font-bold tracking-tighter">VISA</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Nobabi Style Atelier. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-[10px] text-gray-600 uppercase tracking-widest font-bold hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-[10px] text-gray-600 uppercase tracking-widest font-bold hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="text-[10px] text-gray-600 uppercase tracking-widest font-bold hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
