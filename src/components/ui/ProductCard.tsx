import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/mockData';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 block">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        {product.discountPrice && (
          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-black px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm tracking-wide uppercase">
            Sale
          </div>
        )}
        {product.isDigital && (
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 rounded-full bg-gold-500 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-black shadow-sm tracking-wide uppercase">
            Digital
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-center gap-1 text-xs sm:text-sm text-gold-500 mb-1 sm:mb-2">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1 font-serif">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">{product.category}</p>
        <div className="mt-auto flex items-center justify-between z-10">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-base sm:text-lg font-bold text-gray-900">৳ {product.discountPrice}</span>
                <span className="text-xs sm:text-sm text-gray-400 line-through">৳ {product.price}</span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-gray-900">৳ {product.price}</span>
            )}
          </div>
          <Button 
            size="sm" 
            className="rounded-full bg-black text-white hover:bg-gold-500 hover:text-black z-10 relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium shadow-sm transition-colors"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}
