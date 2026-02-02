
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, Shield, Menu, X, Info, TrendingUp } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { connectionStatus, signOut, user, isAdmin } = useStore();

  const links = [
    { name: 'Insights', path: '/admin', icon: <Star className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
  ];

  // Map internal connection status to visual properties
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { 
          label: 'Live Sync', 
          dotColor: 'bg-emerald-500', 
          pillBg: 'bg-emerald-50/50', 
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-100',
          isSyncing: false
        };
      case 'connecting':
        return { 
          label: 'Syncing', 
          dotColor: 'bg-blue-500', 
          pillBg: 'bg-blue-50/50', 
          textColor: 'text-blue-700',
          borderColor: 'border-blue-100',
          isSyncing: true
        };
      case 'offline':
        return { 
          label: 'Local Mode', 
          dotColor: 'bg-amber-500', 
          pillBg: 'bg-amber-50/50', 
          textColor: 'text-amber-700',
          borderColor: 'border-amber-100',
          isSyncing: false
        };
      case 'invalid_config':
        return { 
          label: 'Registry Error', 
          dotColor: 'bg-red-500', 
          pillBg: 'bg-red-50/50', 
          textColor: 'text-red-700',
          borderColor: 'border-red-100',
          isSyncing: false
        };
      default:
        return { 
          label: 'Disconnected', 
          dotColor: 'bg-gray-400', 
          pillBg: 'bg-gray-50/50', 
          textColor: 'text-gray-700',
          borderColor: 'border-gray-100',
          isSyncing: false
        };
    }
  };

  const status = getStatusConfig(connectionStatus);

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black overflow-x-hidden">
      {/* Universal Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-[110] flex items-center justify-between px-4 lg:px-10">
         <div className="flex items-center space-x-3 md:space-x-6">
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)} 
             className="p-2 text-[#A68E74] hover:bg-black/5 rounded-full transition-colors active:scale-90"
             aria-label="Toggle Navigation"
           >
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
           <Link to="/" className="font-serif text-lg md:text-xl tracking-tighter truncate max-w-[120px] md:max-w-none">AEVO Atelier</Link>
         </div>
         
         <div className="flex items-center space-x-3 md:space-x-8">
           {/* Connection Status Pill - Visible on all screens */}
           <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${status.pillBg} ${status.borderColor} ${status.textColor}`}>
              <div className="relative">
                <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${status.isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
                {status.isSyncing && (
                   <div className="absolute inset-0 rounded-full border-t border-blue-400 animate-spin" />
                )}
              </div>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black whitespace-nowrap">
                {status.label}
              </span>
           </div>

           {/* Artisan Info - Hidden on smallest mobile screens to save space */}
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[7px] uppercase tracking-[0.2em] font-black text-black/30 leading-none">Artisan</span>
             <span className="text-[9px] font-bold text-[#A68E74] truncate max-w-[100px] md:max-w-[150px]">{user?.email?.split('@')[0]}</span>
           </div>
         </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
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
             <span>Terminate</span>
             <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
           </button>
           <Link 
             to="/" 
             className="flex items-center justify-between group px-5 py-3 border border-black/5 rounded-xl hover:bg-black hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black"
           >
             <span>Exit Portal</span>
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 lg:p-16 pt-24 lg:pt-24">
          {/* Authorization Check Feedback */}
          {!isAdmin && user && (
            <div className="mb-12 bg-amber-50 border border-amber-200 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center animate-fadeInUp">
               <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Info className="w-6 h-6" />
               </div>
               <div className="flex-1 space-y-1 text-center md:text-left">
                  <h4 className="text-amber-900 font-serif text-lg italic">Restricted Registry Access</h4>
                  <p className="text-amber-800/60 text-[10px] font-medium uppercase tracking-widest leading-relaxed">
                    Your session is valid, but your artisan profile is not marked as <span className="text-amber-900 font-black underline">Admin</span>. 
                    Registry data is hidden for protection.
                  </p>
               </div>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
