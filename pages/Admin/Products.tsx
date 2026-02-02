
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product, ProductTag, KeyFeature } from '../../types';
import { X, Search, Plus, Trash2, Edit3, Image as ImageIcon, Star } from '../../components/Icons';
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
  
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);
  const [features, setFeatures] = useState<KeyFeature[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [newCatName, setNewCatName] = useState('');

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({ ...p });
      setSpecs(Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })));
      setFeatures(p.key_features || []);
      setColors(p.colors || []);
      setImageUrls(p.images.length > 0 ? p.images : ['']);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, original_price: 0, category: categories.length > 0 ? categories[0].name : 'Luxury Series',
        tag: 'Latest', description: '', stock: 10, images: []
      });
      setSpecs([{ key: 'Movement', value: '' }, { key: 'Material', value: '' }]);
      setFeatures([{ title: '', description: '' }]);
      setColors(['Silver', 'Gold']);
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
      colors: colors.filter(c => c.trim() !== ''),
      specs: specsObj,
      key_features: features.filter(f => f.title.trim() !== ''),
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      rating: editingProduct ? editingProduct.rating : 5,
      reviews_count: editingProduct ? editingProduct.reviews_count : 0,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString()
    } as Product;

    const syncSuccess = await upsertProduct(finalProduct);
    if (syncSuccess) {
      setToast({ message: editingProduct ? "Piece Refined" : "Piece Enrolled Successfully", type: 'success' });
    } else {
      setToast({ message: "Saved Locally. Database sync failure.", type: 'error' });
    }
    setIsModalOpen(false);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const success = await upsertCategory({ id: `cat-${Date.now()}`, name: newCatName });
    if (success) { setNewCatName(''); setToast({ message: "Series Registered", type: 'success' }); }
  };

  return (
    <div className="space-y-6 md:space-y-12 animate-fadeIn pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.05] pb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-serif mb-2 text-black italic">Inventory Registry</h1>
          <p className="text-[#A68E74] text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black">Archive Management Portal</p>
        </div>
        <div className="flex w-full md:w-auto gap-3 md:gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-black/10 bg-white hover:bg-black/5 transition-colors">Series</button>
          <button onClick={() => openModal()} className="flex-1 md:flex-none bg-[#111111] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Enroll Piece</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-black/20 w-4 h-4 md:w-5 md:h-5" />
        <input 
          type="text" placeholder="Search the archive..."
          className="w-full pl-12 md:pl-16 pr-4 md:pr-8 py-4 md:py-5 bg-white border border-black/10 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] uppercase tracking-widest font-black outline-none focus:border-[#A68E74] shadow-sm"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
          <div key={product.id} className="bg-white border border-black/5 rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex gap-4 md:gap-6 items-center">
              <div className="w-16 h-20 md:w-20 md:h-24 bg-[#F9F7F5] rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                <img src={product.images[0]} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700" alt={product.name} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-[#A68E74] font-black mb-1 block">{product.category}</span>
                <h3 className="font-serif text-base md:text-lg text-black truncate italic">{product.name}</h3>
                <p className="text-[10px] md:text-[11px] font-bold text-black/40 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-black/5 flex justify-between items-center">
              <span className="text-[7px] md:text-[8px] uppercase font-black tracking-widest px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
                {product.stock} in Vault
              </span>
              <div className="flex space-x-2">
                <button onClick={() => openModal(product)} className="p-2 md:p-3 bg-black/5 text-black rounded-lg md:rounded-xl hover:bg-black/10 transition-colors"><Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                <button onClick={() => setConfirm({ title: "Purge Piece", message: "Confirm removal?", onConfirm: () => deleteProduct(product.id) })} className="p-2 md:p-3 bg-red-50 text-red-500 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Configurator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md overflow-hidden">
          <div className="bg-[#FCFCFA] w-full max-w-5xl h-[92vh] md:h-auto md:max-h-[90vh] md:rounded-[2.5rem] shadow-2xl border border-black/5 flex flex-col">
            
            {/* Modal Header - Sticky */}
            <div className="p-6 md:p-8 border-b border-black/5 flex justify-between items-center bg-[#FCFCFA] flex-shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-serif italic text-black">{editingProduct ? 'Refine Masterpiece' : 'Enroll New Piece'}</h2>
                <p className="text-[8px] uppercase tracking-[0.3em] text-[#A68E74] font-black mt-1">Atelier Configuration Protocol</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 md:p-4 bg-black/5 rounded-full hover:bg-black/10 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 md:space-y-16 custom-scrollbar">
               
               {/* Core Attributes */}
               <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Piece Designation</label>
                      <input className="w-full bg-white rounded-xl p-4 md:p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm transition-all" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Zenith Meridian" required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Narrative Description</label>
                      <textarea className="w-full bg-white rounded-xl p-4 md:p-5 text-sm font-light italic leading-relaxed border border-black/10 h-32 md:h-40 outline-none shadow-sm focus:border-[#A68E74] transition-all" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="The story of the craft..." required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Valuation (INR)</label>
                      <input type="number" className="w-full bg-white rounded-xl p-4 md:p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Vault Availability</label>
                      <input type="number" className="w-full bg-white rounded-xl p-4 md:p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Series Allocation</label>
                      <select className="w-full bg-white rounded-xl p-4 md:p-5 text-[10px] uppercase font-black border border-black/10 focus:border-[#A68E74] outline-none shadow-sm appearance-none cursor-pointer" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Registry Tag</label>
                      <select className="w-full bg-white rounded-xl p-4 md:p-5 text-[10px] uppercase font-black border border-black/10 focus:border-[#A68E74] outline-none shadow-sm appearance-none cursor-pointer" value={formData.tag || 'None'} onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}>
                        <option value="None">Regular Collection</option>
                        <option value="Latest">Latest Masterpiece</option>
                        <option value="Best Seller">High Demand</option>
                        <option value="New Arrival">Recently Crafted</option>
                        <option value="Offer">Exclusive Valuation</option>
                      </select>
                    </div>
                  </div>
               </section>

               {/* COLORWAY MANAGER */}
               <section className="space-y-6">
                 <div className="flex items-center justify-between mb-4">
                   <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Atelier Colorways</label>
                   <button type="button" onClick={() => setColors([...colors, 'New Palette'])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74]">+ Add Variant</button>
                 </div>
                 <div className="flex flex-wrap gap-3">
                   {colors.map((color, i) => (
                     <div key={i} className="flex items-center gap-2 bg-white border border-black/10 rounded-full px-4 py-2 shadow-sm hover:border-[#A68E74] transition-all">
                       <input className="bg-transparent text-[10px] font-bold outline-none w-20 md:w-24" value={color} onChange={e => {
                         const newColors = [...colors]; newColors[i] = e.target.value; setColors(newColors);
                       }} />
                       <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3 h-3" /></button>
                     </div>
                   ))}
                   {colors.length === 0 && <p className="text-[10px] italic text-black/20">No color variants defined.</p>}
                 </div>
               </section>

               {/* KEY FEATURES MANAGER */}
               <section className="space-y-6">
                 <div className="flex items-center justify-between">
                   <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Anatomy of Excellence</label>
                   <button type="button" onClick={() => setFeatures([...features, {title: '', description: ''}])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74]">+ New Feature</button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, i) => (
                      <div key={i} className="p-5 md:p-6 bg-white border border-black/5 rounded-2xl relative shadow-sm group hover:border-[#A68E74]/30 transition-all">
                        <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                        <div className="space-y-4 pr-6">
                          <input placeholder="Feature Title" className="w-full bg-transparent text-[11px] font-black uppercase tracking-widest border-b border-black/10 pb-2 outline-none focus:border-[#A68E74]" value={feature.title} onChange={e => {
                            const newFeatures = [...features]; newFeatures[i].title = e.target.value; setFeatures(newFeatures);
                          }} />
                          <textarea placeholder="Feature Nuance..." className="w-full bg-transparent text-xs italic font-light text-black/50 outline-none resize-none h-12" value={feature.description} onChange={e => {
                            const newFeatures = [...features]; newFeatures[i].description = e.target.value; setFeatures(newFeatures);
                          }} />
                        </div>
                      </div>
                    ))}
                 </div>
               </section>

               {/* ASSETS MANAGER */}
               <section className="space-y-6">
                 <div className="flex items-center justify-between">
                   <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Visual Assets</label>
                   <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74]">+ Add Asset</button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {imageUrls.map((url, i) => (
                     <div key={i} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                       <input className="bg-transparent text-[9px] font-mono border-b border-black/5 pb-2 outline-none truncate" value={url} onChange={e => {
                         const newUrls = [...imageUrls]; newUrls[i] = e.target.value; setImageUrls(newUrls);
                       }} placeholder="Asset URL..." />
                       {url && <img src={url} className="w-full h-20 object-cover rounded-lg mix-blend-multiply opacity-60" />}
                       {imageUrls.length > 1 && (
                         <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="text-[8px] uppercase tracking-widest font-black text-red-400 self-end mt-1">Remove</button>
                       )}
                     </div>
                   ))}
                 </div>
               </section>

               {/* Final Padding for bottom sticky area */}
               <div className="h-10 md:h-20" />
            </form>

            {/* Modal Footer - Sticky */}
            <div className="p-6 md:p-10 border-t border-black/5 bg-[#FCFCFA] flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
               <button type="button" onClick={() => setIsModalOpen(false)} className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-black/20 hover:text-black transition-colors order-2 md:order-1">Discard Archive Entry</button>
               <div className="flex w-full md:w-auto gap-4 order-1 md:order-2">
                 <button type="submit" form="productForm" onClick={(e) => handleSaveProduct(e)} className="w-full md:w-auto bg-[#111111] text-white px-8 md:px-14 py-4 md:py-6 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all">Sync to Archive</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Series Portal Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-xl p-4 md:p-6">
          <div className="bg-white w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-black/5">
            <div className="flex justify-between items-center mb-8 md:mb-10">
              <h3 className="text-lg md:text-xl font-serif italic text-black">Series Portal</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 bg-black/5 rounded-full"><X className="w-4 h-4 text-black/40" /></button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input className="flex-1 bg-[#F9F7F5] rounded-xl p-4 text-[10px] uppercase font-black border border-black/5 outline-none focus:border-[#A68E74] transition-all" placeholder="New Series..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={handleAddCategory} className="bg-black text-white px-4 md:px-6 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Enroll</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-[#F9F7F5] rounded-xl border border-black/[0.03] group hover:border-[#A68E74]/20 transition-all">
                    <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-black text-black/60">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && <ConfirmDialog isOpen={!!confirm} title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProducts;
