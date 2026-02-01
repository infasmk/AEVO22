
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product, Category, ProductTag } from '../../types';
import { X, Search } from '../../components/Icons';

const AdminProducts: React.FC = () => {
  const { products, upsertProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Men',
    tag: 'None',
    description: '',
    stock: 0,
    images: [],
    specs: {}
  });

  const [imageInput, setImageInput] = useState('');
  const [specInput, setSpecInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = imageInput.split(',').map(s => s.trim()).filter(s => s !== '');
    let specs = {};
    try {
      specs = specInput ? JSON.parse(specInput) : {};
    } catch (err) {
      alert("Invalid JSON in Specifications field.");
      return;
    }

    const payload = {
      ...formData,
      images,
      specs,
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      rating: editingProduct ? editingProduct.rating : 5,
      reviews_count: editingProduct ? editingProduct.reviews_count : 0
    } as Product;

    await upsertProduct(payload);
    closeModal();
  };

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
      setImageInput(p.images.join(', '));
      setSpecInput(JSON.stringify(p.specs, null, 2));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        category: 'Men',
        tag: 'None',
        description: '',
        stock: 0,
        images: [],
        specs: {}
      });
      setImageInput('');
      setSpecInput('{}');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-12 space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif mb-4">Inventory Vault</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Curate the Portfolio of Fine Instruments</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#C5A059] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
        >
          Commission New Piece
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
        <input 
          type="text" 
          placeholder="SEARCH ARCHIVES..."
          className="w-full pl-16 pr-8 py-5 bg-[#1F1E1D] border border-white/5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-white focus:outline-none focus:border-[#C5A059] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[#1F1E1D] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
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
            {filtered.map(product => (
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#1F1E1D] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 animate-fadeInUp">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-3xl font-serif text-white">{editingProduct ? 'Update Blueprint' : 'New Creation'}</h2>
              <button onClick={closeModal} className="p-3 bg-white/5 rounded-full hover:bg-red-500 transition-all group">
                <X className="w-5 h-5 group-hover:scale-110" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Model Designation</label>
                  <input 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Investment (₹)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Series Category</label>
                    <select 
                      className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none cursor-pointer"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    >
                      <option>Men</option><option>Women</option><option>Wall Clocks</option><option>Smart Clocks</option><option>Luxury Series</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Stock Units</label>
                    <input 
                      type="number"
                      className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Curation Badge</label>
                    <select 
                      className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm focus:border-[#C5A059] outline-none cursor-pointer"
                      value={formData.tag}
                      onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}
                    >
                      <option>None</option><option>Latest</option><option>Best Seller</option><option>Offer</option><option>New Arrival</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Master Description</label>
                  <textarea 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-sm h-32 focus:border-[#C5A059] outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Visual Assets (Comma separated URLs)</label>
                  <textarea 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-[10px] font-mono h-32 focus:border-[#C5A059] outline-none"
                    value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    placeholder="URL 1, URL 2..."
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Technical Dossier (JSON Format)</label>
                  <textarea 
                    className="w-full bg-[#1A1918] border border-white/5 rounded-xl p-4 text-[10px] font-mono h-48 focus:border-[#C5A059] outline-none"
                    value={specInput}
                    onChange={e => setSpecInput(e.target.value)}
                    placeholder='{ "Movement": "Swiss", "Jewels": "24" }'
                  />
                </div>
                <div className="pt-6 flex justify-end space-x-6">
                  <button type="button" onClick={closeModal} className="text-[10px] uppercase tracking-widest font-bold text-white/20">Discard Changes</button>
                  <button type="submit" className="bg-[#C5A059] text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-white hover:text-black transition-all">Commit to Vault</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
