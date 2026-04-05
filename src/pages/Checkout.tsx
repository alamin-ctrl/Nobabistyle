import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {!isAuthenticated && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
                <p className="text-sm text-gray-500 mb-4">Already have an account? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Log in</button></p>
                <div className="space-y-4">
                  <Input placeholder="Email or mobile phone number" required />
                </div>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              {items.some(item => !item.isDigital) && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="firstName" placeholder="First name" required value={formData.firstName} onChange={handleInputChange} />
                    <Input name="lastName" placeholder="Last name" required value={formData.lastName} onChange={handleInputChange} />
                    <Input name="address" placeholder="Address" className="col-span-2" required value={formData.address} onChange={handleInputChange} />
                    <Input name="apartment" placeholder="Apartment, suite, etc. (optional)" className="col-span-2" value={formData.apartment} onChange={handleInputChange} />
                    <Input name="city" placeholder="City" required value={formData.city} onChange={handleInputChange} />
                    <Input name="postalCode" placeholder="Postal code" required value={formData.postalCode} onChange={handleInputChange} />
                    <Input name="phone" placeholder="Phone" className="col-span-2" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-blue-600" />
                    <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                  </label>

                  {Object.entries(paymentSettings).map(([id, config]: [string, any]) => (
                    <label key={id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === id 
                        ? id === 'bkash' ? 'border-pink-600 bg-pink-50' 
                        : id === 'nagad' ? 'border-orange-600 bg-orange-50'
                        : id === 'rocket' ? 'border-purple-600 bg-purple-50'
                        : 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id as any)} className="h-4 w-4" />
                      <div className="ml-3">
                        <span className={`font-medium capitalize ${
                          id === 'bkash' ? 'text-pink-700' 
                          : id === 'nagad' ? 'text-orange-700'
                          : id === 'rocket' ? 'text-purple-700'
                          : 'text-blue-700'
                        }`}>{id}</span>
                        {config.type !== 'auto' && (
                          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                            {config.type}
                          </span>
                        )}
                        {config.type === 'auto' && (
                          <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                            Auto Payment
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod !== 'cod' && paymentSettings[paymentMethod]?.type !== 'auto' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-4">
                      Please send <strong>৳ {total}</strong> to our {paymentMethod} {paymentSettings[paymentMethod]?.type} number: <strong>{paymentSettings[paymentMethod]?.number || '017XXXXXXXX'}</strong>.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                        <Input name="transactionId" placeholder="e.g. 8N7A6B5C4D" required value={formData.transactionId} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sender Number</label>
                        <Input name="senderNumber" placeholder="e.g. 017XXXXXXXX" required value={formData.senderNumber} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'cod' && paymentSettings[paymentMethod]?.type === 'auto' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">
                      You will be redirected to the <strong>{paymentMethod}</strong> secure payment gateway to complete your transaction automatically.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ৳ {(item.discountPrice || item.price) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `৳ ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>৳ {total}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full mt-6 h-12 text-lg flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
