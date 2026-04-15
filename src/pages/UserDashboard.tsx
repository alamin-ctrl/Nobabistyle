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
      <section className="relative h-[45vh] bg-black overflow-hidden flex items-center">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            alt="Dashboard Background" 
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-gold-500 uppercase">Personal Atelier</span>
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight text-white leading-none uppercase">
              Welcome, <span className="italic text-gold-500">{fullName.split(' ')[0]}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl -mt-24 relative z-20 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-8 sm:space-y-12">
            <div className="bg-white p-6 sm:p-10 border border-black/5 shadow-sm space-y-8 sm:space-y-10">
              <div className="flex flex-row lg:flex-col items-center lg:text-center gap-6 sm:gap-8">
                <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-none bg-black flex items-center justify-center text-gold-500 font-serif text-2xl sm:text-4xl border border-gold-500/20 flex-shrink-0">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1 text-left lg:text-center overflow-hidden">
                  <p className="text-xs font-bold tracking-[0.2em] text-black uppercase truncate">{fullName}</p>
                  <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold truncate">{user?.email}</p>
                </div>
              </div>

              <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                {[
                  { id: 'orders', label: 'Orders', fullLabel: 'Order History', icon: Package },
                  { id: 'downloads', label: 'Vault', fullLabel: 'Digital Vault', icon: Download },
                  { id: 'settings', label: 'Settings', fullLabel: 'Atelier Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 sm:gap-4 flex-shrink-0 px-4 sm:px-5 py-3 sm:py-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 border ${
                      activeTab === tab.id 
                        ? 'text-black bg-gold-500/10 border-gold-500' 
                        : 'text-gray-400 border-transparent hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-gold-500' : ''}`} />
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-6 sm:pt-10 border-t border-black/5 hidden lg:block">
                <button 
                  onClick={logout}
                  className="flex items-center gap-4 w-full px-5 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-all duration-500 group"
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-black p-8 sm:p-10 text-white space-y-6 sm:space-y-8 border-t-4 border-gold-500">
              <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-500">Concierge</h4>
              <p className="text-xs font-light text-gray-400 leading-relaxed tracking-wide">
                Need assistance with your selection? Our atelier experts are available to guide you through our collections.
              </p>
              <Button variant="outline" className="w-full border-white/10 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-500 text-[10px] h-14 rounded-none uppercase tracking-[0.3em] font-bold">
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
                  className="space-y-12 sm:space-y-16"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-black/5 pb-8 sm:pb-10 gap-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-black uppercase">Recent Selections</h2>
                      <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">Your curated history</p>
                    </div>
                    <button 
                      onClick={() => user?.id && fetchOrders(user.id)}
                      className="text-[10px] font-bold tracking-[0.3em] text-gold-500 uppercase hover:text-black transition-all duration-500 flex items-center gap-3"
                    >
                      <Loader2 className={`h-3 w-3 ${loadingOrders ? 'animate-spin' : ''}`} />
                      Refresh Archive
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-6">
                      <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
                      <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">Accessing Archive...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-8 sm:space-y-10">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-white border border-black/5 transition-all duration-700 hover:shadow-sm group"
                        >
                          <div 
                            className="p-6 sm:p-10 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-8 sm:gap-10"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            <div className="flex items-center gap-6 sm:gap-10">
                              <div className="h-16 w-14 sm:h-20 sm:w-16 bg-gray-50 flex items-center justify-center text-gray-200 border border-black/5 flex-shrink-0">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8 stroke-[1px]" />
                              </div>
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Ref.</span>
                                  <span className="text-xs sm:text-sm font-bold text-black tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">#{order.id.split('-')[0]}</span>
                                </div>
                                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-8 sm:gap-16 w-full md:w-auto justify-between md:justify-end">
                              <div className="text-left md:text-right space-y-1">
                                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Total</p>
                                <p className="text-lg sm:text-xl font-bold text-black tracking-widest">৳ {order.total_amount}</p>
                              </div>
                              <div className="text-right space-y-2">
                                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Status</p>
                                <span className={`text-[8px] sm:text-[9px] font-bold tracking-[0.3em] uppercase px-3 sm:px-4 py-1 sm:py-1.5 border ${
                                  order.status === 'delivered' ? 'text-green-600 border-green-100 bg-green-50/50' : 'text-gold-500 border-gold-500/20 bg-gold-500/5'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className={`p-2 transition-transform duration-700 ${expandedOrderId === order.id ? 'rotate-180' : ''} hidden sm:block`}>
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedOrderId === order.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-black/5 overflow-hidden"
                              >
                                <div className="p-6 sm:p-10 lg:p-16 space-y-12 sm:space-y-16 bg-gray-50/30">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
                                    <div className="space-y-8 sm:space-y-10">
                                      <h4 className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400 border-b border-black/5 pb-5">Selected Pieces</h4>
                                      {loadingItems[order.id] ? (
                                        <div className="flex justify-center py-12 sm:py-16">
                                          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                                        </div>
                                      ) : (
                                        <div className="space-y-6 sm:space-y-8">
                                          {orderItems[order.id]?.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-6 sm:gap-8 group/item">
                                              <div className="h-20 w-16 sm:h-24 sm:w-18 bg-white border border-black/5 overflow-hidden flex-shrink-0">
                                                <img 
                                                  src={item.products?.images?.[0]} 
                                                  alt={item.products?.name}
                                                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                                                />
                                              </div>
                                              <div className="flex-1 space-y-1 sm:space-y-2">
                                                <p className="text-xs sm:text-sm font-bold text-black tracking-tight uppercase font-serif">{item.products?.name}</p>
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Qty: {item.quantity}</p>
                                                  <span className="text-gray-200">|</span>
                                                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">৳ {item.price}</p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-xs sm:text-sm font-bold text-black tracking-widest">৳ {item.quantity * item.price}</p>
                                                {item.products?.isDigital && (
                                                  <Link 
                                                    to="/dashboard" 
                                                    onClick={() => setActiveTab('downloads')}
                                                    className="text-[8px] sm:text-[9px] text-gold-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 justify-end hover:text-black mt-2 transition-colors"
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

                                    <div className="space-y-12 sm:space-y-16">
                                      <div className="space-y-8">
                                        <h4 className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400 border-b border-black/5 pb-5">Logistics & Payment</h4>
                                        <div className="space-y-6 sm:space-y-8">
                                          <div className="space-y-3">
                                            <p className="text-[9px] font-bold tracking-[0.3em] text-gray-400 uppercase">Delivery Address</p>
                                            <p className="text-xs font-light text-black leading-relaxed bg-white p-4 sm:p-6 border border-black/5 tracking-wide">{order.shipping_address}</p>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                            <div className="space-y-3">
                                              <p className="text-[9px] font-bold tracking-[0.3em] text-gray-400 uppercase">Method</p>
                                              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-black uppercase bg-white p-3 sm:p-4 border border-black/5 truncate">{order.payment_method.replace('_', ' ')}</p>
                                            </div>
                                            <div className="space-y-3">
                                              <p className="text-[9px] font-bold tracking-[0.3em] text-gray-400 uppercase">Payment</p>
                                              <p className={`text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase bg-white p-3 sm:p-4 border border-black/5 ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {order.payment_status}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {order.status === 'shipped' && (
                                        <div className="bg-black p-8 sm:p-10 text-white space-y-6 sm:space-y-8 border-t-4 border-gold-500">
                                          <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-bold tracking-[0.5em] uppercase text-gold-500">Live Tracking</h4>
                                            <span className="text-[9px] sm:text-[10px] font-mono text-gray-500">TRK-{order.id.split('-')[1]?.toUpperCase()}</span>
                                          </div>
                                          <div className="space-y-3">
                                            <div className="h-1 w-full bg-white/10 overflow-hidden">
                                              <motion.div 
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '0%' }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                className="h-full w-1/3 bg-gold-500"
                                              />
                                            </div>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-bold">In Transit to Destination</p>
                                          </div>
                                          <Button className="w-full h-14 text-[10px] bg-white text-black hover:bg-gold-500 hover:text-black border-none rounded-none group tracking-[0.3em] font-bold uppercase transition-all duration-500">
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
                    <div className="h-[50vh] sm:h-[65vh] flex flex-col items-center justify-center text-center space-y-8 sm:space-y-10 bg-white border border-black/5 p-6">
                      <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gray-50 flex items-center justify-center relative">
                        <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-200 stroke-[1px]" />
                        <div className="absolute inset-0 border border-gold-500/20 rounded-full animate-ping opacity-20" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-3xl sm:text-4xl font-serif text-black uppercase tracking-tight italic">The Archive is Empty</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">Your fashion journey begins here</p>
                      </div>
                      <Link to="/" className="w-full sm:w-auto">
                        <Button className="rounded-none w-full sm:px-20 h-16 group bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase">
                          Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 ml-3" />
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
                  <div className="border-b border-black/5 pb-10 mb-16">
                    <h2 className="text-3xl font-serif tracking-tight text-black uppercase">Atelier Settings</h2>
                    <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold mt-3">Manage your personal profile</p>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-16">
                    <AnimatePresence mode="wait">
                      {message && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-6 text-[10px] font-bold tracking-[0.3em] uppercase border ${
                            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          {message.text}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="space-y-12">
                      <div className="space-y-4 group">
                        <label className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400 group-focus-within:text-gold-500 transition-colors">
                          Email Identity
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full bg-transparent border-b border-black/5 py-5 text-sm tracking-[0.2em] text-gray-400 cursor-not-allowed uppercase font-light"
                          />
                          <ShieldCheck className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                        </div>
                      </div>

                      <div className="space-y-4 group">
                        <label className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400 group-focus-within:text-gold-500 transition-colors">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-transparent border-b border-black/10 py-5 text-sm tracking-[0.2em] text-black focus:outline-none focus:border-gold-500 transition-all uppercase font-light placeholder:text-gray-300"
                          placeholder="ENTER YOUR FULL NAME"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-10">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full h-18 rounded-none group bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase"
                      >
                        {isSaving ? (
                          <div className="flex items-center gap-4">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Updating Atelier...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
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
                  className="space-y-16"
                >
                  <div className="border-b border-black/5 pb-10 mb-16">
                    <h2 className="text-3xl font-serif tracking-tight text-black uppercase">Digital Vault</h2>
                    <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold mt-3">Your exclusive digital assets</p>
                  </div>

                  <div className="h-[65vh] flex flex-col items-center justify-center text-center space-y-10 bg-white border border-black/5">
                    <div className="h-36 w-36 rounded-full bg-gray-50 flex items-center justify-center relative">
                      <Download className="h-12 w-12 text-gray-200 stroke-[1px]" />
                      <div className="absolute inset-0 border border-gold-500/20 rounded-full animate-ping opacity-20" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-4xl font-serif text-black uppercase tracking-tight italic">The Vault is Locked</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">No digital assets acquired yet</p>
                    </div>
                    <Link to="/category/Digital">
                      <Button className="rounded-none px-20 h-16 group bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase">
                        Enter Digital Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 ml-3" />
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
