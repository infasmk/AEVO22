
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, UserIcon, Star, TrendingUp, Shield } from '../../components/Icons';
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
    <div className="space-y-10 lg:space-y-16 animate-fadeIn pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-black/[0.04] pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl lg:text-5xl font-serif text-black italic">Atelier Insights</h1>
            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
              connectionStatus === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {connectionStatus === 'invalid_config' ? 'Registry Failure' : connectionStatus}
            </div>
          </div>
          <p className="text-[#A68E74] text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-black">Performance Audit Portal</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <Link to="/admin/products" className="flex-1 md:flex-none text-center bg-white border border-black/10 px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white hover:shadow-xl transition-all active:scale-95">Vault Access</Link>
          <button className="flex-1 md:flex-none bg-black text-white px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all active:scale-95">Generate Audit</button>
        </div>
      </div>

      {/* Sync Warning */}
      {connectionStatus === 'invalid_config' && (
        <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center animate-pulse">
          <div className="w-16 h-16 bg-red-100 rounded-[1.5rem] flex items-center justify-center text-red-500 flex-shrink-0">
             <Shield className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-2">
            <h3 className="text-red-900 font-serif text-2xl italic">Sync Protocol Failure</h3>
            <p className="text-red-700/60 text-xs lg:text-sm font-medium tracking-wide">Registry configuration is currently invalid. Changes are being persisted to local storage only.</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {[
          { label: 'Registry Value', val: `₹${totalSales.toLocaleString('en-IN')}`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Commissions', val: totalOrders, icon: <ShoppingBag className="w-4 h-4" />, color: 'text-black' },
          { label: 'Avg investment', val: `₹${totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}`, icon: <Star className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Active pieces', val: totalProducts, icon: <UserIcon className="w-4 h-4" />, color: 'text-black' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-black/[0.03] shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-10">
              <span className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-black">{stat.label}</span>
              <div className={`${stat.color} opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}>{stat.icon}</div>
            </div>
            <p className="text-2xl lg:text-3xl font-serif text-black/90 italic tracking-tighter truncate">{stat.val}</p>
            <div className="mt-4 h-1 w-8 bg-[#A68E74]/10 rounded-full group-hover:w-16 transition-all duration-700" />
          </div>
        ))}
      </div>

      {/* High-Resolution Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-black/[0.04] shadow-sm">
          <div className="flex justify-between items-center mb-16">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Valuation Trajectory</h3>
             <div className="flex items-center gap-3">
               <span className="text-[9px] text-[#A68E74] font-bold uppercase tracking-widest bg-[#A68E74]/5 px-4 py-1.5 rounded-full">Exceeding Q1</span>
             </div>
          </div>
          <div className="h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800, letterSpacing: '0.1em' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="sales" fill="#A68E74" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-black/[0.04] shadow-sm">
           <div className="flex justify-between items-center mb-16">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Acquisition Velocity</h3>
             <span className="text-[9px] text-black/40 font-bold uppercase tracking-widest bg-black/5 px-4 py-1.5 rounded-full">Realtime Engine</span>
          </div>
          <div className="h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800, letterSpacing: '0.1em' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={3} dot={{ fill: '#A68E74', strokeWidth: 0, r: 5 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
