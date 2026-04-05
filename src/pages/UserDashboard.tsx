import { useUserStore } from '../store/useUserStore';
import { Navigate } from 'react-router-dom';
import { Package, Download, Settings, User, Save, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function UserDashboard() {
  const { user, isAuthenticated, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [fullName, setFullName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (authError) throw authError;

      // Update profiles table (though the trigger should handle it, we can do it directly for immediate feedback)
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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">Welcome back, {fullName}</p>
        </div>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Package className="h-5 w-5" />
              Orders
            </button>
            <button className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
              <Download className="h-5 w-5" />
              Digital Downloads
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5" />
              Account Settings
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          {activeTab === 'orders' ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => user?.id && fetchOrders(user.id)}
                  disabled={loadingOrders}
                >
                  Refresh
                </Button>
              </div>
              
              {loadingOrders ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : ordersError ? (
                <div className="p-6 text-center text-red-500">
                  <p>Error: {ordersError}</p>
                  <Button onClick={fetchOrders} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : orders.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">{order.id.split('-')[0]}</span></p>
                          <p className="text-sm text-gray-500">Date: <span className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span></p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-medium text-gray-900">৳ {order.total_amount}</p>
                          <span className={`inline-block mt-1 text-xs font-medium rounded-full px-2.5 py-1 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {order.status === 'shipped' && (
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-blue-900 mb-2">Tracking Information</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-blue-800">
                                <span className="text-blue-600">Tracking ID:</span> <span className="font-mono font-semibold">TRK-{order.id.split('-')[1]?.toUpperCase() || '123456'}</span>
                              </p>
                              <p className="text-xs text-blue-600 mt-1">Estimated delivery: 2-3 business days</p>
                            </div>
                            <a 
                              href={`https://steadfast.com.bd/tracking?id=TRK-${order.id.split('-')[1]?.toUpperCase() || '123456'}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                            >
                              Track Package
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>You haven't placed any orders yet.</p>
                  <Button className="mt-4">Start Shopping</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${
                      message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-400 italic">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
