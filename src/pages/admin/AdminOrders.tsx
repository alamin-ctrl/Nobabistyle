import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, Eye, Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { supabase } from '../../lib/supabase';

const ORDERS_SQL = `-- Orders & Order Items Setup

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  total_amount numeric not null,
  shipping_address text not null,
  payment_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure column exists if table was created previously without it
alter table public.orders add column if not exists payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded'));

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products not null,
  quantity integer not null,
  price numeric not null
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own orders." on public.orders;
drop policy if exists "Users can insert own orders." on public.orders;
drop policy if exists "Admins can view all orders." on public.orders;
drop policy if exists "Admins can update all orders." on public.orders;
drop policy if exists "Users can view own order items." on public.order_items;
drop policy if exists "Users can insert own order items." on public.order_items;
drop policy if exists "Admins can view all order items." on public.order_items;

-- Users can view their own orders
create policy "Users can view own orders." 
  on public.orders for select using (auth.uid() = user_id);

-- Users can insert their own orders
create policy "Users can insert own orders." 
  on public.orders for insert with check (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders." 
  on public.orders for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update all orders (e.g., change status)
create policy "Admins can update all orders." 
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order Items Policies
create policy "Users can view own order items." 
  on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can insert own order items." 
  on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Admins can view all order items." 
  on public.order_items for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
`;

interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  user_email?: string;
}

export function AdminOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch profiles to map emails
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesError) throw profilesError;

      // Map emails to orders
      const profileMap = new Map(profilesData?.map(p => [p.id, p.email]));
      
      const mappedOrders = (ordersData || []).map(order => ({
        ...order,
        user_email: profileMap.get(order.user_id) || 'Unknown User'
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error: err } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (err) throw err;

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error: err } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

      if (err) throw err;

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o));
    } catch (err: any) {
      alert('Failed to update payment status: ' + err.message);
    }
  };

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
            images
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders and fulfillment</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md font-medium transition-colors"
        >
          <ShieldAlert className="h-4 w-4" />
          Fix Permissions (SQL)
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
          <p>Error loading orders: {error}</p>
          <p className="text-sm mt-1">Make sure you have run the setup SQL.</p>
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Total</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Payment</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          {expandedOrderId === order.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="truncate w-24 block" title={order.id}>{order.id.split('-')[0]}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.user_email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ৳ {order.total_amount}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.payment_status || 'unpaid'}
                          onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getPaymentStatusColor(order.payment_status || 'unpaid')}`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={6} className="px-6 py-4 border-t border-gray-100">
                          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                              <ShoppingBag className="h-4 w-4" />
                              Order Details
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items</h4>
                                {loadingItems[order.id] ? (
                                  <div className="flex justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                  </div>
                                ) : orderItems[order.id]?.length > 0 ? (
                                  <div className="space-y-3">
                                    {orderItems[order.id].map((item: any) => (
                                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                        <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                          <img 
                                            src={item.products?.images?.[0] || 'https://via.placeholder.com/150'} 
                                            alt={item.products?.name}
                                            className="h-full w-full object-cover"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">{item.products?.name || 'Unknown Product'}</p>
                                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳ {item.price}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">৳ {item.quantity * item.price}</p>
                                      </div>
                                    ))}
                                    
                                    <div className="pt-3 border-t border-gray-100 mt-2">
                                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Subtotal</span>
                                        <span>৳ {order.total_amount}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                      </div>
                                      <div className="flex justify-between text-base font-bold text-gray-900 mt-2">
                                        <span>Total Amount</span>
                                        <span>৳ {order.total_amount}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">No items found for this order.</p>
                                )}
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Shipping Information</h4>
                                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-700 leading-relaxed">{order.shipping_address}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Payment Method</h4>
                                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-700 capitalize">{order.payment_method.replace('_', ' ')}</p>
                                  </div>
                                </div>
                                
                                {order.status === 'shipped' && (
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tracking</h4>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                      <p className="text-sm text-blue-800">
                                        <span className="font-semibold">ID:</span> TRK-{order.id.split('-')[1]?.toUpperCase() || '123456'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SqlSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Orders SQL" 
        sqlCode={ORDERS_SQL} 
      />
    </div>
  );
}
