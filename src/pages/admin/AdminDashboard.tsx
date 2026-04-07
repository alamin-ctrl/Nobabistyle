import { Package, Users, ShoppingCart, DollarSign, ShieldAlert, Loader2, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

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
      
      const { data: productsData } = await supabase
        .from('products')
        .select('id, stock');
        
      const productsCount = productsData?.length || 0;
      const outOfStock = productsData?.filter(p => p.stock <= 0).length || 0;
        
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at, user_id')
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
        recent = ordersData.slice(0, 8);
      }

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
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif tracking-tight text-gray-900">Executive Overview</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <Calendar className="h-3 w-3" />
            Last 30 Days
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 text-[10px] font-bold tracking-widest uppercase transition-all"
          >
            <ShieldAlert className="h-3 w-3" />
            System SQL
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Synchronizing Data...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Total Revenue', value: `৳ ${stats.revenue.toLocaleString()}`, sub: 'Lifetime earnings', icon: DollarSign, color: 'gold', trend: '+12%' },
              { label: 'Total Orders', value: stats.orders, sub: `${stats.pendingOrders} pending`, icon: ShoppingCart, color: 'blue', trend: '+5%' },
              { label: 'Product Inventory', value: stats.products, sub: `${stats.outOfStock} out of stock`, icon: Package, color: 'purple', trend: 'Stable' },
              { label: 'Active Customers', value: stats.customers, sub: 'Registered users', icon: Users, color: 'orange', trend: '+8%' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100 shadow-premium group hover:border-gold-200 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-12 w-12 rounded-full bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100`}>
                    <stat.icon className="h-5 w-5 stroke-[1.5px]" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tighter">{stat.value}</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif tracking-tight text-gray-900">Recent Transactions</h2>
                <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">Latest order activity</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gold-600 uppercase hover:text-gold-700 transition-colors">
                View All Orders <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Reference</th>
                      <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Customer Identity</th>
                      <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Amount</th>
                      <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order, i) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-900 tracking-tighter">#{order.id.split('-')[0].toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-900">{order.user_email}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">Verified Client</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-gray-900 tracking-tighter">৳ {order.total_amount}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center px-3 py-1 text-[9px] font-bold tracking-widest uppercase border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <ShoppingCart className="h-8 w-8 text-gray-100" />
                            <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">No recent transactions found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
