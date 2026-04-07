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
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
              alt="Fashion Background" 
              className="w-full h-full object-cover scale-105 animate-slow-zoom"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.4em] text-gold-400 uppercase mb-6 sm:mb-8 font-sans">
                ESTABLISHED 2026 • DHAKA
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9] font-serif italic">
                The Art of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">Modern Nobility</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-12 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
                Discover a curated collection of premium fashion and exclusive digital assets. 
                Crafted for those who appreciate the finer details in life.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
                <Button size="lg" className="rounded-none px-12 bg-white text-black hover:bg-gold-500 hover:text-white transition-all duration-500">
                  Shop Collection
                </Button>
                <Button size="lg" variant="outline" className="rounded-none px-12 bg-transparent text-white border-white/30 hover:border-gold-400 hover:text-gold-400 transition-all duration-500">
                  Our Story
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400 to-transparent"></div>
          </motion.div>
        </section>
      )}

      {/* Features - More Minimal */}
      {!category && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 mb-6 group-hover:border-gold-500 group-hover:text-gold-600 transition-all duration-500">
                  <Truck className="h-6 w-6 stroke-[1.5px]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-3">Global Logistics</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Seamless delivery to your doorstep, wherever you are in Bangladesh.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 mb-6 group-hover:border-gold-500 group-hover:text-gold-600 transition-all duration-500">
                  <ShieldCheck className="h-6 w-6 stroke-[1.5px]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-3">Secure Commerce</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Your transactions are protected by industry-leading security protocols.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 mb-6 group-hover:border-gold-500 group-hover:text-gold-600 transition-all duration-500">
                  <Zap className="h-6 w-6 stroke-[1.5px]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-3">Digital Excellence</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Instant access to premium digital assets with every purchase.</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-2">
                {category ? `${category} Collection` : 'The New Arrivals'}
              </h2>
              <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Curated for the modern individual</p>
            </div>
            {!category && (
              <Link to="/category/all" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gold-600 transition-colors">
                Explore All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
          
          {error ? (
            <div className="text-center py-24 bg-red-50/50 rounded-3xl border border-red-100">
              <p className="text-red-600 font-medium">Unable to connect to the collection. Please try again later.</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-400 italic">Our collection is currently being updated. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Digital Products - Minimalist Grid */}
      {!category && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-2">Digital Atelier</h2>
                <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Exclusive assets for the digital era</p>
              </div>
              <Link to="/category/Digital" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gold-600 transition-colors">
                View Gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {digitalProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Offline Store Section - High End Editorial Look */}
      {!category && (
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:w-1/2 relative"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                    alt="Nobabi Style Store" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold-50 -z-10"></div>
                <div className="absolute top-10 -left-10 w-32 h-32 border-l border-t border-gold-400 -z-10"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:w-1/2"
              >
                <span className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-6 block">The Experience</span>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight">Visit Our <br />Flagship Atelier</h2>
                <p className="text-gray-600 mb-12 font-light leading-relaxed text-lg italic">
                  "Fashion is not just about what you wear, it's about how you experience it. 
                  Our physical store is designed to be a sanctuary of style and elegance."
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gold-600">
                      <MapPin className="h-4 w-4" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase">Location</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Janata Mor, East Station Road,<br />
                      Lalmonirhat, Bangladesh
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gold-600">
                      <Clock className="h-4 w-4" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase">Hours</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex justify-between"><span>SAT - THU</span> <span>10:00 - 23:00</span></p>
                      <p className="flex justify-between"><span>FRI</span> <span>17:00 - 21:50</span></p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="rounded-none w-full sm:w-auto px-12"
                  onClick={() => window.open('https://maps.google.com/?q=Janata+Mor,+East+Station+Road,+Lalmonirhat', '_blank')}
                >
                  Get Directions
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
