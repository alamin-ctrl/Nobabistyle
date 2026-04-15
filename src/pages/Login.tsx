import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Loader2, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="relative z-10 flex flex-col justify-end p-24 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-serif tracking-tighter text-white leading-tight"
          >
            Welcome to the <br />
            <span className="italic text-gold-500">Nobabi Atelier</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-400 font-light tracking-widest uppercase max-w-md"
          >
            Experience the pinnacle of fashion and digital craftsmanship.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-12"
        >
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-serif tracking-tighter text-black uppercase">
                Nobabi <span className="italic text-gold-500">Style</span>
              </h1>
            </Link>
            <div className="space-y-3">
              <h2 className="text-3xl font-serif tracking-tight text-black uppercase">
                {isSignUp ? 'Create an account' : 'Sign in to your account'}
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                {isSignUp ? 'Join our exclusive community' : 'Access your personal atelier'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 text-[10px] font-bold tracking-[0.3em] text-red-600 uppercase border border-red-100"
              >
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-green-50 text-[10px] font-bold tracking-[0.3em] text-green-700 uppercase border border-green-100"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 group-focus-within:text-gold-500 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-black/5 py-4 pl-8 text-sm tracking-[0.2em] text-black focus:outline-none focus:border-gold-500 transition-all uppercase font-light placeholder:text-gray-200"
                    placeholder="YOU@EXAMPLE.COM"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 group-focus-within:text-gold-500 transition-colors">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-black/5 py-4 pl-8 text-sm tracking-[0.2em] text-black focus:outline-none focus:border-gold-500 transition-all uppercase font-light placeholder:text-gray-200"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-none bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase flex items-center justify-center gap-3 group" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 hover:text-gold-500 transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>
              </div>
            </div>
          </form>

          <div className="pt-12 border-t border-black/5 flex items-center justify-center gap-4">
            <ShieldCheck className="h-4 w-4 text-gray-300" />
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">Secure Authentication</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

