
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ShoppingBag, Star, UserIcon, Shield } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <Star className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase (Banners)', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
    { name: 'Orders', path: '/admin/orders', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#1A1918]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1F1E1D] border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="text-2xl font-serif text-white tracking-tighter">AEVO <span className="text-[10px] uppercase tracking-widest text-[#C5A059] ml-2 font-bold">Atelier</span></Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 text-[10px] uppercase tracking-[0.2em] font-bold ${
                location.pathname === link.path ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <Link to="/" className="text-white/20 text-[8px] uppercase tracking-[0.4em] hover:text-[#C5A059] transition-colors">Return to Site</Link>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto bg-[#1A1918] text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
