import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus, Loader2, Share2, Heart, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProduct, useProducts } from '../hooks/useProducts';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ui/ProductCard';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { products: allProducts } = useProducts(product?.category);
  const addItem = useCartStore(state => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h2 className="text-3xl font-serif mb-6 text-gray-900">{error ? 'Connection Error' : 'Product Not Found'}</h2>
        <Button onClick={() => navigate('/')} className="rounded-none px-12">Return to Collection</Button>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Collection
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-black transition-colors"><Share2 className="h-4 w-4" /></button>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Heart className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Product Images */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px]">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 md:w-24 md:h-32 overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 aspect-[3/4] overflow-hidden bg-gray-50"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-bold tracking-[0.3em] text-gold-600 uppercase">{product.category}</span>
                <div className="h-[1px] w-12 bg-gold-200"></div>
                <div className="flex items-center gap-1 text-[10px] text-gold-600 font-bold">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">{product.name}</h1>
              
              <div className="flex items-baseline gap-6 mb-10">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900 tracking-tighter">৳ {product.discountPrice}</span>
                    <span className="text-xl text-gray-400 line-through tracking-tighter">৳ {product.price}</span>
                    <span className="bg-red-50 text-red-600 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                      Save ৳ {product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900 tracking-tighter">৳ {product.price}</span>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 max-w-none mb-12">
                <p className="font-light leading-relaxed text-lg italic mb-6">"{product.description}"</p>
                <div className="space-y-4 text-sm">
                  <p>• Premium quality craftsmanship</p>
                  <p>• Designed for modern elegance</p>
                  <p>• Sustainable and ethical production</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center border border-gray-200 h-14 w-full sm:w-auto">
                  <button 
                    className="px-6 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-bold text-sm tracking-widest">{quantity}</span>
                  <button 
                    className="px-6 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1 w-full rounded-none h-14"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Atelier'}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-10 border-y border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
                    <Truck className="h-5 w-5 stroke-[1.5px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1">Global Logistics</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Fast delivery across BD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
                    <Shield className="h-5 w-5 stroke-[1.5px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1">Secure Commerce</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">100% Protected Payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 font-serif mb-2">Complete the Look</h2>
                <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Curated recommendations for you</p>
              </div>
              <Link to={`/category/${product.category}`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gold-600 transition-colors">
                Explore Category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {relatedProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
