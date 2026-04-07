import { create } from 'zustand';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: async () => {
    if (hasSupabaseConfig && supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null, isAuthenticated: false });
  },
  initializeAuth: () => {
    if (hasSupabaseConfig && supabase) {
      const fetchProfile = async (userId: string, email: string, metadata: any) => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

          if (error) throw error;

          const isAdmin = email === 'alaminid6@gmail.com' || email === 'admin@nobabistyle.com' || profile?.role === 'admin';

          set({
            user: {
              id: userId,
              name: metadata?.full_name || email?.split('@')[0] || 'User',
              email: email || '',
              role: isAdmin ? 'admin' : 'user',
            },
            isAuthenticated: true,
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback to basic user info if profile fetch fails
          const isAdmin = email === 'alaminid6@gmail.com' || email === 'admin@nobabistyle.com';
          set({
            user: {
              id: userId,
              name: metadata?.full_name || email?.split('@')[0] || 'User',
              email: email || '',
              role: isAdmin ? 'admin' : 'user',
            },
            isAuthenticated: true,
          });
        }
      };

      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.warn('Supabase session error:', error.message);
          if (error.message.includes('Refresh Token')) {
            supabase.auth.signOut().catch(console.error);
          }
        } else if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata);
        }
      }).catch(err => {
        console.warn('Error getting session:', err);
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ user: null, isAuthenticated: false });
        } else if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata);
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    }
  }
}));

