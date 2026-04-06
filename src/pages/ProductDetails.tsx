import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { motion } from 'motion/react';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const addItem = useCartStore(state => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200 max-w-2xl mb-6">
          <h3 className="font-bold mb-2">Database Connection Error</h3>
          <p>{error}</p>
        </div>
        <div>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-200"
        >
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600 mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-medium text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{product.reviews} reviews</span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-end gap-4 mb-8">
              {product.discountPrice ? (
                <>
                  <span className="text-4xl font-extrabold text-gray-900">৳ {product.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through mb-1">৳ {product.price}</span>
                  <span className="text-sm font-medium text-red-600 mb-2">
                    Save ৳ {product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-gray-900">৳ {product.price}</span>
              )}
            </div>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <button 
                  className="px-4 h-full text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  className="px-4 h-full text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 h-12 text-base"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-gray-400" />
                <span>Delivery across BD</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-gray-400" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
