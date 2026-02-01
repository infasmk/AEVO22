
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Product, ProductTag, KeyFeature, Category } from '../../types';
import { X, Search, ChevronRight, Star, ShoppingBag } from '../../components/Icons';

const AdminProducts: React.FC = () => {
  const { products, categories, upsertProduct, deleteProduct, upsertCategory, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    tag: 'None',
    description: '',
    stock: 0,
    images: []
  });

  // Simplified List Management for Specs and Features
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);
  const [features, setFeatures] = useState<KeyFeature[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [newCatName, setNewCatName] = useState('');

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
      setSpecs(Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })));
      setFeatures(p.key_features || []);
      setImageUrls(p.images.length > 0 ? p.images : ['']);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        category: categories.length > 0 ? categories[0].name : 'Luxury Series',
        tag: 'None',
        description: '',
        stock: 0,
        images: []
      });
      setSpecs([{ key: 'Movement', value: '' }, { key: 'Material', value: '' }]);
      setFeatures([{ title: '', description: '' }]);
      setImageUrls(['']);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert arrays back to objects
    const specsObj: Record<string, string> = {};
    specs.forEach(s => { if(s.key) specsObj[s.key] = s.value; });

    const finalProduct = {
      ...formData,
      images: imageUrls.filter(url => url.trim() !== ''),
      specs: specsObj,
      key_features: features.filter(f => f.title.trim() !== ''),
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      rating: editingProduct ? editingProduct.rating : 5,
      reviews_count: editingProduct ? editingProduct.reviews_count : 0
    } as Product;

    await upsertProduct(finalProduct);
    setIsModalOpen(false);
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    await upsertCategory({ id: Math.random().toString(36).substr(2, 9), name: newCatName });
    setNewCatName('');
  };

  return (
    <div className="p-12 space-y-12 animate-fadeIn bg-[#0F0F0F]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-serif mb-4">Inventory Vault</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Curate the Portfolio of Fine Instruments</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white/5 text-[#C5A059] px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#C5A059]/20 hover:bg-[#C5A059]/10 transition-all"
          >
            Manage Categories
          </button>
          <button 
            onClick={() => openModal()}
            className="bg-[#C5A059] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
          >
            Commission New Piece
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
        <input 
          type="text" 
          placeholder="SEARCH ARCHIVES..."
          className="w-full pl-16 pr-8 py-5 bg-[#1A1918] border border-white/5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-white focus:outline-none focus:border-[#C5A059] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[#1A1918] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] uppercase tracking-[0.3em] text-white/20 border-b border-white/5">
              <th className="px-10 py-6 font-bold">Timepiece</th>
              <th className="px-10 py-6 font-bold">Series</th>
              <th className="px-10 py-6 font-bold">Valuation</th>
              <th className="px-10 py-6 font-bold">Allocation</th>
              <th className="px-10 py-6 font-bold">Protocols</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-6">
                    <img src={product.images[0]} className="w-16 h-16 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <span className="font-serif text-lg text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-xs text-white/40 uppercase tracking-widest">{product.category}</td>
                <td className="px-10 py-8 font-serif text-white">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-10 py-8">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${product.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>{product.stock} units</span>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-[#C5A059]" style={{ width: `${Math.min(100, product.stock * 5)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 space-x-6">
                  <button onClick={() => openModal(product)} className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] border-b border-[#C5A059]/20 pb-1 hover:text-white transition-all">Calibrate</button>
                  <button onClick={() => deleteProduct(product.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500/40 border-b border-red-500/10 pb-1 hover:text-red-500 transition-all">Decommission</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Product Architect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0F0F0F]/90 backdrop-blur-xl overflow-y-auto">
          <div className="bg-[#1A1918] w-full max-w-5xl rounded-[3rem] shadow-2xl border border-white/5 animate-fadeInUp my-auto">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#1A1918] z-10 rounded-t-[3rem]">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#C5A059]/10 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
                </div>
                <h2 className="text-3xl font-serif text-white">{editingProduct ? 'Refine Instrument' : 'New Creation Protocol'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-red-500/20 transition-all text-white/40 hover:text-red-500"><X /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-10 space-y-16">
              {/* Section 1: Designation */}
              <div className="space-y-10">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">01. Designation</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Model Name</label>
                    <input className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white focus:border-[#C5A059] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Series Category</label>
                    <select className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white focus:border-[#C5A059] outline-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Investment (₹)</label>
                    <input type="number" className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white focus:border-[#C5A059] outline-none" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Stock Allocation</label>
                    <input type="number" className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white focus:border-[#C5A059] outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Curation Badge</label>
                    <select className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white focus:border-[#C5A059] outline-none" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}>
                      <option>None</option><option>Latest</option><option>Best Seller</option><option>Offer</option><option>New Arrival</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Master Narrative (Description)</label>
                  <textarea className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white h-32 focus:border-[#C5A059] outline-none italic font-light" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
              </div>

              {/* Section 2: Visual Assets */}
              <div className="space-y-10">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">02. Visual Assets</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-1 space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Image URL {i + 1}</label>
                        <input className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-[10px] text-white/60 focus:border-[#C5A059] outline-none" value={url} onChange={e => {
                          const newUrls = [...imageUrls];
                          newUrls[i] = e.target.value;
                          setImageUrls(newUrls);
                        }} />
                      </div>
                      {imageUrls.length > 1 && (
                        <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="mt-8 text-red-500/40 hover:text-red-500"><X /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="h-full mt-8 border border-dashed border-white/10 rounded-2xl p-4 text-[9px] uppercase tracking-widest text-white/20 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all">+ Add Visual Frame</button>
                </div>
              </div>

              {/* Section 3: Technical Dossier */}
              <div className="space-y-10">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">03. Technical Dossier</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-4 items-end">
                      <div className="w-1/3 space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Label</label>
                        <input className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-[10px] text-[#C5A059] uppercase tracking-widest" value={spec.key} onChange={e => {
                          const newSpecs = [...specs];
                          newSpecs[i].key = e.target.value;
                          setSpecs(newSpecs);
                        }} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-1">Value</label>
                        <input className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-[11px] text-white" value={spec.value} onChange={e => {
                          const newSpecs = [...specs];
                          newSpecs[i].value = e.target.value;
                          setSpecs(newSpecs);
                        }} />
                      </div>
                      <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="p-3 text-red-500/20 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="border border-dashed border-white/10 rounded-xl p-4 text-[9px] uppercase tracking-widest text-white/20 hover:text-[#C5A059]">+ New Spec Param</button>
                </div>
              </div>

              {/* Section 4: Key Features of Excellence */}
              <div className="space-y-10">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">04. Key Features of Excellence</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="space-y-6">
                  {features.map((feat, i) => (
                    <div key={i} className="p-8 bg-[#0F0F0F] rounded-3xl border border-white/5 space-y-6 relative group">
                      <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="absolute top-6 right-6 text-white/10 group-hover:text-red-500/40"><X /></button>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Feature Title (Artisan Header)</label>
                        <input className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-white font-serif" value={feat.title} onChange={e => {
                          const newFeats = [...features];
                          newFeats[i].title = e.target.value;
                          setFeatures(newFeats);
                        }} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Elaboration (Description)</label>
                        <textarea className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-white/60 text-sm italic h-24" value={feat.description} onChange={e => {
                          const newFeats = [...features];
                          newFeats[i].description = e.target.value;
                          setFeatures(newFeats);
                        }} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFeatures([...features, { title: '', description: '' }])} className="w-full border border-dashed border-white/10 rounded-3xl p-8 text-[9px] uppercase tracking-widest text-white/20 hover:text-[#C5A059] hover:bg-white/5">+ Document New Feature</button>
                </div>
              </div>

              <div className="flex justify-end space-x-8 pt-12 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] uppercase tracking-widest font-black text-white/20">Discard Changes</button>
                <button type="submit" className="bg-[#C5A059] text-white px-16 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_30px_60px_-10px_rgba(197,160,89,0.3)] hover:scale-105 transition-all">
                  Commit Piece to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0F0F0F]/95 backdrop-blur-2xl">
          <div className="bg-[#1A1918] w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/5 p-10 space-y-10 animate-fadeInUp">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-white">Series Protocols</h2>
              <button onClick={() => setIsCategoryModalOpen(false)}><X /></button>
            </div>
            
            <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold block mb-4">Add New Collection Series</label>
              <div className="flex gap-4">
                <input className="flex-1 bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Lunar Series" />
                <button onClick={handleAddCategory} className="bg-[#C5A059] text-white px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Enroll</button>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Active Protocols</label>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                 {categories.map(c => (
                   <div key={c.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                     <span className="text-sm text-white/80">{c.name}</span>
                     <button onClick={() => deleteCategory(c.id)} className="text-red-500/40 hover:text-red-500 p-2"><X className="w-4 h-4" /></button>
                   </div>
                 ))}
               </div>
            </div>

            <button onClick={() => setIsCategoryModalOpen(false)} className="w-full py-5 border border-white/5 rounded-2xl text-[10px] uppercase font-bold text-white/40 tracking-widest">Close Registry</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
