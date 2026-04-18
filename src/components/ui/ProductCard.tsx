import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/mockData';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { motion } from 'motion/react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isCosmetics = product.category === 'Cosmetics';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col overflow-hidden bg-white transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 block">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.discountPrice && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${isCosmetics ? 'bg-rose-950' : 'bg-black'} text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase`}
            >
              Sale
            </motion.div>
          )}
          {product.isDigital && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`${isCosmetics ? 'bg-rose-400 text-white' : 'bg-gold-500 text-black'} px-3 py-1 text-[10px] font-bold tracking-widest uppercase`}
            >
              Digital
            </motion.div>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isCosmetics ? 'bg-rose-950/80' : 'bg-black/80'} backdrop-blur-sm z-10`}>
          <Button 
            className={`w-full rounded-none h-10 text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 ${isCosmetics ? 'hover:bg-white hover:text-rose-950' : 'hover:bg-white hover:text-black'} transition-colors`}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <Plus className="h-3 w-3" />
            Quick Add
          </Button>
        </div>
      </Link>
      
      <div className="flex flex-col pt-6 pb-2 text-center">
        <p className={`text-[10px] ${isCosmetics ? 'text-rose-400' : 'text-gold-500'} uppercase tracking-[0.5em] font-bold mb-3`}>{product.category}</p>
        
        <h3 className={`text-sm text-black mb-4 font-serif tracking-widest uppercase ${isCosmetics ? 'group-hover:text-rose-600' : 'group-hover:text-gold-600'} transition-colors duration-500`}>
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        <div className="flex items-center justify-center gap-4">
          {product.discountPrice ? (
            <>
              <span className="text-base font-bold text-black tracking-widest">৳ {product.discountPrice}</span>
              <span className="text-[11px] text-gray-300 line-through tracking-widest">৳ {product.price}</span>
            </>
          ) : (
            <span className="text-base font-bold text-black tracking-widest">৳ {product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
