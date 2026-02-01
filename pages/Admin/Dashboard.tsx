
import React from 'react';
import { useStore } from '../../store';
import { ShoppingBag, UserIcon, Star, ChevronRight } from '../../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products } = useStore();

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Executive Dashboard</h1>
        <div className="flex space-x-4">
          <button className="bg-white px-4 py-2 border border-[#F5F1E9] text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7]">Export Report</button>
          <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059]">Add Product</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow-sm border border-[#F5F1E9]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Revenue</span>
            <div className="p-2 bg-[#FDFBF7] text-[#C5A059] rounded-lg"><Star className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-light mb-1">${totalSales.toLocaleString()}</p>
          <span className="text-xs text-green-500 font-medium">+12.5% from last month</span>
        </div>
        <div className="bg-white p-6 shadow-sm border border-[#F5F1E9]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Orders</span>
            <div className="p-2 bg-[#FDFBF7] text-[#C5A059] rounded-lg"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-light mb-1">{totalOrders}</p>
          <span className="text-xs text-green-500 font-medium">+5% from last month</span>
        </div>
        <div className="bg-white p-6 shadow-sm border border-[#F5F1E9]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Average Order</span>
            <div className="p-2 bg-[#FDFBF7] text-[#C5A059] rounded-lg"><Star className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-light mb-1">${(totalSales / totalOrders).toFixed(2)}</p>
          <span className="text-xs text-red-500 font-medium">-2% from last month</span>
        </div>
        <div className="bg-white p-6 shadow-sm border border-[#F5F1E9]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Products</span>
            <div className="p-2 bg-[#FDFBF7] text-[#C5A059] rounded-lg"><UserIcon className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-light mb-1">{totalProducts}</p>
          <span className="text-xs text-gray-400 font-medium">8 out of stock</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-[#F5F1E9]">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-10">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F1E9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip cursor={{ fill: '#FDFBF7' }} contentStyle={{ border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#C5A059" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 border border-[#F5F1E9]">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-10">Sales Momentum</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F1E9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="sales" stroke="#2C2A28" strokeWidth={2} dot={{ fill: '#2C2A28' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#F5F1E9]">
        <div className="p-6 border-b border-[#F5F1E9] flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest">Recent Orders</h3>
          <button className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-[#F5F1E9]">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F1E9]">
              {orders.map(order => (
                <tr key={order.id} className="text-sm hover:bg-[#FDFBF7] transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">Customer #{order.userId}</td>
                  <td className="px-6 py-4 font-medium">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
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
