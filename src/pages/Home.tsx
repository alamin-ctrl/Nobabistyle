import React from 'react';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Truck, ShieldCheck, Zap, Loader2, MapPin, Clock, Store } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'motion/react';

export function Home() {
  const { category } = useParams<{ category: string }>();
  const { products: displayedProducts, loading, error } = useProducts(category);

  const featuredProducts = displayedProducts.slice(0, 4);
  const digitalProducts = displayedProducts.filter(p => p.isDigital).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {!category && (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
              alt="Fashion Background" 
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 text-center flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs sm:text-sm md:text-base font-semibold tracking-widest text-gold-400 uppercase mb-3 sm:mb-4 font-serif"
            >
              Premium Collection 2026
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-4 sm:mb-6 max-w-4xl leading-tight drop-shadow-lg font-serif"
            >
              Elevate Your Style with <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">Nobabi</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl drop-shadow-md font-medium px-2 sm:px-0"
            >
              Shop the latest fashion trends and premium digital products. Fast delivery across Bangladesh with secure mobile banking payments.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto justify-center"
            >
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-gold-500/20 transition-all duration-300 bg-gold-500 text-black hover:bg-gold-400 border-none">
                Shop Collection
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold bg-black/50 text-gold-400 border-gold-500/50 hover:bg-gold-500 hover:text-black backdrop-blur-md transition-all duration-300">
                Explore Digital
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      {!category && (
        <section className="py-12 bg-black border-b border-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gold-500/30 transition-colors"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white font-serif tracking-wide text-sm sm:text-base">Nationwide Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Fast shipping across BD</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gold-500/30 transition-colors"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white font-serif tracking-wide text-sm sm:text-base">Secure Payments</h3>
                  <p className="text-xs sm:text-sm text-gray-400">bKash, Nagad, Rocket</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gold-500/30 transition-colors"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white font-serif tracking-wide text-sm sm:text-base">Instant Download</h3>
                  <p className="text-xs sm:text-sm text-gray-400">For digital products</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
              {category ? `${category} Products` : 'Featured Products'}
            </h2>
            {!category && (
              <Link to="/category/all" className="text-gold-600 font-medium hover:text-gold-500 flex items-center gap-1 uppercase tracking-wider text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
          
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200 max-w-2xl">
                <h3 className="font-bold mb-2">Database Connection Error</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Digital Products */}
      {!category && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Digital Assets</h2>
              <Link to="/category/Digital" className="text-gold-600 font-medium hover:text-gold-500 flex items-center gap-1 uppercase tracking-wider text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            {error ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Could not load digital products.</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
              </div>
            ) : digitalProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No digital products found.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
              >
                {digitalProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Offline Store Section */}
      {!category && (
        <section className="py-16 sm:py-24 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Visit Our Offline Store</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">Experience our products in person. Drop by our physical store for an exclusive shopping experience.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 sm:h-72 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                    alt="Nobabi Style Store" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r"></div>
                  <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Store className="h-6 w-6 sm:h-8 sm:w-8 text-gold-400" />
                      <h3 className="text-2xl sm:text-3xl font-bold font-serif">Nobabi Style</h3>
                    </div>
                    <p className="text-gold-300 font-medium tracking-wide uppercase text-xs sm:text-sm">Flagship Outlet</p>
                  </div>
                </div>
                
                <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 font-serif">Store Information</h3>
                  
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0 mt-1">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Location</h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Janata Mor, East Station Road,<br />Lalmonirhat</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0 mt-1">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Opening Hours</h4>
                        <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                          <p className="flex justify-between gap-4 sm:gap-8">
                            <span className="font-medium">SAT - THU:</span> 
                            <span>10:00 AM - 11:00 PM</span>
                          </p>
                          <p className="flex justify-between gap-4 sm:gap-8">
                            <span className="font-medium">FRI:</span> 
                            <span>05:00 PM - 09:50 PM</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full rounded-full py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-gold-500/25 transition-all duration-300 bg-black text-white hover:bg-gray-900"
                    onClick={() => window.open('https://maps.google.com/?q=Janata+Mor,+East+Station+Road,+Lalmonirhat', '_blank')}
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
