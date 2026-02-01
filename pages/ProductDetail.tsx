
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Star, Share, ChevronLeft, ChevronRight, ShoppingBag } from '../components/Icons';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Customization State
  const [selectedStrap, setSelectedStrap] = useState('Italian Leather');
  const [selectedDial, setSelectedDial] = useState('Midnight');

  const product = products.find(p => p.id === id);
  if (!product) return <div className="pt-40 text-center font-serif text-2xl">Masterpiece not found.</div>;

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const strapOptions = [
    { name: 'Italian Leather', description: 'Artisan hand-stitched calfskin.', price: 0 },
    { name: 'Milanese Mesh', description: 'Fluid stainless steel weave.', price: 150 },
    { name: 'Brushed Steel', description: 'Robust architectural bracelet.', price: 200 },
  ];

  const dialOptions = [
    { name: 'Midnight', hex: '#1A1A1A', description: 'Deep obsidian matte' },
    { name: 'Ivory', hex: '#FDFBF7', description: 'Classic bone enamel' },
    { name: 'Champagne', hex: '#E2D1B3', description: 'Sunray sunburst gold' },
    { name: 'Slate', hex: '#4A4A4A', description: 'Metallic brushed grey' },
  ];

  useEffect(() => {
    setIsConfiguring(true);
    const timer = setTimeout(() => setIsConfiguring(false), 600);
    return () => clearTimeout(timer);
  }, [selectedStrap, selectedDial]);

  const handleShare = async () => {
    const shareData = {
      title: `AEVO | ${product.name}`,
      text: `Discover the ${product.name} at AEVO Horology.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      alert("This piece is currently held in our archives (Sold Out). Please contact our concierge to be notified of future releases.");
      return;
    }
    alert(`Acquisition request received for the ${product.name}. Our White-Glove service team will contact you within 24 hours to arrange secure delivery and payment.`);
  };

  const calculateTotalPrice = () => {
    const strapPrice = strapOptions.find(s => s.name === selectedStrap)?.price || 0;
    return product.price + strapPrice;
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Piece Archived (Sold Out)', color: 'text-red-500', sub: 'Waitlist Open', dot: 'bg-red-500' };
    if (product.stock <= 5) return { label: 'Limited Scarcity', color: 'text-[#C5A059]', sub: `Only ${product.stock} pieces remaining`, dot: 'bg-[#C5A059]' };
    return { label: 'In the Vault (In Stock)', color: 'text-emerald-600', sub: 'Ready for immediate dispatch', dot: 'bg-emerald-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="pt-32 pb-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-4 text-[9px] uppercase tracking-[0.5em] text-gray-400 mb-20 animate-fadeIn">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Collection</Link>
          <span className="opacity-30">/</span>
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 mb-40">
          {/* Gallery Section */}
          <div className="space-y-10 lg:sticky lg:top-32 h-fit">
            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative group shadow-2xl border border-[#F5F1E9] flex items-center justify-center">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-[3000ms] ease-out group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <button 
                  onClick={() => setActiveImage(prev => (prev - 1 + product.images.length) % product.images.length)} 
                  className="p-5 bg-white/95 backdrop-blur-2xl rounded-full shadow-2xl hover:bg-[#2C2A28] hover:text-white transition-all transform active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev + 1) % product.images.length)} 
                  className="p-5 bg-white/95 backdrop-blur-2xl rounded-full shadow-2xl hover:bg-[#2C2A28] hover:text-white transition-all transform active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-6">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-28 overflow-hidden rounded-2xl border-2 transition-all p-3 duration-700 ${
                    i === activeImage 
                    ? 'border-[#C5A059] bg-white shadow-2xl scale-110 translate-y-[-4px]' 
                    : 'border-transparent opacity-30 hover:opacity-100 bg-white/50'
                  }`}
                >
                  <img src={img} alt={product.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-14">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.7em]">{product.category}</span>
                <div className="flex items-center space-x-6">
                  <button onClick={handleShare} className="relative group text-gray-400 hover:text-black transition-all">
                    <Share className="w-6 h-6" />
                    {shareFeedback && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest font-bold text-[#C5A059] whitespace-nowrap">Link Copied</span>}
                  </button>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif leading-[1.05] text-[#2C2A28] mb-8">{product.name}</h1>
              <div className="flex items-center space-x-10">
                <div className="flex text-[#C5A059] space-x-1.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} fill={s <= Math.floor(product.rating) ? 'currentColor' : 'none'} className="w-5 h-5" />)}
                </div>
                <span className="text-[10px] text-gray-300 uppercase tracking-[0.4em] font-bold">Limited Series Production</span>
              </div>
            </div>

            <div className="mb-14 pb-10 border-b border-[#F5F1E9]">
              <p className="text-xl text-gray-500 font-light leading-relaxed italic">
                {product.description}
              </p>
            </div>

            <div className="space-y-16">
               {/* Customization & Config */}
               <div className="grid grid-cols-2 gap-12 animate-fadeInUp">
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-6">Dial Finition</label>
                   <div className="flex space-x-4">
                     {dialOptions.map(opt => (
                       <button 
                         key={opt.name} 
                         onClick={() => setSelectedDial(opt.name)}
                         className={`w-10 h-10 rounded-full border-2 transition-all duration-500 flex items-center justify-center p-0.5 ${selectedDial === opt.name ? 'border-[#C5A059] scale-125 shadow-lg' : 'border-transparent hover:border-gray-200'}`}
                       >
                         <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: opt.hex }} />
                       </button>
                     ))}
                   </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-6">Band Selection</label>
                    <select 
                      value={selectedStrap} 
                      onChange={(e) => setSelectedStrap(e.target.value)}
                      className="bg-transparent border-b border-[#F5F1E9] text-[10px] uppercase tracking-widest font-bold py-2 w-full focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      {strapOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                    </select>
                 </div>
               </div>

               {/* Stock & Scarcity Indicator */}
               <div className="flex items-center space-x-6 py-4 px-8 bg-white border border-[#F5F1E9] rounded-3xl shadow-sm animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                 <div className={`w-3 h-3 rounded-full ${stockStatus.dot} animate-pulse shadow-lg`} />
                 <div>
                   <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${stockStatus.color}`}>{stockStatus.label}</p>
                   <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium">{stockStatus.sub}</p>
                 </div>
               </div>

               {/* Investment Summary */}
               <div className={`p-8 bg-white border border-[#F5F1E9] rounded-[2.5rem] transition-all duration-500 ${isConfiguring ? 'scale-[1.02] shadow-xl' : 'shadow-sm'}`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Final Investment</span>
                    <span className="text-4xl font-light tracking-tighter text-[#2C2A28] transition-all duration-500">
                      ${calculateTotalPrice().toLocaleString()}
                    </span>
                  </div>
               </div>

               {/* Primary Action Buttons */}
               <div className="pt-4 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                 <div className="flex flex-col gap-4">
                   <button 
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className={`w-full py-8 rounded-[2rem] uppercase text-[11px] font-bold tracking-[0.6em] transition-all duration-700 flex items-center justify-center space-x-6 shadow-2xl group ${
                        product.stock === 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none' 
                          : 'bg-[#2C2A28] text-white hover:bg-[#C5A059]'
                      }`}
                   >
                     <ShoppingBag className="w-6 h-6 transition-transform duration-700 group-hover:scale-125" />
                     <span>{product.stock === 0 ? 'Waitlist for Re-release' : 'Acquire Piece Now'}</span>
                   </button>
                 </div>
                 <p className="text-center mt-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                   Authenticated ownership through private ledger
                 </p>
               </div>

               {/* Technicals */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-[#F5F1E9] animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-[#FDFBF7]">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">{key}</span>
                      <span className="text-xs text-[#2C2A28] font-medium tracking-tight">{value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Heritage Section */}
        <section className="py-40 border-y border-[#F5F1E9] text-center mb-40 animate-fadeInUp">
          <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.8em] mb-10 block">Geneva Workshops</span>
          <h2 className="text-5xl md:text-6xl font-serif italic text-[#2C2A28] mb-14">"Precision is a matter of patience."</h2>
          <p className="text-gray-400 text-2xl font-light leading-relaxed max-w-4xl mx-auto italic">
            At AEVO, we believe a clock is not a tool for measuring time, but an anchor in the present. Each {product.name} is hand-finished by master watchmakers with over 40 years of experience, ensuring every oscillation is a tribute to heritage.
          </p>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="animate-fadeInUp">
            <div className="flex justify-between items-end mb-20">
              <div>
                <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.4em] mb-4 block">Recommended for You</span>
                <h2 className="text-5xl font-serif text-[#2C2A28]">Complementary Pieces</h2>
              </div>
              <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.4em] border-b border-[#2C2A28] pb-2 hover:text-[#C5A059] hover:border-[#C5A059] transition-all">Full Collection</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
