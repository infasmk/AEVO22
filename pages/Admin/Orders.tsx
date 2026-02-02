
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
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      <div className="border-b border-black/[0.05] pb-8">
        <h1 className="text-2xl md:text-4xl font-serif mb-2 text-black italic">Acquisition Ledger</h1>
        <p className="text-[#A68E74] text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black">Monitor and Fulfill Global Commissions</p>
      </div>

      <div className="bg-white border border-black/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
        {/* Table Wrapper for Horizontal Scroll on Mobile */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-black/30 border-b border-black/5">
                <th className="px-6 md:px-8 py-5 md:py-6 font-black">Client / Order ID</th>
                <th className="px-6 md:px-8 py-5 md:py-6 font-black">Commissioned Pieces</th>
                <th className="px-6 md:px-8 py-5 md:py-6 font-black">Investment</th>
                <th className="px-6 md:px-8 py-5 md:py-6 font-black">Protocol Status</th>
                <th className="px-6 md:px-8 py-5 md:py-6 font-black">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-black/[0.01] transition-colors group">
                  <td className="px-6 md:px-8 py-6 md:py-8">
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-black/80 mb-1">{order.user_name}</span>
                      <span className="text-[9px] text-black/20 font-mono">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-6 md:py-8">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F9F7F5] border border-black/5 overflow-hidden flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                          </div>
                          <span className="text-[10px] md:text-xs text-black/50 font-medium">{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-6 md:py-8">
                    <span className="text-xs md:text-sm font-serif italic text-black/70">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 md:px-8 py-6 md:py-8">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                      className={`text-[8px] md:text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-full border outline-none cursor-pointer appearance-none transition-all ${getStatusStyles(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Artisan Prep">Artisan Prep</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 md:px-8 py-6 md:py-8 text-black/20 text-[10px] font-medium">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-black/15 uppercase tracking-[0.5em] text-[10px] font-black italic">No commissions recorded in the archive</td>
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
          message={`Are you certain you wish to change the acquisition status to "${confirm.status}"? This action will be memorialized in the client registry.`}
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
