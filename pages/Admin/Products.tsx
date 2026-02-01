
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product, Category, ProductTag } from '../../types';
import { X, Search } from '../../components/Icons';

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
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
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'],
    specs: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      addProduct({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        rating: 5,
        reviewsCount: 0
      } as Product);
    }
    closeModal();
  };

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        category: 'Men',
        tag: 'None',
        description: '',
        stock: 0,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'],
        specs: {}
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-2">Inventory Management</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Catalog of fine horology</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
        >
          Add New Piece
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="SEARCH COLLECTIONS..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-[#F5F1E9] text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white border border-[#F5F1E9] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-[#F5F1E9]">
              <th className="px-8 py-6 font-semibold">Product</th>
              <th className="px-8 py-6 font-semibold">Category</th>
              <th className="px-8 py-6 font-semibold">Price</th>
              <th className="px-8 py-6 font-semibold">Stock</th>
              <th className="px-8 py-6 font-semibold">Tag</th>
              <th className="px-8 py-6 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F1E9]">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-[#FDFBF7] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={product.images[0]} className="w-12 h-12 object-cover rounded" />
                    <span className="font-medium text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500">{product.category}</td>
                <td className="px-8 py-6 text-sm font-medium">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-8 py-6 text-sm">{product.stock} units</td>
                <td className="px-8 py-6">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${product.tag === 'None' ? 'bg-gray-100 text-gray-400' : 'bg-[#FDFBF7] text-[#C5A059] border border-[#C5A059]'}`}>
                    {product.tag}
                  </span>
                </td>
                <td className="px-8 py-6 space-x-4">
                  <button onClick={() => openModal(product)} className="text-xs font-bold uppercase tracking-widest text-black hover:text-[#C5A059]">Edit</button>
                  <button onClick={() => deleteProduct(product.id)} className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[#F5F1E9] flex justify-between items-center">
              <h2 className="text-2xl font-serif">{editingProduct ? 'Edit Masterpiece' : 'Add New Masterpiece'}</h2>
              <button onClick={closeModal}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Model Name</label>
                <input 
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Price (₹)</label>
                <input 
                  type="number"
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Category</label>
                <select 
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Wall Clocks</option>
                  <option>Smart Clocks</option>
                  <option>Luxury Series</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Stock</label>
                <input 
                  type="number"
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Badge Tag</label>
                <select 
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black"
                  value={formData.tag}
                  onChange={e => setFormData({...formData, tag: e.target.value as ProductTag})}
                >
                  <option>None</option>
                  <option>Latest</option>
                  <option>Best Seller</option>
                  <option>Offer</option>
                  <option>New Arrival</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                <textarea 
                  className="w-full border border-[#F5F1E9] p-3 text-sm focus:outline-none focus:border-black h-24"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-[#F5F1E9]">
                <button type="button" onClick={closeModal} className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                <button type="submit" className="bg-black text-white px-12 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059]">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
