import { Link } from 'react-router-dom';
import { Product } from '../../data/mockData';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {product.discountPrice && (
          <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Sale
          </div>
        )}
        {product.isDigital && (
          <div className="absolute right-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Digital
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-gray-500 mb-3">{product.category}</p>
        <div className="mt-auto flex items-center justify-between z-10">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">৳ {product.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through">৳ {product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">৳ {product.price}</span>
            )}
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 z-10 relative"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
