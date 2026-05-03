
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { PromotionalOffer } from '../../types';
import { Clock, Percent, Info, X, Edit3, Trash2, ArrowRight } from '../../components/Icons';
import Toast from '../../components/Toast';

const AdminPromotions: React.FC = () => {
  const { offer, upsertOffer } = useStore();
  
  const [formData, setFormData] = useState<PromotionalOffer>({
    id: 'offer-1',
    is_active: true,
    heading: '',
    paragraph: '',
    percentage: 0,
    end_time: '',
    button_text: '',
    button_link: ''
  });

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (offer) {
      setFormData(offer);
    }
  }, [offer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await upsertOffer(formData);
    if (success) {
      setToast({ message: "Promotion Registry Protocol Updated", type: 'success' });
    } else {
      setToast({ message: "Failed to Update Protocol", type: 'error' });
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-black/[0.05] pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-black italic">Promotional Protocol</h1>
          <p className="text-[#A68E74] text-[10px] uppercase tracking-[0.5em] font-black">Engagement & Rewards Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-12">
          <form onSubmit={handleSave} className="bg-white border border-black/5 rounded-[3rem] p-10 lg:p-14 shadow-sm space-y-12">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#A68E74]/10 rounded-full flex items-center justify-center text-[#A68E74]">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-serif italic">Notification Bar Status</h3>
                   <p className="text-[9px] uppercase tracking-widest text-black/30 font-black">Visibility controls</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <div className="w-14 h-7 bg-black/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A68E74]" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Campaign Heading</label>
                <input 
                  className="w-full bg-[#F9F7F5] rounded-2xl p-6 text-sm font-bold border border-black/5 focus:border-[#A68E74] outline-none shadow-inner transition-all" 
                  value={formData.heading} 
                  onChange={e => setFormData({...formData, heading: e.target.value})} 
                  placeholder="e.g. Exclusive Artisan Sale" 
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Offer Magnitude (%)</label>
                <div className="relative">
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black font-serif italic text-[#A68E74]">PERCENT</span>
                  <input 
                    type="number"
                    className="w-full bg-[#F9F7F5] rounded-2xl p-6 text-sm font-bold border border-black/5 focus:border-[#A68E74] outline-none shadow-inner transition-all" 
                    value={formData.percentage || 0} 
                    onChange={e => setFormData({...formData, percentage: Number(e.target.value)})} 
                    placeholder="e.g. 15"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Narrative Context</label>
              <textarea 
                className="w-full bg-[#F9F7F5] rounded-3xl p-8 text-sm font-light italic leading-relaxed border border-black/5 h-32 outline-none shadow-inner focus:border-[#A68E74] transition-all resize-none" 
                value={formData.paragraph} 
                onChange={e => setFormData({...formData, paragraph: e.target.value})} 
                placeholder="Briefly describe the campaign..." 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Protocol Expiration (Countdown)</label>
                <div className="relative">
                  <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-black/10 w-5 h-5" />
                  <input 
                    type="datetime-local" 
                    className="w-full bg-[#F9F7F5] pl-16 pr-6 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-black/5 focus:border-[#A68E74] outline-none shadow-inner transition-all cursor-pointer" 
                    value={formData.end_time?.slice(0, 16) || ''} 
                    onChange={e => {
                      if (!e.target.value) {
                        setFormData({...formData, end_time: ''});
                        return;
                      }
                      try {
                        setFormData({...formData, end_time: new Date(e.target.value).toISOString()});
                      } catch (err) {
                        setFormData({...formData, end_time: ''});
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Status Indicator</label>
                <div className="w-full bg-black/[0.02] border border-black/[0.03] rounded-2xl p-6 flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-black text-black/40">
                    {formData.is_active ? 'Protocol Active' : 'Protocol Suspended'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-black/[0.03]">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Action Trigger Label</label>
                <input 
                  className="w-full bg-[#F9F7F5] rounded-2xl p-6 text-sm font-bold border border-black/5 focus:border-[#A68E74] outline-none shadow-inner transition-all" 
                  value={formData.button_text} 
                  onChange={e => setFormData({...formData, button_text: e.target.value})} 
                  placeholder="e.g. Shop the Vault" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Destination Vector</label>
                <input 
                  className="w-full bg-[#F9F7F5] rounded-2xl p-6 text-sm font-bold border border-black/5 focus:border-[#A68E74] outline-none shadow-inner transition-all" 
                  value={formData.button_link} 
                  onChange={e => setFormData({...formData, button_link: e.target.value})} 
                  placeholder="e.g. /shop" 
                />
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3 text-black/20">
                  <Info className="w-4 h-4" />
                  <span className="text-[8px] uppercase tracking-widest font-black italic">Protocol Version 8.2 • Secure Transmission</span>
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-black text-white px-16 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-black/20"
                >
                  Authorize Changes
                </button>
            </div>
          </form>
        </div>

        {/* Live Preview Interface */}
        <div className="lg:col-span-12 space-y-6">
           <h3 className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black px-4">Live Protocol Simulation</h3>
           <div className={`w-full bg-[#F9F7F5] border border-black/5 rounded-[2rem] p-1 shadow-inner h-24 flex items-center justify-center overflow-hidden transition-opacity ${formData.is_active ? 'opacity-100' : 'opacity-40'}`}>
              {!formData.is_active ? (
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 italic">Notification Bar: Deactivated</span>
              ) : (
                <div className="bg-black text-white w-full h-full rounded-[1.8rem] flex items-center justify-center px-8 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A68E74]/30 to-transparent" />
                   <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-3">
                         <div className="bg-[#A68E74] text-black p-1 rounded-sm flex items-center justify-center">
                            {formData.percentage ? <span className="text-[10px] font-black">{formData.percentage}%</span> : <Percent className="w-3 h-3" />}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em]">{formData.heading || 'Heading Component'}</p>
                      </div>
                      <p className="text-[10px] uppercase font-medium tracking-widest text-white/50 hidden md:block">{formData.paragraph || 'Expository paragraph details will appear here.'}</p>
                      {formData.button_text && (
                        <div className="flex items-center space-x-2 text-[9px] uppercase font-black tracking-widest text-[#A68E74]">
                          <span>{formData.button_text}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminPromotions;
