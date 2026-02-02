
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Product, ProductTag, KeyFeature, Category } from '../../types';
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
        name: '', price: 0, original_price: 0, category: categories.length > 0 ? categories[0].name : 'Luxury Series',
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
      setToast({ message: editingProduct ? "Masterpiece Refined" : "Masterpiece Enrolled Successfully", type: 'success' });
      setIsModalOpen(false);
    } else {
      setToast({ message: "Cloud Sync Delayed - Saved Locally", type: 'error' });
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const success = await upsertCategory({ id: `cat-${Date.now()}`, name: newCatName });
    if (success) {
      setNewCatName('');
      setToast({ message: "New Series Registered", type: 'success' });
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.05] pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif mb-2 text-black italic">Inventory Registry</h1>
          <p className="text-[#A68E74] text-[10px] uppercase tracking-[0.5em] font-black">Archive of the World's Finest Instruments</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="flex-1 md:flex-none px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-black/10 bg-white hover:bg-black/5 transition-all">Series Portal</button>
          <button onClick={() => openModal()} className="flex-1 md:flex-none bg-[#111111] text-white px-10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Enroll Piece</button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 w-5 h-5" />
        <input 
          type="text" placeholder="Search the archive by piece designation..."
          className="w-full pl-16 pr-8 py-5 bg-white border border-black/10 rounded-2xl text-[11px] uppercase tracking-widest font-black text-[#111111] focus:outline-none focus:border-[#A68E74] shadow-sm transition-all"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid of Items for better mobile usability */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
          <div key={product.id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-24 bg-[#F9F7F5] rounded-xl overflow-hidden border border-black/5">
                <img src={product.images[0]} className="w-full h-full object-cover mix-blend-multiply opacity-80" alt={product.name} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#A68E74] font-black mb-1 block">{product.category}</span>
                <h3 className="font-serif text-lg text-black truncate italic">{product.name}</h3>
                <p className="text-[11px] font-bold text-black/40 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-black/5 flex justify-between items-center">
              <span className={`text-[8px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full ${product.stock < 5 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {product.stock} in Vault
              </span>
              <div className="flex space-x-2">
                <button onClick={() => openModal(product)} className="p-3 bg-black/5 text-black hover:bg-black hover:text-white rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => setConfirm({
                  title: "Decommission Piece",
                  message: `Purge "${product.name}" from active registry?`,
                  onConfirm: () => deleteProduct(product.id)
                })} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#FCFCFA] w-full max-w-4xl md:rounded-[3rem] shadow-2xl animate-fadeInUp min-h-screen md:min-h-0 md:my-10 border border-black/5">
            <div className="sticky top-0 z-30 p-8 border-b border-black/5 flex justify-between items-center bg-[#FCFCFA]/90 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-serif italic text-black">{editingProduct ? 'Refine Masterpiece' : 'Enroll New Piece'}</h2>
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#A68E74] font-black mt-1">Digital Calibration Interface</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white border border-black/5 rounded-full hover:bg-black hover:text-white transition-all"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-8 md:p-12 space-y-12">
               {/* Core Information */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Piece Designation</label>
                      <input className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none text-[#111111]" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Narrative Description</label>
                      <textarea className="w-full bg-white rounded-2xl p-5 text-sm font-light italic leading-relaxed border border-black/10 focus:border-[#A68E74] outline-none h-32 text-[#111111]" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Valuation (INR)</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none text-[#111111]" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                    </div>
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Market Valuation</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none text-black/20" value={formData.original_price || 0} onChange={e => setFormData({...formData, original_price: Number(e.target.value)})} />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Series Allocation</label>
                      <select className="w-full bg-white rounded-2xl p-5 text-[10px] uppercase font-black tracking-widest border border-black/10 focus:border-[#A68E74] outline-none text-[#111111]" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Registry Tag</label>
                      <select className="w-full bg-white rounded-2xl p-5 text-[10px] uppercase font-black tracking-widest border border-black/10 outline-none text-[#111111]" value={formData.tag || 'Latest'} onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}>
                        <option value="Latest">Latest</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Offer">Exclusive Offer</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Vault Stock</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10 outline-none text-[#111111]" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                    </div>
                  </div>
               </div>

               {/* Asset URLs */}
               <div className="space-y-6">
                 <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Visual Assets</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {imageUrls.map((url, i) => (
                     <div key={i} className="flex gap-2">
                       <input className="flex-1 bg-white rounded-xl p-4 text-[10px] border border-black/10 outline-none" value={url} onChange={e => {
                         const newUrls = [...imageUrls];
                         newUrls[i] = e.target.value;
                         setImageUrls(newUrls);
                       }} placeholder="Asset URL..." />
                       {imageUrls.length > 1 && (
                         <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                       )}
                     </div>
                   ))}
                 </div>
                 <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20">+ Add New Asset Angle</button>
               </div>

               {/* Specs & Features */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-black/5">
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black flex items-center gap-2"><Settings className="w-4 h-4" /> Technical Blueprint</label>
                    <div className="space-y-3">
                      {specs.map((s, i) => (
                        <div key={i} className="flex gap-3">
                          <input className="w-1/3 bg-white rounded-xl p-4 text-[9px] uppercase font-black border border-black/10" placeholder="Parameter" value={s.key} onChange={e => {
                             const newSpecs = [...specs];
                             newSpecs[i].key = e.target.value;
                             setSpecs(newSpecs);
                          }} />
                          <input className="flex-1 bg-white rounded-xl p-4 text-[10px] font-medium border border-black/10" placeholder="Value" value={s.value} onChange={e => {
                             const newSpecs = [...specs];
                             newSpecs[i].value = e.target.value;
                             setSpecs(newSpecs);
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20">+ Add Blueprint Parameter</button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black flex items-center gap-2"><Star className="w-4 h-4" /> Artisanal Details</label>
                    <div className="space-y-4">
                      {features.map((f, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl border border-black/10 space-y-4 relative shadow-sm">
                           <input className="w-full bg-transparent font-serif text-lg text-[#111111] outline-none italic" placeholder="Feature Distinction" value={f.title} onChange={e => {
                             const newF = [...features];
                             newF[i].title = e.target.value;
                             setFeatures(newF);
                           }} />
                           <textarea className="w-full bg-transparent text-[10px] text-black/50 uppercase tracking-widest leading-relaxed outline-none h-16" placeholder="Narrative feature description..." value={f.description} onChange={e => {
                             const newF = [...features];
                             newF[i].description = e.target.value;
                             setFeatures(newF);
                           }} />
                           <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-black/10 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFeatures([...features, { title: '', description: '' }])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74] border-b border-[#A68E74]/20">+ Add Artisanal Note</button>
                    </div>
                  </div>
               </div>

               <div className="flex justify-end pt-12 border-t border-black/5 space-x-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black">Abort Synchronization</button>
                 <button type="submit" className="bg-[#111111] text-white px-14 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all">Commit to Registry</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Series Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-xl p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-scaleIn border border-black/5">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-serif italic text-black">Series Portal</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-5 h-5 text-black/20 hover:text-black" /></button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input className="flex-1 bg-[#F9F7F5] rounded-xl p-4 text-[10px] uppercase font-black tracking-widest border border-black/5 outline-none" placeholder="New Series..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={handleAddCategory} className="bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Enroll</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-[#F9F7F5] rounded-xl border border-black/[0.03]">
                    <span className="text-[11px] uppercase tracking-widest font-black text-black/60">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog isOpen={!!confirm} title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProducts;
