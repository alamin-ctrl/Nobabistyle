import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle2, AlertCircle, Loader2, Shield, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<Record<string, any>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: '',
    transactionId: '',
    senderNumber: ''
  });

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('is_enabled', true);
      
      if (error) throw error;
      
      if (data) {
        const settings: Record<string, any> = {};
        data.forEach(item => {
          settings[item.id] = item;
        });
        setPaymentSettings(settings);
        
        // Set default payment method to first enabled one
        if (data.length > 0) {
          setPaymentMethod(data[0].id as PaymentMethod);
        }
      }
    } catch (err) {
      console.error('Error fetching payment settings:', err);
    }
  };

  const subtotal = totalPrice();
  const shipping = items.some(item => !item.isDigital) ? 100 : 0; // 100 TK shipping for physical items
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to place an order.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.postalCode}. Phone: ${formData.phone}`;
      
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          status: 'pending',
          payment_status: 'unpaid'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.discountPrice || item.price,
        selected_size: item.selectedSize && item.selectedSize !== 'none' ? item.selectedSize : null,
        selected_color: item.selectedColor && item.selectedColor !== 'none' ? item.selectedColor : null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-serif text-black uppercase tracking-tight mb-8">Your cart is empty</h2>
        <Button 
          onClick={() => navigate('/')}
          className="rounded-none px-14 py-7 bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-2xl text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-10"
        >
          <div className="h-24 w-24 rounded-full border-2 border-gold-500 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-gold-500" />
          </div>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-tight mb-6">Order Confirmed</h2>
        <p className="text-gray-500 font-light leading-relaxed tracking-wide mb-12 max-w-md mx-auto">
          Thank you for choosing Nobabi Style. Your order has been received and is being prepared with the utmost care in our atelier.
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="rounded-none px-14 py-7 bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
        >
          Return to Collection
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white min-h-screen py-12 lg:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black font-serif uppercase tracking-tight mb-4">Checkout</h1>
            <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-bold">Secure your selection</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500">
            <Shield className="h-4 w-4" /> 100% Secure Transaction
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7 space-y-16 sm:space-y-20">
            {!isAuthenticated && (
              <section>
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <p className="text-sm text-gray-500 font-light tracking-wide">Already have an account? <button onClick={() => navigate('/login')} className="text-black font-bold hover:text-gold-500 transition-colors">Log in</button></p>
                  <Input placeholder="EMAIL OR MOBILE PHONE" required className="rounded-none border-black/10 focus:border-gold-500" />
                </div>
              </section>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-16 sm:space-y-20">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-6 border border-red-100 flex items-center gap-4"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </motion.div>
              )}

              {items.some(item => !item.isDigital) && (
                <section>
                  <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-10">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-12">
                    <Input name="firstName" placeholder="FIRST NAME" required value={formData.firstName} onChange={handleInputChange} className="rounded-none border-black/10 focus:border-gold-500" />
                    <Input name="lastName" placeholder="LAST NAME" required value={formData.lastName} onChange={handleInputChange} className="rounded-none border-black/10 focus:border-gold-500" />
                    <Input name="address" placeholder="STREET ADDRESS" className="sm:col-span-2 rounded-none border-black/10 focus:border-gold-500" required value={formData.address} onChange={handleInputChange} />
                    <Input name="apartment" placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)" className="sm:col-span-2 rounded-none border-black/10 focus:border-gold-500" value={formData.apartment} onChange={handleInputChange} />
                    <Input name="city" placeholder="CITY / DISTRICT" required value={formData.city} onChange={handleInputChange} className="rounded-none border-black/10 focus:border-gold-500" />
                    <Input name="postalCode" placeholder="POSTAL CODE" required value={formData.postalCode} onChange={handleInputChange} className="rounded-none border-black/10 focus:border-gold-500" />
                    <Input name="phone" placeholder="PHONE NUMBER" className="sm:col-span-2 rounded-none border-black/10 focus:border-gold-500" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-10">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <label className={`group flex flex-col p-6 sm:p-8 border transition-all duration-500 cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-black/5 bg-gray-50/50 hover:border-gold-500'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 accent-gold-500" />
                      <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${paymentMethod === 'cod' ? 'text-gold-500' : 'text-gray-400'}`}>Traditional</span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.2em]">Cash on Delivery</span>
                    <p className={`text-[10px] mt-3 tracking-wide font-light ${paymentMethod === 'cod' ? 'text-gray-400' : 'text-gray-500'}`}>Pay when you receive your items</p>
                  </label>

                  {Object.entries(paymentSettings).map(([id, config]: [string, any]) => (
                    <label key={id} className={`group flex flex-col p-6 sm:p-8 border transition-all duration-500 cursor-pointer ${
                      paymentMethod === id ? 'border-black bg-black text-white' : 'border-black/5 bg-gray-50/50 hover:border-gold-500'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id as any)} className="h-4 w-4 accent-gold-500" />
                        <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${
                          paymentMethod === id ? 'text-gold-500' : 'text-gray-400'
                        }`}>Digital</span>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-[0.2em] capitalize">{id}</span>
                      <p className={`text-[10px] mt-3 tracking-wide font-light ${paymentMethod === id ? 'text-gray-400' : 'text-gray-500'}`}>
                        {config.type === 'auto' ? 'Instant Automatic Payment' : `Manual ${config.type} Transfer`}
                      </p>
                    </label>
                  ))}
                </div>

                {paymentMethod !== 'cod' && paymentSettings[paymentMethod]?.type !== 'auto' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-6 sm:p-8 bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-start gap-4 mb-8">
                      <div className="h-10 w-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 flex-shrink-0">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Please send <strong className="text-black">৳ {total}</strong> to our <span className="capitalize font-bold">{paymentMethod}</span> {paymentSettings[paymentMethod]?.type} number: <strong className="text-black">{paymentSettings[paymentMethod]?.number || '017XXXXXXXX'}</strong>.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Transaction ID</label>
                        <Input name="transactionId" placeholder="e.g. 8N7A6B5C4D" required value={formData.transactionId} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Sender Number</label>
                        <Input name="senderNumber" placeholder="e.g. 017XXXXXXXX" required value={formData.senderNumber} onChange={handleInputChange} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod !== 'cod' && paymentSettings[paymentMethod]?.type === 'auto' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-8 sm:p-10 bg-gold-50/50 border border-gold-200"
                  >
                    <p className="text-sm text-gold-800 leading-relaxed tracking-wide font-light italic">
                      You will be redirected to the <strong className="capitalize">{paymentMethod}</strong> secure payment gateway to complete your transaction automatically.
                    </p>
                  </motion.div>
                )}
              </section>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-10 border border-black/5 sticky top-32 shadow-sm">
              <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-500 uppercase mb-10">Order Summary</h2>
              
              <div className="space-y-8 mb-10 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 sm:gap-6 group">
                    <div className="h-20 w-16 sm:h-24 sm:w-20 overflow-hidden bg-gray-50 flex-shrink-0 border border-black/5">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-1 font-serif tracking-tight mb-1 uppercase">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Qty: {item.quantity}</p>
                      <div className="text-sm font-medium text-black tracking-widest">
                        ৳ {(item.discountPrice || item.price) * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t border-black/5">
                <div className="flex justify-between text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-black">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                  <span>Shipping</span>
                  <span className="text-black">{shipping === 0 ? 'Complimentary' : `৳ ${shipping}`}</span>
                </div>
                <div className="flex justify-between items-baseline pt-8 border-t border-black/5 mt-8">
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-black">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-bold text-black tracking-widest">৳ {total}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full mt-10 h-14 rounded-none bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : 'Complete Purchase'}
              </Button>

              <div className="relative flex items-center py-8">
                <div className="flex-grow border-t border-black/5"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] uppercase tracking-[0.4em] font-bold">OR</span>
                <div className="flex-grow border-t border-black/5"></div>
              </div>

              <Button 
                variant="outline"
                className="w-full h-14 rounded-none flex items-center justify-center gap-3 border-black/10 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
                onClick={() => {
                  const orderDetails = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
                  const message = `Hi, I would like to order the following items:\n${orderDetails}\n\nTotal Amount: ৳${total}`;
                  window.open(`https://wa.me/8801327263208?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </Button>
              
              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/BKash_Logo.svg/512px-BKash_Logo.svg.png" alt="bKash" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nagad_Logo.svg/512px-Nagad_Logo.svg.png" alt="Nagad" className="h-4" />
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
