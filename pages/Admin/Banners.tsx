
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Banner } from '../../types';
import { X, Search, Image as ImageIcon, Trash2, Edit3, Plus } from '../../components/Icons';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';

const AdminBanners: React.FC = () => {
  const { banners, upsertBanner, deleteBanner } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image_url: '',
    tag_label: 'New Arrival',
    display_order: 0
  });

  const openModal = (b?: Banner) => {
    if (b) {
      setEditingBanner(b);
      setFormData(b);
    } else {
      setEditingBanner(null);
      setFormData({ 
        title: '', 
        subtitle: '', 
        image_url: '', 
        tag_label: 'New Arrival', 
        display_order: banners.length 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBanner = {
      ...formData,
      id: editingBanner ? editingBanner.id : Math.random().toString(36).substr(2, 9)
    } as Banner;
    
    const success = await upsertBanner(finalBanner);
    if (success) {
      setToast({ message: editingBanner ? "Hero Asset Refined" : "New Hero Asset Launched", type: 'success' });
      setIsModalOpen(false);
    } else {
      setToast({ message: "Sync Protocol Failed", type: 'error' });
    }
  };

  const triggerDelete = (id: string, title: string) => {
    setConfirm({
      title: "Archive Hero Asset",
      message: `Are you certain you wish to purge "${title}" from the cinematic showcase? This asset will be memorialized and removed from active rotation.`,
      onConfirm: async () => {
        const success = await deleteBanner(id);
        if (success) {
          setToast({ message: "Asset Purged Successfully", type: 'success' });
        } else {
          setToast({ message: "Purge Request Failed", type: 'error' });
        }
      }
    });
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-black/[0.05] pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-black italic">Showcase Registry</h1>
          <p className="text-[#A68E74] text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black mt-1">Curate the Cinematic Entrance</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-black text-white px-8 md:px-12 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:shadow-black/10 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Enroll Hero Asset
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {banners.map(banner => (
          <div key={banner.id} className="group relative bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-700">
            <div className="aspect-[21/9] md:aspect-video relative overflow-hidden bg-black">
              <img 
                src={banner.image_url} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[4s]" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-10 pointer-events-none">
                <span className="text-[#A68E74] text-[8px] md:text-[9px] uppercase tracking-[0.5em] font-black mb-3 block animate-fadeInUp">{banner.tag_label}</span>
                <h3 className="text-xl md:text-3xl font-serif mb-2 text-white italic animate-fadeInUp" style={{ animationDelay: '0.1s' }}>{banner.title}</h3>
                <p className="text-white/60 text-[10px] md:text-xs italic font-light animate-fadeInUp" style={{ animationDelay: '0.2s' }}>{banner.subtitle}</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex items-center justify-between border-t border-black/5">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black text-black/20">Active in Rotation</span>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => openModal(banner)} 
                  className="p-3 bg-black/5 text-black rounded-xl hover:bg-black hover:text-white transition-all active:scale-90"
                  title="Refine Asset"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => triggerDelete(banner.id, banner.title)} 
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="Purge Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-black/5 rounded-[3rem]">
            <p className="text-black/20 font-serif italic text-xl">The showcase gallery is currently dark.</p>
          </div>
        )}
      </div>

      {/* Configurator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal Container */}
          <div className="relative bg-[#FCFCFA] w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="px-8 md:px-10 py-6 md:py-8 border-b border-black/[0.05] flex justify-between items-center bg-[#FCFCFA]">
              <div>
                <h2 className="text-xl md:text-2xl font-serif italic text-black">Hero Configurator</h2>
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#A68E74] font-black mt-1">Cinematic Sequence Logic</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </button>
            </div>
            
            {/* Form Body */}
            <form id="bannerForm" onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar">
              
              {/* Asset Preview */}
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Perspective Snapshot</label>
                <div className="aspect-video w-full rounded-3xl bg-[#F9F7F5] border border-black/5 overflow-hidden relative group">
                  {formData.image_url ? (
                    <img src={formData.image_url} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 text-black/10">
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-[9px] uppercase tracking-widest font-black">Asset URL Required</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Data Inputs */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Visual Asset URL</label>
                  <input 
                    className="w-full bg-white rounded-2xl p-4 md:p-5 text-[11px] font-mono border border-black/10 focus:border-[#A68E74] outline-none shadow-sm transition-all"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Atelier Tag</label>
                    <select 
                      className="w-full bg-white rounded-2xl p-4 md:p-5 text-[10px] uppercase font-black border border-black/10 focus:border-[#A68E74] outline-none shadow-sm cursor-pointer"
                      value={formData.tag_label}
                      onChange={e => setFormData({...formData, tag_label: e.target.value})}
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Limited Release">Limited Release</option>
                      <option value="Artisanal Heritage">Artisanal Heritage</option>
                      <option value="Best Seller">High Momentum</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Display Sequence</label>
                    <input 
                      type="number"
                      className="w-full bg-white rounded-2xl p-4 md:p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm"
                      value={formData.display_order}
                      onChange={e => setFormData({...formData, display_order: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Cinematic Heading</label>
                  <input 
                    className="w-full bg-white rounded-2xl p-4 md:p-5 text-base md:text-lg font-serif italic border border-black/10 focus:border-[#A68E74] outline-none shadow-sm transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="The Platinum Standard..."
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Manifesto Subtitle</label>
                  <textarea 
                    className="w-full bg-white rounded-2xl p-4 md:p-5 text-sm md:text-base font-light italic border border-black/10 h-24 outline-none shadow-sm focus:border-[#A68E74] transition-all resize-none"
                    value={formData.subtitle}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Precision engineering for the modern gallery..."
                    required
                  />
                </div>
              </div>

              <div className="h-10 md:h-12" />
            </form>

            {/* Sticky Footer */}
            <div className="px-8 md:px-12 py-6 md:py-10 border-t border-black/[0.05] bg-[#FCFCFA] flex flex-col sm:flex-row items-center justify-between gap-6">
               <button 
                 type="button" 
                 onClick={() => setIsModalOpen(false)} 
                 className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.4em] text-black/20 hover:text-black transition-colors order-2 sm:order-1 active:scale-95"
               >
                 Abort Enlistment
               </button>
               <button 
                 type="submit" 
                 form="bannerForm"
                 className="w-full sm:w-auto bg-black text-white px-10 md:px-16 py-4 md:py-6 rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-black/10"
               >
                 Enroll Hero Asset
               </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          isOpen={!!confirm}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminBanners;
