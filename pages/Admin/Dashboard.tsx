
import React from 'react';
// Use star import to resolve named export issues in some environments
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, UserIcon, Star, ChevronRight, TrendingUp, Shield } from '../../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products, connectionStatus } = useStore();

  const totalSales = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const data = [
    { name: 'Jan', sales: 4000000 },
    { name: 'Feb', sales: 3000000 },
    { name: 'Mar', sales: 5000000 },
    { name: 'Apr', sales: 2780000 },
    { name: 'May', sales: 1890000 },
    { name: 'Jun', sales: 2390000 },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.03] pb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl md:text-4xl font-serif text-black/90 italic">Atelier Insights</h1>
            <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${
              connectionStatus === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {connectionStatus === 'invalid_config' ? 'Config Error' : connectionStatus}
            </div>
          </div>
          <p className="text-[#A68E74] text-[9px] uppercase tracking-[0.5em] font-black">Global Performance Registry</p>
        </div>
        <div className="flex w-full md:w-auto space-x-4">
          <Link to="/admin/products" className="flex-1 md:flex-none text-center bg-white border border-black/10 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black/[0.02] transition-all">Vault</Link>
          <button className="flex-1 md:flex-none bg-black text-white px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Export</button>
        </div>
      </div>

      {/* Critical Sync Warning for User */}
      {connectionStatus === 'invalid_config' && (
        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center animate-pulse">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 flex-shrink-0">
             <Shield className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-red-800 font-bold text-base md:text-lg mb-1">Database Sync Error</h3>
            <p className="text-red-700/60 text-xs md:text-sm italic">Invalid API configuration detected. Local storage is active but remote sync is suspended.</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Asset Value', val: `₹${totalSales.toLocaleString('en-IN')}`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Commissions', val: totalOrders, icon: <ShoppingBag className="w-4 h-4" />, color: 'text-black/80' },
          { label: 'Average Ticket', val: `₹${totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}`, icon: <Star className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Vault Count', val: totalProducts, icon: <UserIcon className="w-4 h-4" />, color: 'text-black/80' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/[0.04] shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] uppercase tracking-[0.3em] text-black/40 font-black">{stat.label}</span>
              <div className={`${stat.color} opacity-40`}>{stat.icon}</div>
            </div>
            <p className="text-lg md:text-2xl font-serif text-black/90 italic tracking-tighter truncate">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-black/[0.04] shadow-sm">
          <div className="flex justify-between items-center mb-12">
             <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30">Valuation Trajectory</h3>
             <span className="text-[8px] text-[#A68E74] font-bold uppercase tracking-widest bg-[#A68E74]/5 px-3 py-1 rounded-full">+12%</span>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.4)', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.4)', fontWeight: 700 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.01)' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Bar dataKey="sales" fill="#A68E74" radius={[8, 8, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-black/[0.04] shadow-sm">
           <div className="flex justify-between items-center mb-12">
             <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30">Acquisition Velocity</h3>
             <span className="text-[8px] text-black/40 font-bold uppercase tracking-widest bg-black/5 px-3 py-1 rounded-full">Live</span>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.4)', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.4)', fontWeight: 700 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={2.5} dot={{ fill: '#A68E74', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
