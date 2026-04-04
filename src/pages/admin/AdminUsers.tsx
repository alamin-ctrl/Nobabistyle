import { useState, useEffect } from 'react';
import { ShieldAlert, UserCog, Loader2 } from 'lucide-react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

const USERS_SQL = `-- Users & Roles Management SQL
-- Make sure the profiles table is created first (see Dashboard SQL)

-- Create a secure function for admins to update user roles
create or replace function public.set_user_role(target_user_id uuid, new_role text)
returns void as $$
begin
  -- Check if the executing user is an admin
  if not exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Unauthorized: Only admins can change roles';
  end if;

  -- Validate role
  if new_role not in ('user', 'admin') then
    raise exception 'Invalid role: must be user or admin';
  end if;

  -- Update the role
  update public.profiles
  set role = new_role
  where id = target_user_id;
end;
$$ language plpgsql security definer;

-- To make yourself an admin initially, run this in the SQL editor:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
`;

interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function AdminUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // We use the RPC function if created, or try direct update (relies on RLS)
      const { error } = await supabase.rpc('set_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) {
        // Fallback to direct update if RPC doesn't exist yet
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
          
        if (updateError) throw updateError;
      }

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert('Failed to update role: ' + err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md font-medium transition-colors"
        >
          <ShieldAlert className="h-4 w-4" />
          Fix Permissions (SQL)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error loading users: {error}</p>
            <p className="text-sm mt-2 text-gray-500">Make sure you have run the setup SQL.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Joined</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Current Role</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <UserCog className="h-4 w-4" />
                      </div>
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No users found.
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
        title="User Roles SQL" 
        sqlCode={USERS_SQL} 
      />
    </div>
  );
}
