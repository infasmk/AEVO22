
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, Outlet, useNavigate } = ReactRouterDOM;
import { useStore } from '../../store';
import { ShoppingBag, Star, Shield, Menu, X, Info, ChevronRight, Edit3, TrendingUp, MoreHorizontal } from '../../components/Icons';
import Toast from '../../components/Toast';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { signOut, user, isAdmin, exportData, importData, loadData } = useStore();
  const [showJsonPortal, setShowJsonPortal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleDiscardDraft = async () => {
    if (confirm("Are you sure? This will discard all local changes and sync with the latest server data.")) {
      localStorage.removeItem('aevo_v27_json_mode');
      await loadData(true);
      setToast({ message: "Registry Reverted to Server State", type: 'success' });
      setShowJsonPortal(false);
    }
  };

  const links = [
    { name: 'Insights', path: '/admin', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Showcase', path: '/admin/banners', icon: <Shield className="w-4 h-4" /> },
    { name: 'Promotions', path: '/admin/promotions', icon: <Star className="w-4 h-4" /> },
  ];

  const handleTerminate = async () => {
    await signOut();
  };

  const handleExport = () => {
    const data = exportData();
    navigator.clipboard.writeText(data);
    setToast({ message: "Registry Code Copied", type: 'success' });
  };

  const handleImport = () => {
    const success = importData(jsonInput);
    if (success) {
      setToast({ message: "Registry Updated Successfully", type: 'success' });
      setJsonInput('');
      setShowJsonPortal(false);
    } else {
      setToast({ message: "Invalid Protocol Format", type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFCFA] text-black overflow-x-hidden">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-[110] flex items-center justify-between px-4 lg:px-10">
         <div className="flex items-center space-x-3 md:space-x-6">
           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#A68E74] hover:bg-black/5 rounded-full transition-colors active:scale-90">
             {sidebarOpen ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
           </button>
           <Link to="/" className="font-serif text-lg md:text-xl tracking-tighter truncate max-w-[120px]">AEVO Atelier</Link>
         </div>
         
         <div className="flex items-center space-x-4 md:space-x-8">
           <button 
             onClick={() => setShowJsonPortal(true)}
             className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 bg-[#A68E74]/5 border-[#A68E74]/20 text-[#A68E74] hover:scale-105 active:scale-95 shadow-sm`}
           >
              <Edit3 className="w-3 h-3" />
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black whitespace-nowrap">JSON Portal</span>
           </button>
           
           <div className="hidden sm:flex flex-col items-end border-l border-black/5 pl-6">
             <span className="text-[7px] uppercase tracking-[0.2em] font-black text-black/30 leading-none">Artisan</span>
             <span className="text-[9px] font-bold text-[#A68E74] truncate max-w-[150px]">{user?.email}</span>
           </div>

           <button 
             onClick={handleTerminate}
             className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm flex items-center justify-center border border-red-100"
             title="Logout"
           >
             <X className="w-4 h-4" />
           </button>
         </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-black/[0.05] flex flex-col z-[120] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-black/[0.03] flex items-center justify-between">
          <Link to="/" className="text-xl font-serif text-black tracking-tighter">AEVO <span className="text-[7px] uppercase tracking-widest text-[#A68E74] ml-2 font-black">Atelier</span></Link>
          <button className="text-black/20 hover:text-black transition-colors" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-black ${location.pathname === link.path || (link.path === '/admin' && location.pathname === '/admin/') ? 'bg-black text-white shadow-xl' : 'text-black/30 hover:text-black hover:bg-black/[0.03]'}`}>
              {link.icon}<span>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-black/[0.03] bg-[#FDFBF9]/50">
           <button 
             onClick={handleTerminate} 
             className="w-full flex items-center justify-between px-5 py-4 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-[8px] uppercase tracking-[0.4em] font-black text-red-500 active:scale-95 shadow-sm group"
           >
             <span>Terminate Session</span><X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[115] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen pt-24 pb-20 px-4 md:px-10 lg:px-16`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* JSON Portal Modal */}
      {showJsonPortal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-fadeIn" onClick={() => setShowJsonPortal(false)} />
          <div className="relative bg-[#FCFCFA] w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-scaleIn border border-black/5">
            <div className="p-10 border-b border-black/[0.05] flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif italic text-black">Registry Data Protocol</h2>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#A68E74] font-black mt-2">Export/Import Protocol Interface</p>
              </div>
              <button onClick={() => setShowJsonPortal(false)} className="p-4 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-12 overflow-y-auto no-scrollbar max-h-[70vh]">
              {/* Instructions Section */}
              <div className="bg-[#A68E74]/5 border border-[#A68E74]/10 rounded-3xl p-8 space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#A68E74]">Post to Server Protocol</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: '01', title: 'Extract Code', desc: 'Copy the Registry Code from the section below.' },
                    { step: '02', title: 'Update Source', desc: 'Open data.json in the project code editor.' },
                    { step: '03', title: 'Deploy', desc: 'Paste the code, save, and redeploy to update all users.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <span className="text-xl font-serif italic text-[#A68E74]/30">{item.step}</span>
                       <h4 className="text-[9px] font-black uppercase tracking-widest">{item.title}</h4>
                       <p className="text-[10px] text-black/40 italic leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30">Current Registry State</h3>
                  <div className="flex gap-4">
                    <button onClick={handleDiscardDraft} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-all">Discard Local Edits</button>
                    <button onClick={handleExport} className="text-[10px] font-black uppercase tracking-widest text-[#A68E74] bg-[#A68E74]/5 px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">Copy Registry Code</button>
                  </div>
                </div>
                <div className="bg-black/5 p-8 rounded-3xl border border-black/10">
                  <pre className="text-[10px] font-mono text-black/60 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto thin-scrollbar">
                    {exportData()}
                  </pre>
                </div>
              </div>

              <div className="space-y-6 border-t border-black/5 pt-12">
                <div className="px-4">
                   <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30">Synchronize Registry</h3>
                   <p className="text-[11px] font-serif italic text-black/50 mt-2">Paste valid JSON protocol to update the archive state immediately.</p>
                </div>
                <textarea 
                  className="w-full h-48 bg-white border border-black/10 rounded-3xl p-8 text-[11px] font-mono text-black outline-none focus:border-[#A68E74] shadow-inner transition-all resize-none"
                  placeholder='Paste data here: { "products": [...], ... }'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <button 
                  onClick={handleImport}
                  className="w-full bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Apply Master Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminLayout;
