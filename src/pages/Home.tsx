import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Truck, ShieldCheck, Zap, Loader2, MapPin, Clock, Store } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { TrustSection } from '../components/home/TrustSection';

export function Home() {
  const { category } = useParams<{ category: string }>();
  const { products: displayedProducts, loading, error } = useProducts(category);
  const [outletImages, setOutletImages] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchOutletImages = async () => {
      try {
        const { data, error } = await supabase
          .from('outlet_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setOutletImages(data);
        }
      } catch (err) {
        console.error('Error fetching outlet images:', err);
      }
    };

    fetchOutletImages();
  }, []);

  const featuredProducts = displayedProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {!category && (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2000" 
              alt="Premium Fashion Background" 
              className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
          </div>

          <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32 text-center flex flex-col items-center mt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.5em] text-gold-500 uppercase mb-6 sm:mb-10 font-sans">
                ESTABLISHED 2024 • LALMONIRHAT
              </span>
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold text-white tracking-tighter mb-8 sm:mb-10 leading-[1.1] sm:leading-[0.9] font-serif uppercase">
                The Art of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 italic lowercase">modern nobility</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-10 sm:mb-14 max-w-xl mx-auto font-light tracking-widest leading-loose px-4">
                Discover a curated collection of premium fashion and exclusive digital assets. 
                Crafted for those who appreciate the finer details in life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center px-6 sm:px-0">
                <Button size="lg" className="rounded-none w-full sm:px-14 h-14 sm:h-20 bg-gold-500 text-black hover:bg-white hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase">
                  Shop Collection
                </Button>
                <Button size="lg" variant="outline" className="rounded-none w-full sm:px-14 h-14 sm:h-20 bg-transparent text-white border-white/30 hover:border-gold-500 hover:text-gold-500 transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase">
                  Our Story
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[9px] text-gold-500 uppercase tracking-[0.4em] font-bold">Scroll</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500 to-transparent"></div>
          </motion.div>
        </section>
      )}

      {/* Features - More Minimal */}
      {!category && (
        <section className="py-20 bg-black border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center text-gold-500 mb-6 group-hover:border-gold-500 transition-all duration-500">
                  <Truck className="h-6 w-6 stroke-[1px]" />
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-3">Global Logistics</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] font-light">Seamless delivery to your doorstep, wherever you are in Bangladesh.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center text-gold-500 mb-6 group-hover:border-gold-500 transition-all duration-500">
                  <ShieldCheck className="h-6 w-6 stroke-[1px]" />
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-3">Secure Commerce</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] font-light">Your transactions are protected by industry-leading security protocols.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center text-gold-500 mb-6 group-hover:border-gold-500 transition-all duration-500">
                  <Zap className="h-6 w-6 stroke-[1px]" />
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-3">Digital Excellence</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] font-light">Instant access to premium digital assets with every purchase.</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className={`py-24 sm:py-40 ${category === 'Cosmetics' ? 'bg-rose-50' : 'bg-white'}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 sm:mb-24 gap-8"
          >
            <div className="space-y-4">
              <span className={`${category === 'Cosmetics' ? 'text-rose-400' : 'text-gold-500'} text-[10px] tracking-[0.6em] uppercase font-bold block`}>Curated Selection</span>
              <h2 className={`text-4xl sm:text-5xl md:text-7xl font-bold ${category === 'Cosmetics' ? 'text-rose-950' : 'text-black'} font-serif uppercase tracking-tight leading-none`}>
                {category ? `${category} Collection` : 'New Arrivals'}
              </h2>
            </div>
            {!category && (
              <Link to="/category/all" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:text-gold-500 transition-all duration-500 pb-2 border-b border-black/5 hover:border-gold-500">
                Explore All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            )}
          </motion.div>
          
          {error ? (
            <div className={`text-center py-32 ${category === 'Cosmetics' ? 'bg-rose-100/50 border-rose-200' : 'bg-gray-50 border-black/5'} border`}>
              <p className={`${category === 'Cosmetics' ? 'text-rose-400' : 'text-gray-400'} text-[10px] tracking-[0.3em] uppercase font-bold`}>Unable to connect to the collection.</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className={`h-12 w-12 animate-spin ${category === 'Cosmetics' ? 'text-rose-400' : 'text-gold-500'}`} />
            </div>
          ) : category === 'Cosmetics' ? (
            <div className="flex flex-col items-center justify-center py-32 sm:py-40 border border-rose-200/50 bg-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center space-y-6"
              >
                <h3 className="text-4xl sm:text-5xl md:text-7xl font-serif text-rose-950 uppercase tracking-widest">Launching Soon</h3>
                <p className="text-rose-400 text-xs sm:text-sm tracking-[0.4em] uppercase font-bold">Something beautiful is coming your way</p>
              </motion.div>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className={`text-center py-32 border ${category === 'Cosmetics' ? 'border-rose-200' : 'border-black/5'}`}>
              <p className={`${category === 'Cosmetics' ? 'text-rose-400' : 'text-gray-400'} text-[10px] tracking-[0.3em] uppercase font-bold italic`}>Our collection is currently being updated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {!category && ['Panjabi', 'T-Shirts', 'Shirts', 'Pants', 'Shoes', 'Accessories'].map((cat, idx) => {
        const catProducts = displayedProducts.filter(p => p.category === cat).slice(0, 4);
        if (catProducts.length === 0) return null;
        const isEven = idx % 2 === 0;
        return (
          <section key={cat} className={`py-24 sm:py-40 ${isEven ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 sm:mb-24 gap-8"
              >
                <div className="space-y-4">
                  <span className="text-gold-500 text-[10px] tracking-[0.6em] uppercase font-bold block">{cat} Collection</span>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black font-serif uppercase tracking-tight leading-none">{cat}</h2>
                </div>
                <Link to={`/category/${cat}`} className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:text-gold-500 transition-all duration-500 pb-2 border-b border-black/5 hover:border-gold-500">
                  View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>

              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
                  {catProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Our Outlets Section */}
      {!category && (
        <section className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 sm:mb-24"
            >
              <span className="text-gold-500 text-[10px] tracking-[0.6em] uppercase font-bold block mb-4">Discover</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black font-serif uppercase tracking-tight">Our Outlets</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Nobabi Style Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative bg-white overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200" 
                    alt="Nobabi Style" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 sm:p-12 text-center border border-t-0 border-black/5">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-widest mb-4">Nobabi Style</h3>
                  <p className="text-gray-500 font-light leading-relaxed mb-8">
                    Men's fashion destination featuring premium clothing, shoes, and curated accessories.
                  </p>
                  <Link to="/">
                    <Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white transition-colors duration-300 text-[10px] font-bold tracking-[0.3em] uppercase px-8 py-6">
                      Explore
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Nobabi Cosmetics Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group relative bg-rose-50/50 overflow-hidden border border-rose-100"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=1200" 
                    alt="Nobabi Cosmetics" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 sm:p-12 text-center border-t border-rose-100">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-widest mb-4 text-rose-950">Nobabi Cosmetics</h3>
                  <p className="text-rose-900/70 font-light leading-relaxed mb-8">
                    Exclusive beauty and cosmetic products curated for elegance and sophistication.
                  </p>
                  <Link to="/category/Cosmetics">
                    <Button variant="outline" className="rounded-none border-rose-200 text-rose-900 hover:bg-rose-100 hover:text-rose-950 transition-colors duration-300 text-[10px] font-bold tracking-[0.3em] uppercase px-8 py-6">
                      Explore
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Nobabi Cosmetics Section */}
      {!category && (
        <section className="py-24 sm:py-40 bg-rose-50">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 sm:mb-24 gap-8"
            >
              <div className="space-y-4">
                <span className="text-rose-400 text-[10px] tracking-[0.6em] uppercase font-bold block">Beauty & Elegance</span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-rose-950 font-serif uppercase tracking-tight leading-none">Nobabi Cosmetics</h2>
              </div>
              <Link to="/category/Cosmetics" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-rose-950 hover:text-rose-500 transition-all duration-500 pb-2 border-b border-rose-950/10 hover:border-rose-500">
                View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-32">
                <Loader2 className="h-12 w-12 animate-spin text-rose-400" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 sm:py-40 border border-rose-200/50 bg-white/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 text-center space-y-6"
                >
                  <h3 className="text-4xl sm:text-5xl md:text-7xl font-serif text-rose-950 uppercase tracking-widest">Launching Soon</h3>
                  <p className="text-rose-400 text-xs sm:text-sm tracking-[0.4em] uppercase font-bold">Something beautiful is coming your way</p>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Offline Store Section - High End Editorial Look */}
      {!category && (
        <section className="py-24 sm:py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-16 sm:gap-20">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full lg:w-1/2 relative"
              >
                {outletImages.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] overflow-hidden">
                      <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={outletImages[activeImage].url} 
                        alt="Nobabi Style Store" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>
                    {outletImages.length > 1 && (
                      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {outletImages.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImage(idx)}
                            className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={img.url} alt="Store thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                      alt="Nobabi Style Store" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                )}
                <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-48 h-48 sm:w-64 sm:h-64 bg-gold-50 -z-10"></div>
                <div className="absolute top-6 -left-6 sm:top-10 sm:-left-10 w-24 h-24 sm:w-32 sm:h-32 border-l border-t border-gold-400 -z-10"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full lg:w-1/2"
              >
                <span className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-6 block">The Experience</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-8 font-serif uppercase tracking-tight leading-tight">Visit Our <br />Flagship Atelier</h2>
                <p className="text-gray-500 mb-10 sm:mb-12 font-light leading-relaxed text-base sm:text-lg tracking-wide">
                  "Fashion is not just about what you wear, it's about how you experience it. 
                  Our physical store is designed to be a sanctuary of style and elegance."
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 mb-10 sm:mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gold-500">
                      <MapPin className="h-4 w-4" />
                      <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-black">Location</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed tracking-wide">
                      Janata Mor, East Station Road,<br />
                      Lalmonirhat, Bangladesh
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gold-500">
                      <Clock className="h-4 w-4" />
                      <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-black">Hours</h4>
                    </div>
                    <div className="text-sm text-gray-500 space-y-2 tracking-wide">
                      <p className="flex justify-between"><span>SAT - THU</span> <span>10:00 - 23:00</span></p>
                      <p className="flex justify-between"><span>FRI</span> <span>17:00 - 21:50</span></p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="rounded-none w-full sm:w-auto px-14 h-14 sm:h-20 bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase group flex items-center justify-center gap-3"
                  onClick={() => window.open('https://maps.google.com/?q=Janata+Mor,+East+Station+Road,+Lalmonirhat', '_blank')}
                >
                  Visit Store
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Authenticity Section */}
      {!category && <TrustSection />}
    </div>
  );
}
