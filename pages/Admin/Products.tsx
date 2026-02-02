
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
      setIsModalOpen(false);
    } else {
      setToast({ message: "Saved Locally. Check Schema Config.", type: 'error' });
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const success = await upsertCategory({ id: `cat-${Date.now()}`, name: newCatName });
    if (success) { 
      setNewCatName(''); 
      setToast({ message: "Series Registered", type: 'success' }); 
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-fadeIn pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-black/[0.05] pb-8 md:pb-10">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-serif text-black italic">Inventory Registry</h1>
          <p className="text-[#A68E74] text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-black">Archive Management Portal</p>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)} 
            className="flex-1 sm:flex-none px-6 lg:px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-black/10 bg-white hover:bg-black hover:text-white transition-all active:scale-95"
          >
            Manage Series
          </button>
          <button 
            onClick={() => openModal()} 
            className="flex-1 sm:flex-none bg-black text-white px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all active:scale-95"
          >
            Enroll Piece
          </button>
        </div>
      </div>

      {/* Global Search Protocol */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 w-5 h-5 transition-colors group-focus-within:text-[#A68E74]" />
        <input 
          type="text" 
          placeholder="Search the archive..."
          className="w-full pl-16 pr-8 py-5 md:py-6 bg-white border border-black/10 rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black outline-none focus:border-[#A68E74] shadow-sm transition-all focus:shadow-xl focus:shadow-black/5"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Optimized Adaptive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
          <div key={product.id} className="bg-white border border-black/5 rounded-[2.5rem] p-6 lg:p-8 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
            <div className="flex flex-row sm:flex-col lg:flex-row gap-6 lg:gap-8 items-center sm:items-start lg:items-center">
              <div className="w-24 h-28 sm:w-full sm:h-56 lg:w-24 lg:h-28 bg-[#F9F7F5] rounded-[2rem] overflow-hidden border border-black/5 flex-shrink-0 relative group-hover:shadow-lg transition-all">
                <img src={product.images[0]} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-[2s]" alt={product.name} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] uppercase tracking-[0.5em] text-[#A68E74] font-black mb-2 block truncate">{product.category}</span>
                <h3 className="font-serif text-xl text-black truncate italic leading-tight group-hover:text-[#A68E74] transition-colors">{product.name}</h3>
                <p className="text-sm font-serif text-black/40 mt-2 italic">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center">
              <span className={`text-[8px] uppercase font-black tracking-widest px-4 py-2 rounded-full shadow-sm ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {product.stock} in Vault
              </span>
              <div className="flex space-x-3">
                <button 
                  onClick={() => openModal(product)} 
                  className="p-3 bg-black/5 text-black rounded-xl hover:bg-black hover:text-white transition-all active:scale-90"
                  title="Refine Piece"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setConfirm({ title: "Purge Piece", message: "Are you certain you wish to purge this instrument from the registry?", onConfirm: () => deleteProduct(product.id) })} 
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="Purge Piece"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MASTERPIECE CONFIGURATOR MODAL - Responsive Rebuild */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 lg:p-12">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          
          {/* Main Container - Full Screen on Mobile, Centered Card on Laptop */}
          <div className="relative bg-[#FCFCFA] w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-6xl sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Sticky Configurator Header */}
            <div className="px-6 sm:px-12 py-6 sm:py-10 border-b border-black/[0.05] bg-[#FCFCFA] flex justify-between items-center z-20">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-serif italic text-black truncate">
                  {editingProduct ? 'Refine Masterpiece' : 'Enroll New Piece'}
                </h2>
                <div className="flex items-center space-x-3 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A68E74] animate-pulse" />
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#A68E74] font-black truncate">Atelier Registry Protocol v14</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 sm:p-4 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Architectural Content */}
            <form 
              id="productForm" 
              onSubmit={handleSaveProduct} 
              className="flex-1 overflow-y-auto px-6 sm:px-16 py-10 sm:py-16 space-y-12 sm:space-y-20 no-scrollbar"
            >
               
               {/* Identity & Valuation Quadrant */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
                  {/* Narrative Section */}
                  <div className="space-y-8 sm:space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black flex items-center gap-2">
                        Piece Designation <span className="text-[#A68E74]/40">• Required</span>
                      </label>
                      <input 
                        className="w-full bg-white rounded-2xl p-5 sm:p-6 text-sm sm:text-lg font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm transition-all focus:shadow-xl focus:shadow-black/5" 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. Aurelius Horizon" 
                        required 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Archive Narrative</label>
                      <textarea 
                        className="w-full bg-white rounded-3xl p-5 sm:p-6 text-sm sm:text-lg font-light italic leading-relaxed border border-black/10 h-32 sm:h-48 outline-none shadow-sm focus:border-[#A68E74] transition-all focus:shadow-xl focus:shadow-black/5" 
                        value={formData.description || ''} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="The philosophy and engineering behind this creation..." 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Commercial Specifications */}
                  <div className="grid grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Investment (INR)</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 sm:p-6 text-sm sm:text-lg font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Registry Tag</label>
                      <select className="w-full bg-white rounded-2xl p-5 sm:p-6 text-[10px] uppercase font-black border border-black/10 focus:border-[#A68E74] outline-none shadow-sm cursor-pointer appearance-none" value={formData.tag || 'None'} onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}>
                        <option value="None">Standard Collection</option>
                        <option value="Latest">Latest</option>
                        <option value="Best Seller">High Velocity</option>
                        <option value="Offer">Exclusive</option>
                        <option value="New Arrival">Recently Enrolled</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Vault Count</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 sm:p-6 text-sm sm:text-lg font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Series</label>
                      <select className="w-full bg-white rounded-2xl p-5 sm:p-6 text-[10px] uppercase font-black border border-black/10 focus:border-[#A68E74] outline-none shadow-sm cursor-pointer appearance-none" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Market Valuation Reference</label>
                      <input type="number" className="w-full bg-white rounded-2xl p-5 sm:p-6 text-sm sm:text-lg font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm opacity-40" value={formData.original_price || 0} onChange={e => setFormData({...formData, original_price: Number(e.target.value)})} />
                    </div>
                  </div>
               </div>

               {/* Customization & Anatomy Quadrant */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 border-t border-black/[0.03] pt-12 sm:pt-20">
                 {/* Colorway Palette */}
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Atelier Colorways</label>
                      <button type="button" onClick={() => setColors([...colors, 'New Variant'])} className="text-[10px] font-black uppercase tracking-widest text-[#A68E74] hover:text-black transition-colors">+ Add Palette</button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {colors.map((color, i) => (
                        <div key={i} className="group/item flex items-center gap-3 bg-white border border-black/10 rounded-2xl px-5 py-3 shadow-sm hover:border-[#A68E74] transition-all">
                          <input 
                            className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none w-28" 
                            value={color} 
                            onChange={e => {
                              const newColors = [...colors]; 
                              newColors[i] = e.target.value; 
                              setColors(newColors);
                            }} 
                          />
                          <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="text-black/20 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {colors.length === 0 && <p className="text-[11px] italic text-black/20 font-serif">No palettes registered.</p>}
                    </div>
                 </div>

                 {/* Key Anatomy Features */}
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Anatomy of Excellence</label>
                      <button type="button" onClick={() => setFeatures([...features, {title: '', description: ''}])} className="text-[10px] font-black uppercase tracking-widest text-[#A68E74] hover:text-black transition-colors">+ Architect Feature</button>
                    </div>
                    <div className="space-y-6">
                        {features.map((feature, i) => (
                          <div key={i} className="p-6 sm:p-8 bg-white border border-black/5 rounded-[2rem] relative shadow-sm group hover:border-[#A68E74]/30 transition-all">
                            <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-6 right-6 text-black/10 hover:text-red-500 transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="space-y-5 pr-8">
                              <input 
                                placeholder="Feature Milestone (e.g. Movement)" 
                                className="w-full bg-transparent text-[11px] font-black uppercase tracking-[0.2em] border-b border-black/5 pb-3 outline-none focus:border-[#A68E74]" 
                                value={feature.title} 
                                onChange={e => {
                                  const newFeatures = [...features]; 
                                  newFeatures[i].title = e.target.value; 
                                  setFeatures(newFeatures);
                                }} 
                              />
                              <textarea 
                                placeholder="Descriptive detail..." 
                                className="w-full bg-transparent text-sm sm:text-base italic font-light text-black/50 outline-none resize-none h-16 no-scrollbar" 
                                value={feature.description} 
                                onChange={e => {
                                  const newFeatures = [...features]; 
                                  newFeatures[i].description = e.target.value; 
                                  setFeatures(newFeatures);
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                 </div>
               </div>

               {/* Cinematic Asset Quadrant */}
               <div className="space-y-10 sm:space-y-12 border-t border-black/[0.03] pt-12 sm:pt-20">
                 <div className="flex items-center justify-between">
                   <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black">Visual Master Assets</label>
                   <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[10px] font-black uppercase tracking-widest text-[#A68E74] hover:text-black transition-colors">+ Enlist Perspective</button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   {imageUrls.map((url, i) => (
                     <div key={i} className="flex flex-col gap-4 bg-white p-5 rounded-[2rem] border border-black/5 shadow-sm group transition-all hover:border-[#A68E74]/20">
                       <div className="aspect-[4/5] bg-[#F9F7F5] rounded-[1.5rem] overflow-hidden border border-black/5 relative shadow-inner">
                         {url ? (
                           <img src={url} className="w-full h-full object-cover mix-blend-multiply opacity-80" alt={`Perspective ${i+1}`} />
                         ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center space-y-3 text-black/10">
                             <ImageIcon className="w-10 h-10" />
                             <span className="text-[9px] uppercase tracking-[0.3em] font-black">Empty Perspective</span>
                           </div>
                         )}
                         <button 
                            type="button" 
                            onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} 
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                         >
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                       <input 
                         className="w-full bg-transparent text-[10px] font-mono p-3 border border-black/5 rounded-xl outline-none focus:border-[#A68E74] truncate" 
                         value={url} 
                         onChange={e => {
                           const newUrls = [...imageUrls]; 
                           newUrls[i] = e.target.value; 
                           setImageUrls(newUrls);
                         }} 
                         placeholder="Paste Visual URL..." 
                       />
                     </div>
                   ))}
                 </div>
               </div>

               <div className="h-24 sm:h-32" />
            </form>

            {/* Fixed Orchestration Footer */}
            <div className="px-6 sm:px-16 py-8 sm:py-12 border-t border-black/[0.05] bg-[#FCFCFA] flex flex-col sm:flex-row items-center justify-between gap-6 z-20">
               <button 
                 type="button" 
                 onClick={() => setIsModalOpen(false)} 
                 className="text-[10px] uppercase font-black tracking-[0.5em] text-black/20 hover:text-black transition-colors order-2 sm:order-1 active:scale-95"
               >
                 Abort Changes
               </button>
               <button 
                 type="submit" 
                 form="productForm" 
                 className="w-full sm:w-auto bg-black text-white px-12 sm:px-20 py-5 sm:py-7 rounded-full text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-black/20"
               >
                 Memorialize Piece
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Series Portal Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl animate-fadeIn" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 lg:p-14 border border-black/5 animate-scaleIn">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-serif italic text-black">Series Registry</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-3 hover:bg-black/5 rounded-full transition-colors active:scale-90"><X className="w-5 h-5 text-black/20" /></button>
            </div>
            <div className="space-y-10">
              <div className="flex gap-3">
                <input className="flex-1 bg-[#F9F7F5] rounded-2xl p-5 text-[11px] uppercase font-black border border-black/5 outline-none focus:border-[#A68E74] shadow-sm transition-all" placeholder="Series Label..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={handleAddCategory} className="bg-black text-white px-6 rounded-2xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all">Enroll</button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-6 bg-[#F9F7F5] rounded-[1.5rem] border border-black/[0.03] group hover:border-[#A68E74]/30 transition-all">
                    <span className="text-[11px] uppercase tracking-[0.3em] font-black text-black/60">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} className="text-black/10 hover:text-red-500 transition-colors p-2 active:scale-90"><Trash2 className="w-5 h-5" /></button>
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
