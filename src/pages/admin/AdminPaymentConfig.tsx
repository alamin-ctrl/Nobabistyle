import { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, Save, Phone, CreditCard } from 'lucide-react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const PAYMENT_SQL = `-- Payment Settings Setup

create table if not exists public.payment_settings (
  id text primary key,
  number text,
  type text not null default 'merchant' check (type in ('personal', 'merchant', 'auto')),
  is_enabled boolean not null default true,
  extra_config jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist
alter table public.payment_settings add column if not exists type text not null default 'merchant' check (type in ('personal', 'merchant', 'auto'));
alter table public.payment_settings add column if not exists is_enabled boolean not null default true;
alter table public.payment_settings add column if not exists extra_config jsonb default '{}'::jsonb;

-- Seed initial values
insert into public.payment_settings (id, number, type, is_enabled)
values 
  ('bkash', '017XXXXXXXX', 'merchant', true),
  ('nagad', '017XXXXXXXX', 'merchant', true),
  ('rocket', '017XXXXXXXX', 'merchant', true),
  ('sslcommerz', null, 'auto', false)
on conflict (id) do nothing;

alter table public.payment_settings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can view payment settings" on public.payment_settings;
drop policy if exists "Admins can update payment settings" on public.payment_settings;

create policy "Anyone can view payment settings" on public.payment_settings
  for select using (true);

create policy "Admins can update payment settings" on public.payment_settings
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
`;

export function AdminPaymentConfig() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    bkash: { number: '', type: 'merchant', is_enabled: true },
    nagad: { number: '', type: 'merchant', is_enabled: true },
    rocket: { number: '', type: 'merchant', is_enabled: true },
    sslcommerz: { is_enabled: false, extra_config: { store_id: '', store_password: '', is_test: true } }
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const newSettings = { ...settings };
        data.forEach(item => {
          if (item.id in newSettings) {
            newSettings[item.id] = {
              number: item.number || '',
              type: item.type,
              is_enabled: item.is_enabled,
              extra_config: item.extra_config || {}
            };
          }
        });
        setSettings(newSettings);
      }
    } catch (err: any) {
      console.error('Error fetching payment settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updates = Object.entries(settings).map(([id, config]) => 
        supabase.from('payment_settings').upsert({ 
          id, 
          number: config.number || null, 
          type: id === 'sslcommerz' ? 'auto' : config.type,
          is_enabled: config.is_enabled,
          extra_config: config.extra_config || {},
          updated_at: new Date().toISOString() 
        })
      );

      const results = await Promise.all(updates);
      const firstError = results.find(r => r.error)?.error;
      
      if (firstError) throw firstError;

      setMessage({ type: 'success', text: 'Payment settings updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateMethod = (id: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const updateExtraConfig = (id: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        extra_config: { ...prev[id].extra_config, [field]: value } 
      }
    }));
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Configuration</h1>
          <p className="text-gray-500 mt-1">Configure auto and manual payment methods</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md font-medium transition-colors"
        >
          <ShieldAlert className="h-4 w-4" />
          Fix Permissions (SQL)
        </button>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">
          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Auto Payment Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Auto Payment (SSLCommerz)</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.sslcommerz.is_enabled}
                  onChange={(e) => updateMethod('sslcommerz', 'is_enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.sslcommerz.is_enabled && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
                    <Input 
                      value={settings.sslcommerz.extra_config.store_id}
                      onChange={(e) => updateExtraConfig('sslcommerz', 'store_id', e.target.value)}
                      placeholder="Enter SSLCommerz Store ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Password</label>
                    <Input 
                      type="password"
                      value={settings.sslcommerz.extra_config.store_password}
                      onChange={(e) => updateExtraConfig('sslcommerz', 'store_password', e.target.value)}
                      placeholder="Enter Store Password"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_test"
                    checked={settings.sslcommerz.extra_config.is_test}
                    onChange={(e) => updateExtraConfig('sslcommerz', 'is_test', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_test" className="text-sm text-gray-600">Sandbox / Test Mode</label>
                </div>
              </div>
            )}
          </div>

          {/* Manual Payment Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Manual Payment (Personal/Merchant)</h2>
            </div>
            
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {['bkash', 'nagad', 'rocket'].map((id) => (
                  <div key={id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 capitalize">{id} Configuration</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings[id].is_enabled}
                          onChange={(e) => updateMethod(id, 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {settings[id].is_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input 
                              value={settings[id].number}
                              onChange={(e) => updateMethod(id, 'number', e.target.value)}
                              placeholder="017XXXXXXXX"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number Type</label>
                          <select 
                            value={settings[id].type}
                            onChange={(e) => updateMethod(id, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                          >
                            <option value="merchant">Merchant Number</option>
                            <option value="personal">Personal Number</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-8">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full h-12 text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <SqlSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Payment Settings SQL" 
        sqlCode={PAYMENT_SQL} 
      />
    </div>
  );
}
