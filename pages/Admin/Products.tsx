
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Product, ProductTag, KeyFeature, Category } from '../../types';
import { X, Search, ChevronRight, Star, ShoppingBag } from '../../components/Icons';
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
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [newCatName, setNewCatName] = useState('');

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({ ...p });
      setSpecs(Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })));
      setImageUrls(p.images.length > 0 ? p.images : ['']);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, category: categories.length > 0 ? categories[0].name : '',
        tag: 'None', description: '', stock: 0, images: []
      });
      setSpecs([{ key: 'Movement', value: '' }, { key: 'Material', value: '' }]);
      setImageUrls(['']);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const specsObj: Record<string, string> = {};
    specs.forEach(s => { if(s.key) specsObj[s.key] = s.value; });

    const finalProduct = {
      ...formData,
      images: imageUrls.filter(url => url.trim() !== ''),
      specs: specsObj,
      key_features: formData.key_features || [],
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      rating: editingProduct ? editingProduct.rating : 5,
      reviews_count: editingProduct ? editingProduct.reviews_count : 0,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString()
    } as Product;

    const success = await upsertProduct(finalProduct);
    if (success) {
      setToast({ message: editingProduct ? "Masterpiece Updated" : "Asset Enrolled", type: 'success' });
      setIsModalOpen(false);
    } else {
      setToast({ message: "Sync Error", type: 'error' });
    }
  };

  const triggerDeleteProduct = (id: string, name: string) => {
    setConfirm({
      title: "Archive Asset",
      message: `Decommissioning "${name}"? This will purge it from all public listings.`,
      onConfirm: async () => {
        await deleteProduct(id);
        setToast({ message: "Asset Purged", type: 'success' });
      }
    });
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Inventory Ledger</h1>
          <p className="text-black/30 text-[9px] uppercase tracking-[0.4em] font-black">Curation of Artisanal Instruments</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-6 py-3 rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5 hover:bg-black/5 transition-all">Manage Series</button>
          <button onClick={() => openModal()} className="bg-black text-white px-8 py-3 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">New Piece</button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 w-4 h-4" />
        <input 
          type="text" placeholder="Search archives..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-black/5 rounded-2xl text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-[#B88E4B] transition-all"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[8px] uppercase tracking-[0.3em] text-black/20 border-b border-black/5">
              <th className="px-8 py-5 font-black">Timepiece</th>
              <th className="px-8 py-5 font-black">Valuation</th>
              <th className="px-8 py-5 font-black">Allocation</th>
              <th className="px-8 py-5 font-black">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
              <tr key={product.id} className="hover:bg-black/[0.02] transition-colors group text-black/60">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={product.images[0]} className="w-12 h-12 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="font-serif text-base text-black/80">{product.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-medium">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-8 py-6">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>{product.stock} units</span>
                </td>
                <td className="px-8 py-6 space-x-4">
                  <button onClick={() => openModal(product)} className="text-[8px] font-black uppercase tracking-widest text-[#B88E4B]">Edit</button>
                  <button onClick={() => triggerDeleteProduct(product.id, product.name)} className="text-[8px] font-black uppercase tracking-widest text-red-400">Purge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white/80 backdrop-blur-xl overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-black/5 animate-fadeInUp my-auto">
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-[#FDFBF7]">
              <h2 className="text-2xl font-serif italic">{editingProduct ? 'Refine Masterpiece' : 'New Enrollment'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-black/5 rounded-full transition-all"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[8px] uppercase tracking-widest text-black/40 font-black">Designation</label>
                    <input className="w-full bg-black/5 rounded-xl p-4 text-xs font-bold outline-none border border-transparent focus:border-[#B88E4B] transition-all" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[8px] uppercase tracking-widest text-black/40 font-black">Valuation (₹)</label>
                    <input type="number" className="w-full bg-black/5 rounded-xl p-4 text-xs font-bold outline-none border border-transparent focus:border-[#B88E4B]" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                  </div>
               </div>
               <div className="flex justify-end pt-8 border-t border-black/5 space-x-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-black/20">Discard</button>
                 <button type="submit" className="bg-[#B88E4B] text-white px-10 py-4 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Commit to Vault</button>
               </div>
            </form>
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
