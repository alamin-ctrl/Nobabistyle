import { useUserStore } from '../store/useUserStore';
import { Navigate, Link } from 'react-router-dom';
import { Package, Download, Settings, User, Save, Loader2, ChevronDown, ChevronUp, ShoppingBag, LogOut, CreditCard, Heart, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export function UserDashboard() {
  const { user, isAuthenticated, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'downloads'>('orders');
  const [fullName, setFullName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user]);

  const fetchOrders = async (userId: string) => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setOrdersError(error.message || 'Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.id && activeTab === 'orders') {
      fetchOrders(user.id);
    }
  }, [user?.id, activeTab]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) return;

    try {
      setLoadingItems(prev => ({ ...prev, [orderId]: true }));
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            images,
            isDigital
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(prev => ({ ...prev, [orderId]: data || [] }));
    } catch (error) {
      console.error('Error fetching order items:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      fetchOrderItems(orderId);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative h-[40vh] bg-black overflow-hidden flex items-center">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            alt="Dashboard Background" 
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold-400 uppercase">Personal Atelier</span>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-white leading-none">
              Welcome, <span className="italic text-gold-500">{fullName.split(' ')[0]}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl -mt-20 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="bg-white p-8 border border-gray-100 shadow-premium space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-serif text-3xl border border-gold-100">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-gray-900 uppercase">{fullName}</p>
                  <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'downloads', label: 'Digital Vault', icon: Download },
                  { id: 'settings', label: 'Atelier Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 w-full px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-gold-600 bg-gold-50/50' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="pt-8 border-t border-gray-50">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-colors group"
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-black p-8 text-white space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-500">Concierge</h4>
              <p className="text-xs font-light text-gray-400 leading-relaxed">
                Need assistance with your selection? Our atelier experts are available to guide you.
              </p>
              <Button variant="outline" className="w-full border-white/20 hover:bg-white hover:text-black transition-all text-[10px] h-12 rounded-none">
                Contact Expert
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                    <div>
                      <h2 className="text-3xl font-serif tracking-tight text-gray-900">Recent Selections</h2>
                      <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold mt-2">Your curated history</p>
                    </div>
                    <button 
                      onClick={() => user?.id && fetchOrders(user.id)}
                      className="text-[10px] font-bold tracking-widest text-gold-600 uppercase hover:text-gold-700 transition-colors flex items-center gap-2"
                    >
                      <Loader2 className={`h-3 w-3 ${loadingOrders ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                        <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Accessing Archive...</p>
                      </div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-white border border-gray-100 transition-all duration-500 hover:shadow-premium group"
                        >
                          <div 
                            className="p-8 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            <div className="flex items-center gap-8">
                              <div className="h-16 w-16 bg-gray-50 flex items-center justify-center text-gray-300">
                                <Package className="h-8 w-8 stroke-[1px]" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Ref.</span>
                                  <span className="text-sm font-bold text-gray-900 tracking-tighter">#{order.id.split('-')[0].toUpperCase()}</span>
                                </div>
                                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                              <div className="text-right">
                                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold mb-1">Total</p>
                                <p className="text-lg font-bold text-gray-900 tracking-tighter">৳ {order.total_amount}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold mb-1">Status</p>
                                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${
                                  order.status === 'delivered' ? 'text-green-600 border-green-100 bg-green-50/30' : 'text-gold-600 border-gold-100 bg-gold-50/30'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className={`p-2 transition-transform duration-500 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedOrderId === order.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-gray-50 overflow-hidden"
                              >
                                <div className="p-8 lg:p-12 space-y-12 bg-gray-50/30">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                      <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 border-b border-gray-100 pb-4">Selected Pieces</h4>
                                      {loadingItems[order.id] ? (
                                        <div className="flex justify-center py-12">
                                          <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {orderItems[order.id]?.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-6 group/item">
                                              <div className="h-20 w-16 bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                                                <img 
                                                  src={item.products?.images?.[0]} 
                                                  alt={item.products?.name}
                                                  className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                                />
                                              </div>
                                              <div className="flex-1 space-y-1">
                                                <p className="text-sm font-bold text-gray-900 tracking-tight">{item.products?.name}</p>
                                                <div className="flex items-center gap-3">
                                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                                                  <span className="text-gray-200">|</span>
                                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">৳ {item.price}</p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900 tracking-tighter">৳ {item.quantity * item.price}</p>
                                                {item.products?.isDigital && (
                                                  <Link 
                                                    to="/dashboard" 
                                                    onClick={() => setActiveTab('downloads')}
                                                    className="text-[9px] text-gold-600 font-bold uppercase tracking-widest flex items-center gap-1 justify-end hover:text-gold-700 mt-1"
                                                  >
                                                    Download <ExternalLink className="h-2 w-2" />
                                                  </Link>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="space-y-12">
                                      <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 border-b border-gray-100 pb-4">Logistics & Payment</h4>
                                        <div className="space-y-6">
                                          <div className="space-y-2">
                                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Delivery Address</p>
                                            <p className="text-xs font-light text-gray-600 leading-relaxed bg-white p-4 border border-gray-50">{order.shipping_address}</p>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Method</p>
                                              <p className="text-[10px] font-bold tracking-widest text-gray-900 uppercase bg-white p-3 border border-gray-50">{order.payment_method.replace('_', ' ')}</p>
                                            </div>
                                            <div className="space-y-2">
                                              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Payment</p>
                                              <p className={`text-[10px] font-bold tracking-widest uppercase bg-white p-3 border border-gray-50 ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {order.payment_status}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {order.status === 'shipped' && (
                                        <div className="bg-black p-8 text-white space-y-6">
                                          <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-500">Live Tracking</h4>
                                            <span className="text-[10px] font-mono text-gray-500">TRK-{order.id.split('-')[1]?.toUpperCase()}</span>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="h-1 w-full bg-white/10 overflow-hidden">
                                              <motion.div 
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '0%' }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="h-full w-1/3 bg-gold-500"
                                              />
                                            </div>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">In Transit to Destination</p>
                                          </div>
                                          <Button className="w-full h-12 text-[10px] bg-white text-black hover:bg-gold-500 hover:text-white border-none rounded-none group">
                                            Track Selection <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 bg-white border border-gray-50">
                      <div className="h-32 w-32 rounded-full bg-gray-50 flex items-center justify-center relative">
                        <ShoppingBag className="h-12 w-12 text-gray-200 stroke-[1px]" />
                        <div className="absolute inset-0 border border-gold-100 rounded-full animate-ping opacity-20" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-3xl font-serif text-gray-900 italic">The Archive is Empty</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Your fashion journey begins here</p>
                      </div>
                      <Link to="/">
                        <Button className="rounded-none px-16 h-14 group">
                          Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-2xl"
                >
                  <div className="border-b border-gray-100 pb-8 mb-12">
                    <h2 className="text-3xl font-serif tracking-tight text-gray-900">Atelier Settings</h2>
                    <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold mt-2">Manage your personal profile</p>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-12">
                    <AnimatePresence mode="wait">
                      {message && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-5 text-[10px] font-bold tracking-widest uppercase border ${
                            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          {message.text}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="space-y-10">
                      <div className="space-y-3 group">
                        <label className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 group-focus-within:text-gold-600 transition-colors">
                          Email Identity
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full bg-transparent border-b border-gray-100 py-4 text-sm tracking-widest text-gray-400 cursor-not-allowed uppercase font-light"
                          />
                          <ShieldCheck className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                        </div>
                      </div>

                      <div className="space-y-3 group">
                        <label className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 group-focus-within:text-gold-600 transition-colors">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 py-4 text-sm tracking-widest text-gray-900 focus:outline-none focus:border-gold-500 transition-all uppercase font-light placeholder:text-gray-300"
                          placeholder="ENTER YOUR FULL NAME"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full h-16 rounded-none group"
                      >
                        {isSaving ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Updating Atelier...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span>Save Changes</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'downloads' && (
                <motion.div
                  key="downloads"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="border-b border-gray-100 pb-8 mb-12">
                    <h2 className="text-3xl font-serif tracking-tight text-gray-900">Digital Vault</h2>
                    <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold mt-2">Your exclusive digital assets</p>
                  </div>

                  <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 bg-white border border-gray-50">
                    <div className="h-32 w-32 rounded-full bg-gray-50 flex items-center justify-center relative">
                      <Download className="h-12 w-12 text-gray-200 stroke-[1px]" />
                      <div className="absolute inset-0 border border-gold-100 rounded-full animate-ping opacity-20" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-3xl font-serif text-gray-900 italic">The Vault is Locked</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">No digital assets acquired yet</p>
                    </div>
                    <Link to="/category/Digital">
                      <Button className="rounded-none px-16 h-14 group">
                        Enter Digital Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
