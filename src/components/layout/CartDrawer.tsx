import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-6 sm:px-8 py-6 sm:py-8">
              <h2 className="text-[10px] font-bold tracking-[0.4em] text-black uppercase flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-gold-500" />
                Your Selection
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 sm:space-y-10">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border border-black/5 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-200" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-serif text-black uppercase tracking-tight mb-3">Your atelier is empty</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Discover our latest collection</p>
                  </div>
                  <Button 
                    onClick={onClose} 
                    className="rounded-none px-10 sm:px-14 py-5 sm:py-7 bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-12">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 sm:gap-6 group">
                      <div className="h-28 w-20 sm:h-32 sm:w-24 flex-shrink-0 overflow-hidden bg-gray-50 border border-black/5">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-3 sm:gap-4">
                            <h3 className="text-xs sm:text-sm font-bold text-black font-serif tracking-tight leading-tight uppercase line-clamp-2">
                              <Link to={`/product/${item.id}`} onClick={onClose}>{item.name}</Link>
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-black tracking-widest whitespace-nowrap">৳ {(item.discountPrice || item.price) * item.quantity}</p>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold mt-2">{item.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 sm:mt-6">
                          <div className="flex items-center border border-black/10 h-8 sm:h-10">
                            <button 
                              className="px-2 sm:px-3 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-2.5 w-2.5 sm:h-3 w-3" />
                            </button>
                            <span className="w-8 sm:w-10 text-center text-[10px] sm:text-xs font-bold tracking-widest">{item.quantity}</span>
                            <button 
                              className="px-2 sm:px-3 h-full text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all"
                              onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-2.5 w-2.5 sm:h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-black/5 px-6 sm:px-8 py-8 sm:py-10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <div className="space-y-4 mb-8 sm:mb-10">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400">Subtotal</p>
                    <p className="text-xl sm:text-2xl font-bold text-black tracking-widest">৳ {totalPrice()}</p>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Complimentary shipping on all orders</p>
                </div>
                <Button 
                  className="w-full h-14 rounded-none bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase" 
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
