import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle2, AlertCircle, Loader2, Shield } from 'lucide-react';
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
        price: item.discountPrice || item.price
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
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <Button onClick={() => navigate('/')} className="w-full">
          Return to Home
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
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-2">Checkout</h1>
            <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Secure your selection</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-600">
            <Shield className="h-4 w-4" /> 100% Secure Transaction
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-7 space-y-16">
            {!isAuthenticated && (
              <section>
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Already have an account? <button onClick={() => navigate('/login')} className="text-black font-bold hover:text-gold-600 transition-colors">Log in</button></p>
                  <Input placeholder="Email or mobile phone number" required />
                </div>
              </section>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-16">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-6 border border-red-100 flex items-center gap-4"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {items.some(item => !item.isDigital) && (
                <section>
                  <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-8">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                    <Input name="firstName" placeholder="First name" required value={formData.firstName} onChange={handleInputChange} />
                    <Input name="lastName" placeholder="Last name" required value={formData.lastName} onChange={handleInputChange} />
                    <Input name="address" placeholder="Address" className="sm:col-span-2" required value={formData.address} onChange={handleInputChange} />
                    <Input name="apartment" placeholder="Apartment, suite, etc. (optional)" className="sm:col-span-2" value={formData.apartment} onChange={handleInputChange} />
                    <Input name="city" placeholder="City" required value={formData.city} onChange={handleInputChange} />
                    <Input name="postalCode" placeholder="Postal code" required value={formData.postalCode} onChange={handleInputChange} />
                    <Input name="phone" placeholder="Phone" className="sm:col-span-2" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-8">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`group flex flex-col p-6 border transition-all duration-500 cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gold-300'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 accent-gold-500" />
                      <span className={`text-[10px] font-bold tracking-widest uppercase ${paymentMethod === 'cod' ? 'text-gold-400' : 'text-gray-400'}`}>Traditional</span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Cash on Delivery</span>
                    <p className={`text-[10px] mt-2 ${paymentMethod === 'cod' ? 'text-gray-400' : 'text-gray-500'}`}>Pay when you receive your items</p>
                  </label>

                  {Object.entries(paymentSettings).map(([id, config]: [string, any]) => (
                    <label key={id} className={`group flex flex-col p-6 border transition-all duration-500 cursor-pointer ${
                      paymentMethod === id ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gold-300'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id as any)} className="h-4 w-4 accent-gold-500" />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${
                          paymentMethod === id ? 'text-gold-400' : 'text-gray-400'
                        }`}>Digital</span>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest capitalize">{id}</span>
                      <p className={`text-[10px] mt-2 ${paymentMethod === id ? 'text-gray-400' : 'text-gray-500'}`}>
                        {config.type === 'auto' ? 'Instant Automatic Payment' : `Manual ${config.type} Transfer`}
                      </p>
                    </label>
                  ))}
                </div>

                {paymentMethod !== 'cod' && paymentSettings[paymentMethod]?.type !== 'auto' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-8 bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-start gap-4 mb-8">
                      <div className="h-10 w-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 flex-shrink-0">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Please send <strong className="text-black">৳ {total}</strong> to our <span className="capitalize font-bold">{paymentMethod}</span> {paymentSettings[paymentMethod]?.type} number: <strong className="text-black">{paymentSettings[paymentMethod]?.number || '017XXXXXXXX'}</strong>.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                    className="mt-8 p-8 bg-gold-50 border border-gold-100"
                  >
                    <p className="text-sm text-gold-800 leading-relaxed italic">
                      You will be redirected to the <strong className="capitalize">{paymentMethod}</strong> secure payment gateway to complete your transaction automatically.
                    </p>
                  </motion.div>
                )}
              </section>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-10 border border-gray-100 sticky top-32">
              <h2 className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-10">Order Summary</h2>
              
              <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="h-24 w-20 overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 font-serif tracking-tight mb-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Qty: {item.quantity}</p>
                      <div className="text-sm font-bold text-gray-900 tracking-tighter">
                        ৳ {(item.discountPrice || item.price) * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <span>Shipping</span>
                  <span className="text-gray-900">{shipping === 0 ? 'Complimentary' : `৳ ${shipping}`}</span>
                </div>
                <div className="flex justify-between items-baseline pt-6 border-t border-gray-100 mt-6">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-gray-900 tracking-tighter">৳ {total}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full mt-10 h-14 rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : 'Complete Purchase'}
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
