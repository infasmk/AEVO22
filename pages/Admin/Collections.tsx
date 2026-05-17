
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Category } from '../../types';
import { X, Search, Plus, Trash2, Edit3, MoreHorizontal, LayoutGrid } from '../../components/Icons';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';

const AdminCollections: React.FC = () => {
  const { categories, upsertCategory, deleteCategory } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');

  const openModal = (c?: Category) => {
    if (c) {
      setEditingCategory(c);
      setNewCatName(c.name);
    } else {
      setEditingCategory(null);
      setNewCatName('');
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const finalCategory = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: newCatName.trim()
    } as Category;

    const success = await upsertCategory(finalCategory);
    if (success) {
      setToast({ message: editingCategory ? "Series Protocol Updated" : "New Series Registered", type: 'success' });
      setIsModalOpen(false);
      setNewCatName('');
    } else {
      setToast({ message: "Registry Error", type: 'error' });
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-black/[0.05] pb-8 md:pb-10">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-serif text-black italic">Collection Registry</h1>
          <p className="text-[#A68E74] text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-black">Series & Taxonomy Management</p>
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto bg-black text-white px-6 lg:px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all active:scale-95">Enroll New Series</button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border border-black/5 rounded-[2.5rem] p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-[#F9F7F5] rounded-2xl flex items-center justify-center text-[#A68E74] group-hover:scale-110 transition-transform duration-500">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openModal(cat)} className="p-3 text-black/20 hover:text-black transition-colors active:scale-90"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setConfirm({ title: "Retire Series", message: `Are you sure you wish to retire the "${cat.name}" series from the active registry?`, onConfirm: () => deleteCategory(cat.id) })} className="p-3 text-black/10 hover:text-red-500 transition-colors active:scale-90"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-2xl font-serif italic text-black group-hover:text-[#A68E74] transition-colors">{cat.name}</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-black mt-2">Active Atelier Series</p>
            </div>
            
            <div className="mt-10 pt-8 border-t border-black/[0.03] flex items-center justify-between">
              <span className="text-[10px] font-black text-black/20 italic uppercase tracking-widest">Protocol ID: {cat.id.slice(0, 8)}</span>
              <div className="w-2 h-2 rounded-full bg-[#A68E74]/40" />
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full py-40 text-center border border-dashed border-black/10 rounded-[3rem]">
             <h3 className="text-2xl font-serif text-black/20 italic">No Series Defined</h3>
             <p className="text-black/30 text-[10px] uppercase tracking-widest mt-4">Initialize the taxonomy to categorize your inventory</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#FCFCFA] w-full max-w-lg rounded-[3rem] shadow-2xl p-10 lg:p-14 border border-black/5 animate-scaleIn">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-3xl font-serif italic text-black">{editingCategory ? 'Modify Series' : 'New Series Protocol'}</h3>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#A68E74] font-black mt-2">Registry Inscription</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all active:scale-90"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveCategory} className="space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-black px-2">Label Designation</label>
                <input 
                  className="w-full bg-white rounded-2xl p-6 text-lg font-bold border border-black/10 focus:border-[#A68E74] outline-none shadow-sm transition-all" 
                  placeholder="e.g. Minimalist Series" 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="flex flex-col gap-4">
                <button type="submit" className="w-full bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  {editingCategory ? 'Update Protocol' : 'Memorialize Series'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-4 text-[9px] uppercase font-black tracking-widest text-black/20 hover:text-black transition-colors">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && <ConfirmDialog isOpen={!!confirm} title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminCollections;
