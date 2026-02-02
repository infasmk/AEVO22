
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, Shield, Menu, X, Info, ChevronRight, Edit3, TrendingUp } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
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

  const fullSetupSQL = `-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Grant YOURSELF Admin Rights
INSERT INTO public.profiles (id, is_admin) 
VALUES ('${user?.id}', TRUE)
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- 4. Enable Read Access for everyone
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);`;

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black overflow-x-hidden">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-[110] flex items-center justify-between px-4 lg:px-10">
         <div className="flex items-center space-x-3 md:space-x-6">
           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#A68E74] hover:bg-black/5 rounded-full transition-colors">
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
           <Link to="/" className="font-serif text-lg md:text-xl tracking-tighter truncate max-w-[120px]">AEVO Atelier</Link>
         </div>
         
         <div className="flex items-center space-x-3 md:space-x-8">
           <button 
             onClick={() => fetchData()}
             className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${status.pillBg} ${status.borderColor} ${status.textColor} hover:scale-105 active:scale-95`}
           >
              <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${status.isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black whitespace-nowrap">{status.label}</span>
           </button>
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[7px] uppercase tracking-[0.2em] font-black text-black/30 leading-none">Artisan</span>
             <span className="text-[9px] font-bold text-[#A68E74] truncate max-w-[100px]">{user?.email?.split('@')[0]}</span>
           </div>
         </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-black/[0.05] flex flex-col z-[120] transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-black/[0.03] flex items-center justify-between">
          <Link to="/" className="text-xl font-serif text-black tracking-tighter">AEVO <span className="text-[7px] uppercase tracking-widest text-[#A68E74] ml-2 font-black">Atelier</span></Link>
          <button className="lg:hidden text-black/20 hover:text-black" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-black ${location.pathname === link.path ? 'bg-black text-white shadow-xl' : 'text-black/30 hover:text-black hover:bg-black/[0.03]'}`}>
              {link.icon}<span>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-black/[0.03]">
           <button onClick={signOut} className="w-full flex items-center justify-between px-5 py-3 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black text-red-500">
             <span>Terminate Session</span><X className="w-3 h-3" />
           </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[115] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'} min-h-screen pt-24 pb-20 px-4 md:px-10 lg:px-16`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Resolution Guide for non-admins */}
          {!isAdmin && user && (
            <div className="mb-12">
              <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center animate-fadeInUp shadow-sm">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <h4 className="text-amber-900 font-serif text-2xl italic">Registry Synchronization Required</h4>
                  <p className="text-amber-800/60 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.15em] leading-relaxed max-w-2xl">
                    The portal is currently in <span className="text-amber-900 font-black underline">Demo Mode</span> because your artisan profile hasn't been initialized in Supabase yet.
                  </p>
                  <button 
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-200/50 px-4 py-2 rounded-full hover:bg-amber-200 transition-all"
                  >
                    <span>{showGuide ? 'Close Setup Guide' : 'Initialize Registry Now'}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showGuide ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {showGuide && (
                <div className="mt-6 bg-[#1F1A16] rounded-[2.5rem] p-8 md:p-12 border border-white/5 animate-fadeInUp shadow-2xl">
                  <div className="space-y-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-[#A68E74]/10 flex items-center justify-center text-[#A68E74] border border-[#A68E74]/20">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <h5 className="text-white text-lg font-serif italic">Atelier Registry Setup</h5>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[8px] uppercase tracking-[0.5em] text-[#A68E74] font-black">1. Copy This SQL Command</label>
                          <div className="bg-black rounded-2xl p-6 border border-white/5 relative group">
                            <pre className="text-[10px] md:text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto thin-scrollbar">
                              {fullSetupSQL}
                            </pre>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(fullSetupSQL);
                                alert("SQL copied to clipboard!");
                              }}
                              className="absolute top-4 right-4 text-[8px] font-black text-white/20 hover:text-white uppercase"
                            >
                              Copy Full Setup
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h6 className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Action Steps:</h6>
                          <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                              <span className="text-[9px] font-black text-[#A68E74] mt-1">01</span>
                              <p className="text-white/60 text-xs italic">Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline text-emerald-400">Supabase Dashboard</a>.</p>
                            </li>
                            <li className="flex items-start space-x-4">
                              <span className="text-[9px] font-black text-[#A68E74] mt-1">02</span>
                              <p className="text-white/60 text-xs italic">Select **SQL Editor** from the left navigation.</p>
                            </li>
                            <li className="flex items-start space-x-4">
                              <span className="text-[9px] font-black text-[#A68E74] mt-103">03</span>
                              <p className="text-white/60 text-xs italic">Paste the command, click **Run**, and then click the **Live Sync** pill at the top of this page to refresh.</p>
                            </li>
                          </ul>
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
