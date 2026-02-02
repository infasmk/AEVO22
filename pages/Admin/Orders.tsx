
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Order } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ id: string, status: Order['status'] } | null>(null);

  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Artisan Prep': return 'bg-[#A68E74]/10 text-[#A68E74] border-[#A68E74]/20';
      default: return 'bg-black/5 text-black/30 border-black/10';
    }
  };

  const handleStatusUpdate = (id: string, status: Order['status']) => {
    setConfirm({ id, status });
  };

  const executeStatusUpdate = async () => {
    if (!confirm) return;
    await updateOrderStatus(confirm.id, confirm.status);
    setToast({ message: `Protocol set to ${confirm.status}`, type: 'success' });
    setConfirm(null);
  };

  return (
    <div className="space-y-10 lg:space-y-16 animate-fadeIn pb-24">
      <div className="border-b border-black/[0.05] pb-10">
        <h1 className="text-3xl lg:text-5xl font-serif text-black italic">Acquisition Ledger</h1>
        <p className="text-[#A68E74] text-[9px] lg:text-[11px] uppercase tracking-[0.6em] font-black mt-2">Monitor and Fulfill Global Commissions</p>
      </div>

      <div className="bg-white border border-black/5 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.4em] text-black/30 border-b border-black/5 bg-[#FDFBF9]/50">
                <th className="px-10 py-8 font-black">Client Protocol</th>
                <th className="px-10 py-8 font-black">Archive Pieces</th>
                <th className="px-10 py-8 font-black">Investment</th>
                <th className="px-10 py-8 font-black">Status Logic</th>
                <th className="px-10 py-8 font-black">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-[#F9F7F5]/30 transition-colors group">
                  <td className="px-10 py-10">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-bold text-black/80">{order.user_name}</span>
                      <span className="text-[9px] text-black/20 font-mono tracking-wider">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex flex-wrap gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-black/[0.02] p-2 rounded-xl border border-black/[0.03]">
                          <div className="w-10 h-10 rounded-lg bg-white border border-black/5 overflow-hidden flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-cover mix-blend-multiply opacity-60 group-hover:opacity-100 transition-all" />
                          </div>
                          <span className="text-[10px] text-black/50 font-black uppercase tracking-widest">{item.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <span className="text-base font-serif italic text-black/70">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-10 py-10">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                      className={`text-[9px] uppercase tracking-[0.2em] font-black px-5 py-2.5 rounded-full border outline-none cursor-pointer appearance-none transition-all shadow-sm ${getStatusStyles(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Artisan Prep">Artisan Prep</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-10 py-10">
                    <span className="text-black/20 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-black/15 uppercase tracking-[0.8em] text-[11px] font-black italic">The acquisition archive is currently silent</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          isOpen={!!confirm}
          title="Update Protocol"
          message={`Confirm the shift to "${confirm.status}" for this client commission? This action will be memorialized in the global ledger.`}
          onConfirm={executeStatusUpdate}
          onCancel={() => setConfirm(null)}
          type="info"
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminOrders;
