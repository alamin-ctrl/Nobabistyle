import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!hasSupabaseConfig || !supabase) {
      // Mock login for preview environment when Supabase is not configured
      const isAdmin = email === 'alaminid6@gmail.com' || email === 'admin@nobabistyle.com';
      useUserStore.getState().login({
        id: 'mock-id-123',
        name: email.split('@')[0],
        email: email,
        role: isAdmin ? 'admin' : 'user'
      });
      navigate(isAdmin ? '/admin' : '/dashboard');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        if (data.user && !data.session) {
          setSuccessMsg("Registration successful! Please check your email to verify your account.");
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
          {!hasSupabaseConfig && (
            <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <strong>Missing Supabase Config:</strong> You must add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to the AI Studio Secrets panel to use authentication.
            </p>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
            {successMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'Sign up' : 'Sign in')}
          </Button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

