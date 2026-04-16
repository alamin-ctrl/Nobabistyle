import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus, Loader2, Share2, Heart, ArrowRight, MessageCircle } from 'lucide-react';
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
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
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

  const isCosmetics = product.category === 'Cosmetics';
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
      className={isCosmetics ? 'bg-rose-50/30' : 'bg-white'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className={`group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isCosmetics ? 'text-rose-400 hover:text-rose-950' : 'text-gray-400 hover:text-black'} transition-colors`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Collection
          </button>
          <div className="flex items-center gap-4">
            <button className={`p-2 transition-colors ${isCosmetics ? 'text-rose-400 hover:text-rose-950' : 'text-gray-400 hover:text-black'}`}><Share2 className="h-4 w-4" /></button>
            <button className={`p-2 transition-colors ${isCosmetics ? 'text-rose-400 hover:text-rose-600' : 'text-gray-400 hover:text-red-500'}`}><Heart className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Product Images */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px] px-2 md:px-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 md:w-24 md:h-32 overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? (isCosmetics ? 'border-rose-400' : 'border-gold-500') : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className={`flex-1 aspect-[3/4] overflow-hidden ${isCosmetics ? 'bg-rose-50' : 'bg-gray-50'}`}
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col px-2 sm:px-0">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${isCosmetics ? 'text-rose-400' : 'text-gold-500'}`}>{product.category}</span>
                <div className={`h-[1px] w-12 ${isCosmetics ? 'bg-rose-400' : 'bg-gold-500'}`}></div>
                <div className={`flex items-center gap-1 text-[10px] ${isCosmetics ? 'text-rose-400' : 'text-gold-500'} font-bold tracking-[0.2em] uppercase`}>
                  <Star className="h-3 w-3 fill-current" />
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${isCosmetics ? 'text-rose-950' : 'text-black'} mb-6 font-serif uppercase tracking-tight leading-tight`}>{product.name}</h1>
              
              <div className="flex items-baseline gap-4 sm:gap-6 mb-10">
                {product.discountPrice ? (
                  <>
                    <span className={`text-2xl sm:text-3xl font-bold ${isCosmetics ? 'text-rose-950' : 'text-black'} tracking-widest`}>৳ {product.discountPrice}</span>
                    <span className="text-lg sm:text-xl text-gray-400 line-through tracking-widest">৳ {product.price}</span>
                    <span className={`${isCosmetics ? 'bg-rose-950' : 'bg-black'} text-white px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase`}>
                      Save ৳ {product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className={`text-2xl sm:text-3xl font-bold ${isCosmetics ? 'text-rose-950' : 'text-black'} tracking-widest`}>৳ {product.price}</span>
                )}
              </div>

              <div className="prose prose-sm text-gray-500 max-w-none mb-12">
                <p className="font-light leading-relaxed text-base sm:text-lg tracking-wide mb-6">"{product.description}"</p>
                <div className="space-y-4 text-sm tracking-wide font-light">
                  <p>• Premium quality craftsmanship</p>
                  <p>• Designed for modern elegance</p>
                  <p>• Sustainable and ethical production</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center border border-black/10 h-14 w-full sm:w-auto">
                  <button 
                    className="flex-1 sm:px-6 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all flex items-center justify-center"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-bold text-sm tracking-widest">{quantity}</span>
                  <button 
                    className="flex-1 sm:px-6 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all flex items-center justify-center"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className={`flex-1 w-full rounded-none h-14 transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase ${isCosmetics ? 'bg-rose-950 text-white hover:bg-rose-400 hover:text-white' : 'bg-black text-white hover:bg-gold-500 hover:text-black'}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Atelier'}
                </Button>
              </div>

              {/* WhatsApp Order Button */}
              <Button 
                size="lg" 
                variant="outline"
                className={`w-full rounded-none h-14 flex items-center justify-center gap-3 transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase ${isCosmetics ? 'border-rose-200 text-rose-950 hover:border-rose-950 hover:bg-rose-950 hover:text-white' : 'border-black/20 text-black hover:border-black hover:bg-black hover:text-white'}`}
                onClick={() => {
                  const message = `Hi, I would like to order ${product.name} (ID: ${product.id}). Price: ৳${product.discountPrice || product.price}. Quantity: ${quantity}.`;
                  window.open(`https://wa.me/8801327263208?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 py-10 border-y border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCosmetics ? 'bg-rose-100 text-rose-600' : 'bg-gold-50 text-gold-600'}`}>
                    <Truck className="h-5 w-5 stroke-[1.5px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1">Global Logistics</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Fast delivery across BD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCosmetics ? 'bg-rose-100 text-rose-600' : 'bg-gold-50 text-gold-600'}`}>
                    <Shield className="h-5 w-5 stroke-[1.5px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1">Secure Commerce</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">100% Protected Payments</p>
                  </div>
                </div>
              </div>

              {/* Payment Options Text */}
              <div className={`p-6 flex flex-col gap-3 border ${isCosmetics ? 'bg-rose-50/50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-sm text-gray-900 font-bold flex items-center gap-2 tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Cash on Delivery Available
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  We also accept secure mobile payments via <span className="text-pink-600 font-bold">bKash</span>, <span className="text-orange-500 font-bold">Nagad</span>, and <span className="text-purple-600 font-bold">Rocket</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
              <div>
                <h2 className={`text-4xl font-bold ${isCosmetics ? 'text-rose-950' : 'text-gray-900'} font-serif mb-2`}>Complete the Look</h2>
                <p className={`text-sm tracking-widest uppercase font-bold ${isCosmetics ? 'text-rose-400' : 'text-gray-500'}`}>Curated recommendations for you</p>
              </div>
              <Link to={`/category/${product.category}`} className={`group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isCosmetics ? 'text-rose-900 hover:text-rose-500' : 'text-gray-900 hover:text-gold-600'}`}>
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
