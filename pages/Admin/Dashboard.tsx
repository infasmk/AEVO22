
import React, { useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, TrendingUp, Shield } from '../../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products, connectionStatus } = useStore();

  const totalSales = useMemo(() => orders.reduce((acc, o) => acc + (o.total_amount || 0), 0), [orders]);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  // Process real orders into monthly chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      last6Months.push({
        name: months[monthIdx],
        sales: 0,
        orders: 0
      });
    }

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthName = months[date.getMonth()];
      const dataPoint = last6Months.find(d => d.name === monthName);
      if (dataPoint) {
        dataPoint.sales += (order.total_amount || 0);
        dataPoint.orders += 1;
      }
    });

    // If no orders, provide a tiny bit of dummy structure so chart doesn't break, 
    // but label it clearly as "Waiting for Data"
    return last6Months;
  }, [orders]);

  const hasRealData = orders.length > 0;

  return (
    <div className="space-y-10 lg:space-y-16 animate-fadeIn pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-black/[0.04] pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl lg:text-5xl font-serif text-black italic">Atelier Insights</h1>
            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
              hasRealData ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {hasRealData ? 'Registry Live' : 'Waiting for Data'}
            </div>
          </div>
          <p className="text-[#A68E74] text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-black">Performance Audit Portal</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <Link to="/admin/products" className="flex-1 md:flex-none text-center bg-white border border-black/10 px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Inventory Vault</Link>
          <button className="flex-1 md:flex-none bg-black text-white px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all">Sync Registry</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {[
          { label: 'Registry Value', val: `₹${totalSales.toLocaleString('en-IN')}`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Commissions', val: totalOrders, icon: <ShoppingBag className="w-4 h-4" />, color: 'text-black' },
          { label: 'Avg investment', val: `₹${totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}`, icon: <Star className="w-4 h-4" />, color: 'text-[#A68E74]' },
          { label: 'Active pieces', val: totalProducts, icon: <Shield className="w-4 h-4" />, color: 'text-black' },
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

      {/* Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-black/[0.04] shadow-sm">
          <div className="flex justify-between items-center mb-16">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Registry Trajectory</h3>
             <div className="flex items-center gap-3">
               <span className="text-[9px] text-[#A68E74] font-bold uppercase tracking-widest bg-[#A68E74]/5 px-4 py-1.5 rounded-full">
                 {hasRealData ? 'Live Data' : 'Historical Sample'}
               </span>
             </div>
          </div>
          <div className="h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Bar dataKey="sales" fill="#A68E74" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-black/[0.04] shadow-sm">
           <div className="flex justify-between items-center mb-16">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Acquisition Velocity</h3>
             <span className="text-[9px] text-black/40 font-bold uppercase tracking-widest bg-black/5 px-4 py-1.5 rounded-full">Order Frequency</span>
          </div>
          <div className="h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.3)', fontWeight: 800 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Line type="monotone" dataKey="orders" stroke="#000" strokeWidth={3} dot={{ fill: '#A68E74', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
