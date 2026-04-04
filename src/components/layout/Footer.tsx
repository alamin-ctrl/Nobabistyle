import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              BD<span className="text-blue-500">Mart</span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop destination for physical and digital products in Bangladesh. Quality products, fast delivery.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/Men" className="hover:text-white transition-colors">Men's Fashion</Link></li>
              <li><Link to="/category/Women" className="hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/category/Kids" className="hover:text-white transition-colors">Kids Collection</Link></li>
              <li><Link to="/category/Digital" className="hover:text-white transition-colors">Digital Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
            <div className="flex gap-2 mb-4">
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-pink-600">bKash</div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-orange-600">Nagad</div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-purple-600">Rocket</div>
            </div>
            <p className="text-xs text-gray-400">Cash on Delivery also available.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} BDMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
