
import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { Star, Shield, ChevronRight } from '../../components/Icons';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#1F1A16] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A68E74] opacity-[0.05] blur-[150px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md animate-fadeInUp">
        <div className="bg-[#2D241E]/80 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl space-y-12">
          
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#A68E74]/10 rounded-2xl flex items-center justify-center text-[#A68E74] border border-[#A68E74]/20 animate-pulse">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-[#A68E74] text-3xl font-serif italic tracking-tighter">Atelier Portal</h1>
              <p className="text-white/20 text-[9px] uppercase tracking-[0.6em] font-black">Authorized Personnel Only</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black ml-4">Registry ID (Email)</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-[#A68E74] focus:bg-white/10 transition-all"
                  placeholder="artisan@aevo.luxury"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black ml-4">Passkey</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-[#A68E74] focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] uppercase tracking-widest font-black text-center animate-shake">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#A68E74] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#A68E74]/10 group"
            >
              <span>{loading ? 'Verifying...' : 'Authenticate'}</span>
              {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <button className="text-white/10 hover:text-[#A68E74] text-[8px] uppercase tracking-[0.3em] font-black transition-colors">
              Request Emergency Access
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-white/10 text-[8px] uppercase tracking-[0.5em] font-black">
          © AEVO Atelier Geneva • Cryptographic Vault v15.4
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
