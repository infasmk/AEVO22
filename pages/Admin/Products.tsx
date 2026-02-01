
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Product, ProductTag, KeyFeature, Category } from '../../types';
// Add Star to the imported icons
import { X, Search, Plus, Trash2, Edit3, Image as ImageIcon, Settings, Info, Star } from '../../components/Icons';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';

const AdminProducts: React.FC = () => {
  const { products, categories, upsertProduct, deleteProduct, upsertCategory, deleteCategory } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);
  const [features, setFeatures] = useState<KeyFeature[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [newCatName, setNewCatName] = useState('');

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({ ...p });
      setSpecs(Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })));
      setFeatures(p.key_features || []);
      setImageUrls(p.images.length > 0 ? p.images : ['']);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, category: categories.length > 0 ? categories[0].name : 'Luxury Series',
        tag: 'Latest', description: '', stock: 10, images: []
      });
      setSpecs([{ key: 'Movement', value: '' }, { key: 'Material', value: '' }]);
      setFeatures([{ title: 'Artisanal Build', description: 'Hand-crafted by master horologists.' }]);
      setImageUrls(['']);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const specsObj: Record<string, string> = {};
    specs.forEach(s => { if(s.key.trim()) specsObj[s.key] = s.value; });

    const finalProduct = {
      ...formData,
      images: imageUrls.filter(url => url.trim() !== ''),
      specs: specsObj,
      key_features: features.filter(f => f.title.trim() !== ''),
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      rating: editingProduct ? editingProduct.rating : 5,
      reviews_count: editingProduct ? editingProduct.reviews_count : 0,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString()
    } as Product;

    const success = await upsertProduct(finalProduct);
    if (success) {
      setToast({ message: editingProduct ? "Piece Refined" : "New Piece Cataloged", type: 'success' });
      setIsModalOpen(false);
    } else {
      setToast({ message: "Registry Error", type: 'error' });
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const success = await upsertCategory({ id: `cat-${Date.now()}`, name: newCatName });
    if (success) {
      setNewCatName('');
      setToast({ message: "Series Enrolled", type: 'success' });
    }
  };

  const triggerDeleteProduct = (id: string, name: string) => {
    setConfirm({
      title: "Decommission Piece",
      message: `Are you certain you wish to purge "${name}" from the active registry? This action is permanent.`,
      onConfirm: async () => {
        const success = await deleteProduct(id);
        if (success) setToast({ message: "Piece Purged", type: 'success' });
      }
    });
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.03] pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif mb-2 text-black/90 italic">Inventory Ledger</h1>
          <p className="text-[#A68E74] text-[9px] uppercase tracking-[0.5em] font-black">Curating the Instruments of Time</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button onClick={() => setIsCategoryModalOpen(true)} className="flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-black/10 hover:bg-black/[0.02] transition-all">Series Portal</button>
          <button onClick={() => openModal()} className="flex-1 md:flex-none bg-black text-white px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">New Piece</button>
        </div>
      </div>

      {/* Search Header */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 w-4 h-4" />
        <input 
          type="text" placeholder="Filter vault by designation..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-2xl text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-[#A68E74] shadow-sm transition-all"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List - Mobile Optimized */}
      <div className="bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.3em] text-black/30 border-b border-black/5 bg-[#FDFBF9]">
                <th className="px-8 py-6 font-black">Timepiece</th>
                <th className="px-8 py-6 font-black text-center">Series</th>
                <th className="px-8 py-6 font-black text-center">Valuation</th>
                <th className="px-8 py-6 font-black text-center">Stock</th>
                <th className="px-8 py-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                <tr key={product.id} className="hover:bg-black/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-black/5 bg-[#FDFBF7]">
                        <img src={product.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-black/80">{product.name}</span>
                        <span className="text-[8px] uppercase tracking-widest text-[#A68E74] font-black">{product.tag}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-[10px] font-bold text-black/40 uppercase tracking-widest">{product.category}</td>
                  <td className="px-8 py-6 text-center text-sm font-medium text-black/60">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${product.stock <= 5 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{product.stock} units</span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-4">
                    <button onClick={() => openModal(product)} className="text-[#A68E74] hover:text-black transition-colors"><Edit3 className="w-4 h-4 inline" /></button>
                    <button onClick={() => triggerDeleteProduct(product.id, product.name)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-0 md:p-6 bg-white/80 backdrop-blur-xl overflow-y-auto">
          <div className="bg-white w-full max-w-5xl md:rounded-[3rem] shadow-2xl border-x border-black/5 animate-fadeInUp min-h-screen md:min-h-0">
            <div className="sticky top-0 z-30 p-8 border-b border-black/5 flex justify-between items-center bg-white/90 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-serif italic text-black/80">{editingProduct ? 'Refine Masterpiece' : 'Enroll New Piece'}</h2>
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#A68E74] font-black mt-1">Instrument Specification Portal</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-black/5 rounded-full transition-all border border-black/5 shadow-sm"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-8 md:p-12 space-y-12 pb-32 md:pb-12">
               {/* Core Info */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black flex items-center gap-2"><Plus className="w-3 h-3" /> Designation</label>
                      <input className="w-full bg-[#FDFBF9] rounded-2xl p-5 text-sm font-bold border border-black/[0.03] focus:border-[#A68E74] transition-all outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Chronos Obsidian VIII" required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black flex items-center gap-2"><Info className="w-3 h-3" /> Narrative Description</label>
                      <textarea className="w-full bg-[#FDFBF9] rounded-2xl p-5 text-sm font-light italic leading-relaxed border border-black/[0.03] focus:border-[#A68E74] transition-all outline-none h-32" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the soul of this timepiece..." required />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black">Valuation (INR)</label>
                      <input type="number" className="w-full bg-[#FDFBF9] rounded-2xl p-5 text-sm font-bold border border-black/[0.03] focus:border-[#A68E74] outline-none" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black">Series Allocation</label>
                      <select className="w-full bg-[#FDFBF9] rounded-2xl p-5 text-[10px] uppercase font-black tracking-widest border border-black/[0.03] focus:border-[#A68E74] outline-none" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black">Status Tag</label>
                      <select className="w-full bg-[#FDFBF9] rounded-2xl p-5 text-[10px] uppercase font-black tracking-widest border border-black/[0.03] focus:border-[#A68E74] outline-none" value={formData.tag || 'Latest'} onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}>
                        <option value="Latest">Latest Acquisition</option>
                        <option value="Best Seller">High Momentum</option>
                        <option value="Offer">Limited Offer</option>
                        <option value="New Arrival">Arrival</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
               </div>

               {/* Imagery */}
               <div className="space-y-6">
                 <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Visual Assets (URLs)</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {imageUrls.map((url, i) => (
                     <div key={i} className="flex gap-2">
                       <input className="flex-1 bg-[#FDFBF9] rounded-xl p-4 text-[10px] border border-black/[0.03] outline-none" value={url} onChange={e => {
                         const newUrls = [...imageUrls];
                         newUrls[i] = e.target.value;
                         setImageUrls(newUrls);
                       }} placeholder="https://image-source.com/..." />
                       {imageUrls.length > 1 && (
                         <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="p-3 text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       )}
                     </div>
                   ))}
                 </div>
                 <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20 pb-1">+ Add Angle</button>
               </div>

               {/* Dynamic Specs & Features */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-black/5">
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black flex items-center gap-2"><Settings className="w-3 h-3" /> Technical Specs</label>
                    <div className="space-y-3">
                      {specs.map((s, i) => (
                        <div key={i} className="flex gap-3">
                          <input className="w-1/3 bg-[#FDFBF9] rounded-xl p-4 text-[9px] uppercase font-black border border-black/[0.03]" placeholder="Key (e.g. Weight)" value={s.key} onChange={e => {
                             const newSpecs = [...specs];
                             newSpecs[i].key = e.target.value;
                             setSpecs(newSpecs);
                          }} />
                          <input className="flex-1 bg-[#FDFBF9] rounded-xl p-4 text-[10px] font-medium border border-black/[0.03]" placeholder="Value (e.g. 1.2kg)" value={s.value} onChange={e => {
                             const newSpecs = [...specs];
                             newSpecs[i].value = e.target.value;
                             setSpecs(newSpecs);
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20 pb-1">+ Add Specification</button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black flex items-center gap-2"><Star className="w-3 h-3" /> Artisanal Features</label>
                    <div className="space-y-4">
                      {features.map((f, i) => (
                        <div key={i} className="p-6 bg-[#FDFBF9] rounded-2xl border border-black/[0.03] space-y-4 relative">
                           <input className="w-full bg-transparent font-serif text-lg text-black/80 outline-none" placeholder="Feature Title" value={f.title} onChange={e => {
                             const newF = [...features];
                             newF[i].title = e.target.value;
                             setFeatures(newF);
                           }} />
                           <textarea className="w-full bg-transparent text-[10px] text-black/40 uppercase tracking-widest leading-relaxed outline-none h-16" placeholder="Feature description..." value={f.description} onChange={e => {
                             const newF = [...features];
                             newF[i].description = e.target.value;
                             setFeatures(newF);
                           }} />
                           <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-black/10 hover:text-red-400"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFeatures([...features, { title: '', description: '' }])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20 pb-1">+ Add Artisanal Note</button>
                    </div>
                  </div>
               </div>

               <div className="flex justify-end pt-12 border-t border-black/5 space-x-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors">Abort Sync</button>
                 <button type="submit" className="bg-[#A68E74] text-white px-12 py-5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Commit to Registry</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Series Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-black/5 p-10 animate-scaleIn">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-serif italic">Series Portal</h3>
                <p className="text-[8px] uppercase tracking-widest text-black/30 mt-1">Classification Management</p>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-4 h-4 text-black/20 hover:text-black" /></button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-[#FDFBF9] rounded-xl p-4 text-[10px] uppercase font-black tracking-widest border border-black/[0.05] outline-none" 
                  placeholder="New Series Name..." 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                />
                <button onClick={handleAddCategory} className="bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Enroll</button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-[#FDFBF9] rounded-xl border border-black/[0.02]">
                    <span className="text-[10px] uppercase tracking-widest font-black text-black/60">{cat.name}</span>
                    <button onClick={async () => {
                      const success = await deleteCategory(cat.id);
                      if (success) setToast({ message: "Series Retired", type: 'success' });
                    }} className="text-red-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          isOpen={!!confirm} title={confirm.title} message={confirm.message}
          onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProducts;
