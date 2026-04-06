import { Link } from 'react-router-dom';
import { Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-900">
      <div className="container mx-auto px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 font-serif">
              Nobabi <span className="text-gold-400">Style</span>
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your one-stop destination for physical and digital products in Bangladesh. Quality products, fast delivery.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/nobabistyle" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-black transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/category/Men" className="hover:text-gold-400 transition-colors">Men's Fashion</Link></li>
              <li><Link to="/category/Women" className="hover:text-gold-400 transition-colors">Women's Fashion</Link></li>
              <li><Link to="/category/Kids" className="hover:text-gold-400 transition-colors">Kids Collection</Link></li>
              <li><Link to="/category/Digital" className="hover:text-gold-400 transition-colors">Digital Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-gold-400 transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-gold-400 transition-colors">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Payment Methods</h4>
            <div className="flex gap-3 mb-4">
              <div className="h-10 w-14 bg-gray-900 rounded-md flex items-center justify-center text-xs font-bold text-pink-500 border border-gray-800">bKash</div>
              <div className="h-10 w-14 bg-gray-900 rounded-md flex items-center justify-center text-xs font-bold text-orange-500 border border-gray-800">Nagad</div>
              <div className="h-10 w-14 bg-gray-900 rounded-md flex items-center justify-center text-xs font-bold text-purple-500 border border-gray-800">Rocket</div>
            </div>
            <p className="text-xs text-gray-500">Cash on Delivery also available.</p>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-16 pt-8 text-sm text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Nobabi Style. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
