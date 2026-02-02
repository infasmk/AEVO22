import React, { useState } from 'react';
// Use star import to resolve named export issues in some environments
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, UserIcon, Shield, Menu, X } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connectionStatus } = useStore();

  const links = [
    { name: 'Insights', path: '/admin', icon: <Star className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
    { name: 'Ledger', path: '/admin/orders', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black">
      {/* Mobile Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-black/5 z-[110] flex items-center justify-between px-6">
         <span className="font-serif text-xl tracking-tighter">AEVO Atelier</span>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#A68E74]">
           {sidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar - Light Atelier */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-black/[0.05] flex flex-col z-[100] transition-transform duration-500 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-black/[0.03] hidden lg:block">
          <Link to="/" className="text-xl font-serif text-black tracking-tighter">AEVO <span className="text-[7px] uppercase tracking-widest text-[#A68E74] ml-2 font-black">Atelier</span></Link>
        </div>
        
        <nav className="flex-1 p-6 lg:pt-8 pt-20 space-y-1.5">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-300 text-[8px] uppercase tracking-[0.3em] font-black ${
                location.pathname === link.path ? 'bg-[#A68E74] text-white shadow-lg' : 'text-black/25 hover:text-black hover:bg-black/[0.02]'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Status */}
        <div className="p-8 border-t border-black/[0.03] space-y-4">
           <div className="flex items-center space-x-3">
              <div className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  connectionStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
              </div>
              <span className="text-[7px] uppercase tracking-widest font-black text-black/20">
                {connectionStatus === 'online' ? 'Linked' : 'Syncing'}
              </span>
           </div>
           <Link to="/" className="text-black/15 text-[7px] uppercase tracking-[0.5em] font-black hover:text-[#A68E74] transition-colors block">Exit Atelier</Link>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 lg:p-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;