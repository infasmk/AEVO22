
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Banner } from '../../types';
import { X, Search } from '../../components/Icons';

const AdminBanners: React.FC = () => {
  const { banners, upsertBanner, deleteBanner } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

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
      setFormData({ title: '', subtitle: '', image_url: '', tag_label: 'New Arrival', display_order: banners.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Construct a complete Banner object ensuring the required 'id' is present.
    // Use existing ID if editing, otherwise generate a new one.
    const finalBanner = {
      ...formData,
      id: editingBanner ? editingBanner.id : Math.random().toString(36).substr(2, 9)
    } as Banner;
    
    await upsertBanner(finalBanner);
    setIsModalOpen(false);
  };

  return (
    <div className="p-12 space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif mb-4">Showcase Management</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Curate the Cinematic Entry Experience</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#C5A059] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
        >
          Add Hero Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map(banner => (
          <div key={banner.id} className="group relative bg-[#1F1E1D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-[#C5A059]/30">
            <div className="aspect-video relative overflow-hidden">
              <img src={banner.image_url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1D] to-transparent" />
            </div>
            
            <div className="p-8">
              <span className="text-[#C5A059] text-[8px] uppercase tracking-[0.4em] font-bold mb-4 block">{banner.tag_label}</span>
              <h3 className="text-2xl font-serif mb-2">{banner.title}</h3>
              <p className="text-white/40 text-sm italic font-light mb-8">{banner.subtitle}</p>
              
              <div className="flex space-x-4">
                <button onClick={() => openModal(banner)} className="text-[9px] uppercase tracking-widest font-bold border-b border-[#C5A059] pb-1 hover:text-[#C5A059] transition-all">Edit Asset</button>
                <button onClick={() => deleteBanner(banner.id)} className="text-[9px] uppercase tracking-widest font-bold border-b border-red-500/30 pb-1 text-red-400 hover:text-red-500 transition-all">Archive</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
          <div className="bg-[#1F1E1D] w-full max-w-xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-fadeInUp">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-serif">Hero Configurator</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-white/40 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div>
                <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-3">Hero Image URL</label>
                <input 
                  className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none transition-all"
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-3">Cinema Title</label>
                  <input 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-3">Subtitle Phrase</label>
                  <input 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none"
                    value={formData.subtitle}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex justify-end space-x-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] uppercase tracking-widest font-bold opacity-40">Cancel</button>
                 <button type="submit" className="bg-[#C5A059] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Publish Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
