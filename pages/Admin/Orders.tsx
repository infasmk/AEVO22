
import React from 'react';
import { useStore } from '../../store';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Artisan Prep': return 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="p-12 space-y-12 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-serif mb-4">Acquisition Ledger</h1>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Monitor and Fulfill Global Commissions</p>
      </div>

      <div className="bg-[#1F1E1D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.3em] text-white/40 border-b border-white/5">
              <th className="px-8 py-6 font-bold">Client / Order ID</th>
              <th className="px-8 py-6 font-bold">Commissioned Pieces</th>
              <th className="px-8 py-6 font-bold">Investment</th>
              <th className="px-8 py-6 font-bold">Protocol Status</th>
              <th className="px-8 py-6 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length > 0 ? orders.map(order => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white mb-1">{order.user_name}</span>
                    <span className="text-[10px] text-white/20 font-mono">{order.id}</span>
                    <span className="text-[10px] text-[#C5A059]/60 mt-1 uppercase tracking-widest">{order.user_email}</span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <img src={item.image} className="w-8 h-8 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <span className="text-xs text-white/60">{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className="text-sm font-serif text-white">₹{order.total_amount.toLocaleString('en-IN')}</span>
                </td>
                <td className="px-8 py-8">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full border outline-none cursor-pointer transition-all ${getStatusStyles(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Artisan Prep">Artisan Prep</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-8 py-8 text-white/20 text-xs">
                  {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-white/20 uppercase tracking-widest text-[10px]">No sales recorded in the ledger</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
