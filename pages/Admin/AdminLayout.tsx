
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, Shield, Menu, X } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { connectionStatus, signOut, user } = useStore();

  const links = [
    { name: 'Insights', path: '/admin', icon: <Star className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black overflow-x-hidden">
      {/* Universal Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-[110] flex items-center justify-between px-6 lg:px-10">
         <div className="flex items-center space-x-6">
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)} 
             className="p-2 text-[#A68E74] hover:bg-black/5 rounded-full transition-colors active:scale-90"
           >
             {sidebarOpen ? <X /> : <Menu />}
           </button>
           <Link to="/" className="font-serif text-xl tracking-tighter">AEVO Atelier</Link>
         </div>
         <div className="flex items-center space-x-8">
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[7px] uppercase tracking-[0.2em] font-black text-black/30">Active Artisan</span>
             <span className="text-[9px] font-bold text-[#A68E74] truncate max-w-[150px]">{user?.email}</span>
           </div>
           <div className="hidden lg:flex items-center space-x-4">
             <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
             <span className="text-[8px] uppercase tracking-[0.2em] font-black text-black/40">
               {connectionStatus === 'online' ? 'Global Sync' : 'Persistence Mode'}
             </span>
           </div>
         </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-black/[0.05] flex flex-col z-[120] 
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${sidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-black/[0.03] flex items-center justify-between">
          <Link to="/" className="text-xl font-serif text-black tracking-tighter">
            AEVO <span className="text-[7px] uppercase tracking-widest text-[#A68E74] ml-2 font-black">Atelier</span>
          </Link>
          <button className="text-black/20 hover:text-black transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-black ${
                location.pathname === link.path 
                  ? 'bg-black text-white shadow-xl translate-x-1' 
                  : 'text-black/30 hover:text-black hover:bg-black/[0.03]'
              }`}
            >
              <div className={`${location.pathname === link.path ? 'text-[#A68E74]' : ''}`}>
                {link.icon}
              </div>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-black/[0.03] space-y-4 bg-[#FDFBF9]/50">
           <button 
             onClick={signOut}
             className="w-full flex items-center justify-between group px-5 py-3 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black text-red-500"
           >
             <span>Terminate Session</span>
             <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
           </button>
           <Link 
             to="/" 
             className="flex items-center justify-between group px-5 py-3 border border-black/5 rounded-xl hover:bg-black hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black"
           >
             <span>Exit Atelier</span>
             <Star className="w-3 h-3 text-[#A68E74] group-hover:rotate-90 transition-transform" />
           </Link>
        </div>
      </aside>

      {/* Scrim Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[115] lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Orchestrator */}
      <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'lg:ml-72' : 'ml-0'} min-h-screen`}>
        <div className="max-w-7xl mx-auto px-6 py-10 lg:p-16 pt-24 lg:pt-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
