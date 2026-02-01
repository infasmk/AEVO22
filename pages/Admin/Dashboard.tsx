
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { ShoppingBag, UserIcon, Star, ChevronRight } from '../../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products } = useStore();

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
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif mb-2 italic">Atelier Insights</h1>
          <p className="text-black/30 text-[9px] uppercase tracking-[0.6em] font-black">Performance Analytics</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/admin/products" className="text-black/40 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 hover:bg-black/5 transition-all">Enroll Product</Link>
          <button className="bg-black text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Download Report</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Portfolio Val', val: `₹${totalSales.toLocaleString('en-IN')}`, icon: <Star />, color: 'text-black' },
          { label: 'Commissions', val: totalOrders, icon: <ShoppingBag />, color: 'text-[#A68E74]' },
          { label: 'Avg Ticket', val: `₹${totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}`, icon: <Star />, color: 'text-black' },
          { label: 'Vault Count', val: totalProducts, icon: <UserIcon />, color: 'text-[#A68E74]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[7px] uppercase tracking-[0.3em] text-black/20 font-black">{stat.label}</span>
              <div className={`${stat.color} opacity-20`}>{stat.icon}</div>
            </div>
            <p className="text-xl md:text-2xl font-light tracking-tighter text-black/80">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-black/[0.04] shadow-sm">
          <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 mb-12">Capital Flow Projection</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.2)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.2)' }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.01)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1rem', fontSize: '10px' }} />
                <Bar dataKey="sales" fill="#A68E74" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-black/[0.04] shadow-sm">
          <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 mb-12">Acquisition Velocity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.2)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.2)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1rem', fontSize: '10px' }} />
                <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={1.5} dot={{ fill: '#A68E74', strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
