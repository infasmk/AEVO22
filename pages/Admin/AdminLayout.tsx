
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ShoppingBag, Star, UserIcon, Shield, Menu, X } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <Star className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
    { name: 'Orders', path: '/admin/orders', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1918] border-b border-white/5 z-[110] flex items-center justify-between px-6">
         <span className="font-serif text-xl tracking-tighter">AEVO Atelier</span>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#C5A059]">
           {sidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#1A1918] border-r border-white/5 flex flex-col z-[100] transition-transform duration-500 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 hidden lg:block">
          <Link to="/" className="text-2xl font-serif text-white tracking-tighter">AEVO <span className="text-[9px] uppercase tracking-widest text-[#C5A059] ml-2 font-black">Atelier</span></Link>
        </div>
        
        <nav className="flex-1 p-8 lg:pt-10 pt-24 space-y-3">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 text-[9px] uppercase tracking-[0.2em] font-black ${
                location.pathname === link.path ? 'bg-[#C5A059] text-white shadow-xl shadow-[#C5A059]/20' : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-10 border-t border-white/5">
           <Link to="/" className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black hover:text-[#C5A059] transition-colors">Return to Site</Link>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 overflow-y-auto min-h-screen bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
