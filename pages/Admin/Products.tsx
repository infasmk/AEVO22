
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
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.05] pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif mb-2 text-black italic">Inventory Registry</h1>
          <p className="text-[#A68E74] text-[10px] uppercase tracking-[0.5em] font-black">Archive Management Portal</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="flex-1 md:flex-none px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-black/10 bg-white">Series Portal</button>
          <button onClick={() => openModal()} className="flex-1 md:flex-none bg-[#111111] text-white px-10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl">Enroll Piece</button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 w-5 h-5" />
        <input 
          type="text" placeholder="Search the archive..."
          className="w-full pl-16 pr-8 py-5 bg-white border border-black/10 rounded-2xl text-[11px] uppercase tracking-widest font-black outline-none focus:border-[#A68E74]"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
          <div key={product.id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
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
              <span className="text-[8px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
                {product.stock} in Vault
              </span>
              <div className="flex space-x-2">
                <button onClick={() => openModal(product)} className="p-3 bg-black/5 text-black rounded-xl"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => setConfirm({ title: "Purge Piece", message: "Confirm removal?", onConfirm: () => deleteProduct(product.id) })} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#FCFCFA] w-full max-w-4xl md:rounded-[3rem] shadow-2xl md:my-10 border border-black/5">
            <div className="sticky top-0 z-30 p-8 border-b border-black/5 flex justify-between items-center bg-[#FCFCFA]/90 backdrop-blur-md">
              <h2 className="text-2xl font-serif italic text-black">{editingProduct ? 'Refine Masterpiece' : 'Enroll New Piece'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white rounded-full"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-8 md:p-12 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Piece Designation</label>
                      <input className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10 focus:border-[#A68E74] outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Narrative Description</label>
                      <textarea className="w-full bg-white rounded-2xl p-5 text-sm font-light italic leading-relaxed border border-black/10 h-32 outline-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Valuation (INR)</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div className="col-span-1 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Market Val.</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 text-sm font-bold border border-black/10" value={formData.original_price || 0} onChange={e => setFormData({...formData, original_price: Number(e.target.value)})} />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Series Allocation</label>
                      <select className="w-full bg-white rounded-2xl p-5 text-[10px] uppercase font-black border border-black/10 outline-none" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
               </div>

               {/* COLORWAY MANAGER */}
               <div className="space-y-6">
                 <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Atelier Colorways</label>
                 <div className="flex flex-wrap gap-4">
                   {colors.map((color, i) => (
                     <div key={i} className="flex items-center gap-2 bg-white border border-black/5 rounded-full px-4 py-2">
                       <input className="bg-transparent text-[10px] font-bold outline-none w-20" value={color} onChange={e => {
                         const newColors = [...colors]; newColors[i] = e.target.value; setColors(newColors);
                       }} />
                       <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="text-red-400"><X className="w-3 h-3" /></button>
                     </div>
                   ))}
                   <button type="button" onClick={() => setColors([...colors, 'New Color'])} className="px-4 py-2 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">+ Add Color</button>
                 </div>
               </div>

               {/* KEY FEATURES MANAGER */}
               <div className="space-y-6">
                 <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Anatomy of Excellence (Features)</label>
                 <div className="space-y-4">
                    {features.map((feature, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white border border-black/5 rounded-2xl relative">
                        <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-400"><Trash2 className="w-4 h-4" /></button>
                        <input placeholder="Feature Title (e.g. Masterwork Build)" className="bg-transparent text-xs font-bold border-b border-black/10 pb-2 outline-none" value={feature.title} onChange={e => {
                          const newFeatures = [...features]; newFeatures[i].title = e.target.value; setFeatures(newFeatures);
                        }} />
                        <input placeholder="Short Description" className="bg-transparent text-xs italic border-b border-black/10 pb-2 outline-none" value={feature.description} onChange={e => {
                          const newFeatures = [...features]; newFeatures[i].description = e.target.value; setFeatures(newFeatures);
                        }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => setFeatures([...features, {title: '', description: ''}])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74]">+ Architect New Feature</button>
                 </div>
               </div>

               {/* ASSETS MANAGER */}
               <div className="space-y-6">
                 <label className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-black">Visual Assets</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {imageUrls.map((url, i) => (
                     <div key={i} className="flex gap-2">
                       <input className="flex-1 bg-white rounded-xl p-4 text-[10px] border border-black/10" value={url} onChange={e => {
                         const newUrls = [...imageUrls]; newUrls[i] = e.target.value; setImageUrls(newUrls);
                       }} placeholder="Asset URL..." />
                       {imageUrls.length > 1 && <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="p-3 text-red-500"><Trash2 className="w-4 h-4" /></button>}
                     </div>
                   ))}
                 </div>
                 <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[9px] font-black uppercase tracking-widest text-[#A68E74]">+ Add Angle</button>
               </div>

               <div className="flex justify-end pt-12 border-t border-black/5 space-x-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] uppercase font-black text-black/30">Discard Changes</button>
                 <button type="submit" className="bg-[#111111] text-white px-14 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">Sync to Archive</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-xl p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-black/5">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-serif italic text-black">Series Portal</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-5 h-5 text-black/20" /></button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input className="flex-1 bg-[#F9F7F5] rounded-xl p-4 text-[10px] uppercase font-black border border-black/5 outline-none" placeholder="New Series..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={handleAddCategory} className="bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase">Enroll</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-[#F9F7F5] rounded-xl border border-black/[0.03]">
                    <span className="text-[11px] uppercase tracking-widest font-black text-black/60">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-300"><Trash2 className="w-4 h-4" /></button>
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
