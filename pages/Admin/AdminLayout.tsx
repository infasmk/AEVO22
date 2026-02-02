
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet, useNavigate } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, Shield, Menu, X, Info, ChevronRight, Edit3, TrendingUp } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showGuide, setShowGuide] = useState(false);
  const { connectionStatus, signOut, user, isAdmin, fetchData } = useStore();

  const links = [
    { name: 'Insights', path: '/admin', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: 'Live Sync', dotColor: 'bg-emerald-500', pillBg: 'bg-emerald-50/50', textColor: 'text-emerald-700', borderColor: 'border-emerald-100', isSyncing: false };
      case 'connecting':
        return { label: 'Syncing', dotColor: 'bg-blue-500', pillBg: 'bg-blue-50/50', textColor: 'text-blue-700', borderColor: 'border-blue-100', isSyncing: true };
      default:
        return { label: 'Local Mode', dotColor: 'bg-amber-500', pillBg: 'bg-amber-50/50', textColor: 'text-amber-700', borderColor: 'border-amber-100', isSyncing: false };
    }
  };

  const status = getStatusConfig(connectionStatus);

  const handleTerminate = async () => {
    await signOut();
    navigate('/'); 
    window.location.reload(); // Force full app reset
  };

  const fullSetupSQL = `-- 1. ATELIER REGISTRY SCHEMA
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT,
  images TEXT[],
  colors TEXT[],
  stock INTEGER DEFAULT 10,
  rating NUMERIC DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  tag_label TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  user_email TEXT,
  total_amount NUMERIC,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. PERMISSIONS
CREATE POLICY "Public Read Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin All Access Products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admin All Access Banners" ON public.banners FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- 4. ELEVATE YOUR ACCOUNT
INSERT INTO public.profiles (id, is_admin) 
VALUES ('${user?.id}', TRUE)
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;`;

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black overflow-x-hidden">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-[110] flex items-center justify-between px-4 lg:px-10">
         <div className="flex items-center space-x-3 md:space-x-6">
           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#A68E74] hover:bg-black/5 rounded-full transition-colors active:scale-90">
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
           <Link to="/" className="font-serif text-lg md:text-xl tracking-tighter truncate max-w-[120px]">AEVO Atelier</Link>
         </div>
         
         <div className="flex items-center space-x-3 md:space-x-8">
           <button 
             onClick={() => fetchData()}
             className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${status.pillBg} ${status.borderColor} ${status.textColor} hover:scale-105 active:scale-95 shadow-sm`}
           >
              <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${status.isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black whitespace-nowrap">{status.label}</span>
           </button>
           <div className="hidden sm:flex flex-col items-end border-l border-black/5 pl-6">
             <span className="text-[7px] uppercase tracking-[0.2em] font-black text-black/30 leading-none">Artisan</span>
             <span className="text-[9px] font-bold text-[#A68E74] truncate max-w-[100px]">{user?.email?.split('@')[0]}</span>
           </div>
         </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-black/[0.05] flex flex-col z-[120] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-black/[0.03] flex items-center justify-between">
          <Link to="/" className="text-xl font-serif text-black tracking-tighter">AEVO <span className="text-[7px] uppercase tracking-widest text-[#A68E74] ml-2 font-black">Atelier</span></Link>
          <button className="lg:hidden text-black/20 hover:text-black transition-colors" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-black ${location.pathname === link.path || (link.path === '/admin' && location.pathname === '/admin/') ? 'bg-black text-white shadow-xl' : 'text-black/30 hover:text-black hover:bg-black/[0.03]'}`}>
              {link.icon}<span>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-black/[0.03] bg-[#FDFBF9]/50">
           <button onClick={handleTerminate} className="w-full flex items-center justify-between px-5 py-4 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black text-red-500 active:scale-95 shadow-sm group">
             <span>Terminate Session</span><X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[115] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'lg:ml-72' : 'ml-0'} min-h-screen pt-24 pb-20 px-4 md:px-10 lg:px-16`}>
        <div className="max-w-7xl mx-auto">
          
          {!isAdmin && user && (
            <div className="mb-12 animate-fadeInDown">
              <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start md:items-center shadow-lg">
                <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 flex-shrink-0 border-b-4 border-amber-200 shadow-inner">
                  <Shield className="w-10 h-10" />
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="text-amber-900 font-serif text-3xl italic">Atelier Registry Initialization</h4>
                  <p className="text-amber-800/60 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.15em] leading-relaxed max-w-2xl">
                    Welcome, Artisan. You are authenticated as <span className="text-amber-900 font-black">{user.email}</span>. 
                    To unlock the live registry and management tools, you must initialize the database schema.
                  </p>
                  <button 
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-white bg-amber-700 px-8 py-3 rounded-full hover:bg-amber-800 transition-all active:scale-95 shadow-xl shadow-amber-900/20"
                  >
                    <span>{showGuide ? 'Hide Setup Protocol' : 'Begin System Initialization'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showGuide ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {showGuide && (
                <div className="mt-8 bg-[#1F1A16] rounded-[3rem] p-10 md:p-16 border border-white/5 animate-fadeInUp shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                  <div className="space-y-12">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#A68E74]/10 flex items-center justify-center text-[#A68E74] border border-[#A68E74]/20">
                        <Edit3 className="w-7 h-7" />
                      </div>
                      <div>
                        <h5 className="text-white text-2xl font-serif italic">Master Registry Protocol</h5>
                        <p className="text-[#A68E74] text-[8px] uppercase tracking-[0.4em] font-black mt-1">Database Schema v2.1</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[9px] uppercase tracking-[0.5em] text-[#A68E74] font-black block ml-2">1. Registry Architect SQL</label>
                          <div className="bg-black rounded-3xl p-8 border border-white/10 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                            <pre className="text-[10px] md:text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto thin-scrollbar relative z-10 pr-4">
                              {fullSetupSQL}
                            </pre>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(fullSetupSQL);
                                alert("AEVO Master Protocol copied to clipboard.");
                              }}
                              className="absolute top-6 right-6 text-[9px] font-black text-white bg-emerald-500/20 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all uppercase tracking-widest"
                            >
                              Copy Protocol
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-12 py-4">
                        <div className="space-y-6">
                          <h6 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">Action Sequence:</h6>
                          <ul className="space-y-8">
                            {[
                              { s: "01", t: "Log into your Supabase Dashboard.", l: "https://supabase.com/dashboard" },
                              { s: "02", t: "Open the SQL Editor in the left navigation panel." },
                              { s: "03", t: "Execute the Architect Protocol copied above." },
                              { s: "04", t: "Return to this portal and click the 'Live Sync' status pill at the top." }
                            ].map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-6">
                                <span className="text-xl font-serif italic text-[#A68E74] opacity-40">{step.s}</span>
                                <p className="text-white/70 text-sm italic font-light leading-relaxed">
                                  {step.t} {step.l && <a href={step.l} target="_blank" rel="noreferrer" className="text-emerald-400 underline decoration-emerald-400/20 underline-offset-4 ml-2">Open Supabase</a>}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-8 bg-amber-900/10 border border-amber-900/20 rounded-3xl">
                          <p className="text-amber-200/40 text-[10px] leading-relaxed italic">
                            * Technical Integrity: This script creates all tables (Products, Banners, Orders) and installs the required Row Level Security policies. Running this ensures the registry transitions from "Local Mode" to "Live Synchronization."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
