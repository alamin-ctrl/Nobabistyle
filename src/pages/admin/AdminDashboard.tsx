import { Package, Users, ShoppingCart, DollarSign, ShieldAlert, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { supabase } from '../../lib/supabase';

const DASHBOARD_SQL = `-- Core Profiles & Roles Setup
-- Run this to create the profiles table and set up basic admin rules

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was created previously without them
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

alter table public.profiles enable row level security;

-- Drop existing policies if they exist to avoid "already exists" errors
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Admins can update any profile." on public.profiles;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can insert their own profile." 
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can update any profile." 
  on public.profiles for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Trigger to automatically create or update a profile when an auth user is created or updated
create or replace function public.handle_auth_user_sync()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  on conflict (id) do update
  set 
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$ language plpgsql security definer;

-- Drop triggers if they exist to avoid errors
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_updated on auth.users;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_auth_user_sync();

-- Create trigger for updated users (syncs email changes)
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_auth_user_sync();

-- BACKFILL: Create profiles for any existing users who don't have one
insert into public.profiles (id, email, full_name, avatar_url, role)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url',
  'user'
from auth.users
on conflict (id) do update
set 
  email = excluded.email,
  full_name = excluded.full_name,
  avatar_url = excluded.avatar_url;

-- PROMOTE: Set specific email as admin (Optional)
update public.profiles set role = 'admin' where email = 'alaminbusinessid@gmail.com';
`;

export function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    pendingOrders: 0,
    outOfStock: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Products count & out of stock
      const { data: productsData } = await supabase
        .from('products')
        .select('id, stock');
        
      const productsCount = productsData?.length || 0;
      const outOfStock = productsData?.filter(p => p.stock <= 0).length || 0;
        
      // Fetch Customers count
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      // Fetch Orders & Revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, user_id')
        .order('created_at', { ascending: false });

      let revenue = 0;
      let ordersCount = 0;
      let pendingOrders = 0;
      let recent = [];

      if (ordersData) {
        ordersCount = ordersData.length;
        pendingOrders = ordersData.filter(o => o.status === 'pending').length;
        revenue = ordersData
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + Number(o.total_amount), 0);
        recent = ordersData.slice(0, 5);
      }

      // Fetch emails for recent orders
      if (recent.length > 0) {
        const userIds = recent.map(o => o.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
          
        const profileMap = new Map(profiles?.map(p => [p.id, p.email]));
        recent = recent.map(o => ({
          ...o,
          user_email: profileMap.get(o.user_id) || 'Unknown User'
        }));
      }

      setStats({
        revenue,
        orders: ordersCount,
        products: productsCount,
        customers: customersCount || 0,
        pendingOrders,
        outOfStock
      });
      setRecentOrders(recent);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md font-medium transition-colors"
        >
          <ShieldAlert className="h-4 w-4" />
          Fix Permissions (SQL)
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">৳ {stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">Lifetime earnings</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Orders</h3>
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
              <p className="text-sm text-blue-600 mt-2">{stats.pendingOrders} pending</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Products</h3>
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
              <p className="text-sm text-red-500 mt-2">{stats.outOfStock} out of stock</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Customers</h3>
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.customers}</p>
              <p className="text-sm text-gray-500 mt-2">Registered users</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500">Order ID</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <span className="truncate w-24 block" title={order.id}>#{order.id.split('-')[0]}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.user_email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">৳ {order.total_amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <SqlSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Core Roles & Profiles SQL" 
        sqlCode={DASHBOARD_SQL} 
      />
    </div>
  );
}
