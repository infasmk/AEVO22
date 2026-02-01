
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Star, Share, ChevronLeft, ChevronRight, ShoppingBag, Compass, Feather, Shield, Diamond, UserIcon } from '../components/Icons';
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
    { name: 'Milanese Mesh', description: 'Fluid stainless steel weave.', price: 12500 },
    { name: 'Brushed Steel', description: 'Robust architectural bracelet.', price: 18000 },
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
    alert(`Acquisition request received for the ${product.name}. Our White-Glove service team will contact you within 24 hours to arrange secure delivery and payment in INR.`);
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

  const keyFeatures = [
    { 
      id: '01',
      icon: <Compass className="w-12 h-12" />, 
      title: "Precision Caliber", 
      desc: "An in-house chronometer movement engineered with aerospace precision, offering a deviation of less than 0.5 seconds daily." 
    },
    { 
      id: '02',
      icon: <Feather className="w-12 h-12" />, 
      title: "Hand Finished", 
      desc: "Each bevel, bridge, and screw is meticulously polished by master Geneva artisans using century-old techniques." 
    },
    { 
      id: '03',
      icon: <Shield className="w-12 h-12" />, 
      title: "Legacy Build", 
      desc: "Forged from surgical-grade 316L stainless steel, designed to retain its architectural integrity for multiple generations." 
    },
    { 
      id: '04',
      icon: <Diamond className="w-12 h-12" />, 
      title: "Rare Elements", 
      desc: "Incorporating rare volcanic obsidian and sapphire crystal lenses to ensure unparalleled clarity and scratch resistance." 
    }
  ];

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
            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative group shadow-2xl border border-[#F5F1E9]">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/5">
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
                  className={`w-20 h-24 overflow-hidden rounded-2xl border-2 transition-all duration-700 ${
                    i === activeImage 
                    ? 'border-[#C5A059] bg-white shadow-2xl scale-110 translate-y-[-4px]' 
                    : 'border-transparent opacity-30 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={product.name} className="w-full h-full object-cover" />
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
                      ₹{calculateTotalPrice().toLocaleString('en-IN')}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* REDESIGNED: The Anatomy of Excellence */}
        <section className="mb-40 animate-fadeInUp">
          <div className="text-center mb-24">
            <span className="text-[#C5A059] uppercase text-[11px] font-bold tracking-[0.8em] block mb-6">The Anatomy of Excellence</span>
            <h2 className="text-5xl md:text-6xl font-serif text-[#2C2A28]">Engineering Mastery</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {keyFeatures.map((feature, idx) => (
              <div 
                key={feature.id} 
                className={`flex flex-col md:flex-row gap-10 p-12 bg-white rounded-[3.5rem] border border-[#F5F1E9] transition-all duration-1000 hover:shadow-[0_50px_100px_-20px_rgba(197,160,89,0.1)] group ${
                  idx % 2 === 0 ? '' : 'md:translate-y-16'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-[#FDFBF7] rounded-3xl flex items-center justify-center text-[#C5A059] transition-all duration-700 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white shadow-sm group-hover:shadow-2xl">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="font-serif text-2xl italic text-[#C5A059] opacity-40">{feature.id}</span>
                    <h3 className="font-serif text-3xl text-[#2C2A28] leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 text-base leading-relaxed font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ENHANCED: Acquire Piece Section - Updated to sharp rectangle layout */}
        <section className="mb-40 animate-fadeInUp">
          <div className="relative overflow-hidden bg-[#1A1918] rounded-[4rem] shadow-[0_100px_150px_-40px_rgba(0,0,0,0.6)] group">
            {/* Visual Flair Elements */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#C5A059]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059] blur-[120px] opacity-[0.05] -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
              {/* Left Column: The Narrative */}
              <div className="lg:col-span-7 p-12 md:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="h-px w-12 bg-[#C5A059]" />
                  <span className="text-[#C5A059] uppercase text-[11px] font-extrabold tracking-[0.6em]">Exclusive Acquisition</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                  Your <span className="italic text-[#C5A059]">Heritage</span> <br />Begins Today.
                </h2>
                
                <p className="text-white/50 text-lg font-light leading-relaxed max-w-xl mb-12 italic">
                  Acquiring an AEVO timepiece is more than a purchase; it is a commitment to excellence. 
                  Every piece in our collection is strictly numbered and hand-delivered by our private concierge network.
                </p>

                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                  <div className="flex items-start space-x-5">
                    <Shield className="w-8 h-8 text-[#C5A059] flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Authenticated</h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">Physical & NFT Certificate</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <UserIcon className="w-8 h-8 text-[#C5A059] flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">White-Glove</h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">Insured Global Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: The Transaction */}
              <div className="lg:col-span-5 p-12 md:p-20 flex flex-col items-center justify-center bg-[#2C2A28]/30 backdrop-blur-xl">
                <div className="text-center w-full space-y-12">
                  <div className="space-y-2">
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold block">Final Valuation</span>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-7xl font-light text-white tracking-tighter leading-none mb-2 transition-all duration-700">
                        ₹{calculateTotalPrice().toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/20 line-through text-xl font-light tracking-widest">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative group/btn w-full">
                    {/* BUTTON UPDATED: rounded-none for sharp rectangle aesthetic */}
                    <button 
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className={`w-full py-9 rounded-none uppercase text-[12px] font-black tracking-[0.8em] transition-all duration-700 flex items-center justify-center space-x-6 relative z-10 ${
                        product.stock === 0 
                          ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10' 
                          : 'bg-[#C5A059] text-white hover:bg-white hover:text-black shadow-[0_20px_60px_-10px_rgba(197,160,89,0.4)]'
                      }`}
                    >
                      <ShoppingBag className="w-7 h-7 transition-transform duration-700 group-hover/btn:scale-125" />
                      <span>{product.stock === 0 ? 'Waitlist Open' : 'Secure This Piece'}</span>
                    </button>
                    {/* Shadow pulse effect - updated to rounded-none */}
                    <div className="absolute inset-0 bg-[#C5A059] rounded-none blur-[40px] opacity-0 group-hover/btn:opacity-20 transition-opacity duration-700" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-medium max-w-[240px] mx-auto leading-relaxed">
                      Complimentary personal laser engraving included with all direct acquisitions.
                    </p>
                    <div className="flex justify-center space-x-3 opacity-30 group-hover:opacity-60 transition-opacity duration-1000">
                      {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-40 border-y border-[#F5F1E9] text-center mb-40 animate-fadeInUp">
          <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.8em] mb-10 block">Geneva Workshops</span>
          <h2 className="text-5xl md:text-6xl font-serif italic text-[#2C2A28] mb-14">"Precision is a matter of patience."</h2>
          <p className="text-gray-400 text-2xl font-light leading-relaxed max-w-4xl mx-auto italic">
            At AEVO, we believe a clock is not a tool for measuring time, but an anchor in the present. Each {product.name} is hand-finished by master watchmakers with over 40 years of experience, ensuring every oscillation is a tribute to heritage.
          </p>
        </section>

        {/* Technicals */}
        <div className="mb-40">
           <div className="flex items-center space-x-6 mb-12">
             <h2 className="text-4xl font-serif text-[#2C2A28]">Technical Dossier</h2>
             <div className="h-px flex-1 bg-[#F5F1E9]" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-2 pb-6 border-b border-[#F5F1E9] group">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold group-hover:translate-x-1 transition-transform">{key}</span>
                  <span className="text-xl text-[#2C2A28] font-light tracking-tight italic">{value}</span>
                </div>
              ))}
              <div className="flex flex-col space-y-2 pb-6 border-b border-[#F5F1E9]">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">Standard Warranty</span>
                <span className="text-xl text-[#2C2A28] font-light tracking-tight italic">5 Year Global</span>
              </div>
           </div>
        </div>

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
