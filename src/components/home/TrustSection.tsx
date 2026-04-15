import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Phone, Clock, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Verified Buyer",
    content: "The quality of the fabric and the attention to detail in the stitching is absolutely premium. Visiting the flagship store was an experience in itself.",
    rating: 5,
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    role: "Verified Buyer",
    content: "Nobabi Style truly lives up to its name. The digital assets I purchased were delivered instantly, and the physical apparel is top-notch.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Islam",
    role: "Verified Buyer",
    content: "I've never seen such a beautifully curated collection in Lalmonirhat before. The staff is incredibly welcoming and the ambiance is luxurious.",
    rating: 5,
  }
];

export function TrustSection() {
  return (
    <section className="py-32 bg-white overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-6 block"
          >
            Authenticity & Trust
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-black mb-6 font-serif uppercase tracking-tight"
          >
            A Legacy of Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-light leading-relaxed tracking-wide"
          >
            Don't just take our word for it. Experience the luxury firsthand at our atelier or read what our esteemed clientele has to say.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Map & Contact */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-12"
          >
            {/* Contact Info Cards */}
            <div className="bg-white p-8 border border-black/5 shadow-sm space-y-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 to-gold-500"></div>
              
              <div>
                <h3 className="text-xl font-serif text-black mb-6 uppercase tracking-widest">Visit Our Atelier</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">Location</h4>
                      <p className="text-sm text-black leading-relaxed font-medium tracking-wide">
                        Janata Mor, East Station Road<br />
                        Lalmonirhat, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">Direct Line</h4>
                      <p className="text-sm text-black leading-relaxed font-medium tracking-wide">
                        +880 1327-263208
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">Opening Hours</h4>
                      <div className="text-sm text-black space-y-2 font-medium tracking-wide">
                        <p className="flex justify-between gap-8"><span>SAT - THU</span> <span>10:00 - 23:00</span></p>
                        <p className="flex justify-between gap-8"><span>FRI</span> <span>17:00 - 21:50</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.655825227743!2d89.44421111502075!3d25.91350698356821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e2c90000000001%3A0x0!2zMjXCsDU0JzQ4LjYiTiA4OcKwMjYnNDcuMCJF!5e0!3m2!1sen!2sbd!4v1650000000000!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
                title="Nobabi Style Location"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-black/5"></div>
            </div>
          </motion.div>

          {/* Right Column: Reviews */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="grid gap-8">
              {REVIEWS.map((review, index) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="bg-white p-8 md:p-10 border border-black/5 relative group hover:border-gold-500 transition-colors"
                >
                  <Quote className="absolute top-8 right-8 h-12 w-12 text-gray-100 opacity-50 group-hover:text-gold-100 group-hover:opacity-100 transition-colors" />
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-8 font-serif text-lg italic relative z-10 tracking-wide">
                    "{review.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full border border-black/5 flex items-center justify-center text-black font-serif text-xl">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black tracking-wide">{review.name}</h4>
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-500 mt-1">{review.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
