import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WhatsAppButton() {
  const phoneNumber = "+8801327263208"; 
  const message = "I want to order from Nobabi Style";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-4 group"
    >
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-premium border border-gray-100 opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
        <p className="text-[10px] font-bold tracking-widest text-gray-900 uppercase whitespace-nowrap">Concierge Service</p>
      </div>
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all duration-500 hover:bg-gold-600 hover:-translate-y-1 group-active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 rounded-full bg-gold-500 animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
        <MessageCircle className="h-6 w-6 relative z-10" />
      </a>
    </motion.div>
  );
}
