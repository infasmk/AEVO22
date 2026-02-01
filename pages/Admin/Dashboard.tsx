
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
    <div className="p-12 space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif mb-4">Command Center</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Global Horological Performance</p>
        </div>
        <div className="flex space-x-6">
          <Link to="/admin/products" className="bg-white/5 text-white/60 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all">Add Product</Link>
          <button className="bg-[#C5A059] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Export Portfolio</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Portfolio Value', val: `₹${totalSales.toLocaleString('en-IN')}`, icon: <Star />, change: '+12.5%', up: true },
          { label: 'Luxury Commissions', val: totalOrders, icon: <ShoppingBag />, change: '+5%', up: true },
          { label: 'Average Acquisition', val: `₹${totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}`, icon: <Star />, change: '-2%', up: false },
          { label: 'Active Vault Assets', val: totalProducts, icon: <UserIcon />, change: 'Steady', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1F1E1D] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">{stat.label}</span>
              <div className="text-[#C5A059] opacity-40">{stat.icon}</div>
            </div>
            <p className="text-4xl font-light tracking-tighter text-white mb-2">{stat.val}</p>
            <span className={`text-[10px] font-bold tracking-widest uppercase ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-[#1F1E1D] p-10 rounded-[2.5rem] border border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-12">Revenue Flow Pattern (₹)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#1F1E1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} />
                <Bar dataKey="sales" fill="#C5A059" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1F1E1D] p-10 rounded-[2.5rem] border border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-12">Sales Momentum Vector</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1E1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} />
                <Line type="monotone" dataKey="sales" stroke="#C5A059" strokeWidth={3} dot={{ fill: '#C5A059', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-[#1F1E1D] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Recent Commissions</h3>
          <Link to="/admin/orders" className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] border-b border-[#C5A059]/20 pb-1">Review All Records</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-white/20 border-b border-white/5">
                <th className="px-10 py-6 font-bold">Client Name</th>
                <th className="px-10 py-6 font-bold">Valuation</th>
                <th className="px-10 py-6 font-bold">Protocol Status</th>
                <th className="px-10 py-6 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{order.user_name}</span>
                      <span className="text-[10px] text-white/20 font-mono uppercase">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-serif text-white">₹{order.total_amount.toLocaleString('en-IN')}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <Link to="/admin/orders" className="p-2 hover:bg-white/10 rounded-full transition-colors inline-block"><ChevronRight className="w-4 h-4 text-[#C5A059]" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
