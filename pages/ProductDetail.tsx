
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Star, Share, ChevronLeft, ChevronRight, ShoppingBag, Heart, X, Compass, Feather, Shield, Diamond } from '../components/Icons';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist } = useStore();
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find(p => p.id === id);
  if (!product) return <div className="pt-40 text-center font-serif text-2xl text-white">Masterpiece not found.</div>;

  const isWishlisted = wishlist.includes(product.id);
  
  // Fix: Added explicit return type to getIcon to support React.cloneElement props
  const getIcon = (idx: number): React.ReactElement<{ className?: string }> => {
    const icons = [<Compass />, <Feather />, <Shield />, <Diamond />];
    return icons[idx % icons.length] as React.ReactElement<{ className?: string }>;
  };

  return (
    <div className="pt-24 pb-32 bg-[#0F0F0F]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-12">
           <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white flex items-center space-x-2 text-[10px] uppercase tracking-widest">
             <ChevronLeft className="w-4 h-4" />
             <span>Back</span>
           </button>
           <div className="flex space-x-6">
              <button onClick={() => toggleWishlist(product.id)} className={`transition-colors ${isWishlisted ? 'text-[#C5A059]' : 'text-white/40'}`}>
                <Heart fill={isWishlisted ? 'currentColor' : 'none'} className="w-5 h-5" />
              </button>
              <button onClick={() => {}} className="text-white/40">
                <Share className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-[#1A1918] rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
              <img src={product.images[activeImage]} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[9px] text-white/60 tracking-widest uppercase">
                {activeImage + 1} / {product.images.length}
              </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-[#C5A059] opacity-100' : 'border-transparent opacity-30 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col pt-4">
            <span className="text-[#C5A059] uppercase text-[10px] font-black tracking-[0.5em] mb-4">{product.category} Series</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 italic leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-6 mb-12">
               <span className="text-3xl font-light text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
               <div className="h-4 w-px bg-white/10" />
               <div className="flex text-[#C5A059] space-x-1">
                 {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4" />)}
               </div>
            </div>

            <p className="text-white/50 text-base md:text-lg italic font-light leading-relaxed mb-16 max-w-xl">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-16 border-y border-white/5 py-12">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 font-black">{k}</span>
                  <p className="text-white/80 font-serif italic text-lg">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-auto">
              <button onClick={() => alert('Commission Request Initiated')} className="flex-1 bg-[#C5A059] text-white py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] transition-transform shadow-2xl">
                Secure Acquisition
              </button>
              <button className="flex-1 bg-white/5 text-white/80 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 hover:bg-white hover:text-black transition-all">
                Personal Consultation
              </button>
            </div>
          </div>
        </div>
        
        {/* Anatomy of Excellence Section */}
        {product.key_features && product.key_features.length > 0 && (
          <div className="mt-40 pt-32 border-t border-white/5 text-center">
            <span className="text-[#C5A059] uppercase text-[10px] font-black tracking-[0.8em] mb-12 block">Anatomy of Excellence</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
                {product.key_features.map((item, idx) => (
                  <div key={idx} className="p-12 bg-[#1A1918] rounded-[3rem] border border-white/5 space-y-6 group hover:border-[#C5A059]/30 transition-all">
                    <div className="w-16 h-16 bg-[#0F0F0F] rounded-2xl flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                      {/* Fix: Cast and use typed return from getIcon */}
                      {React.cloneElement(getIcon(idx), { className: 'w-8 h-8' })}
                    </div>
                    <h4 className="text-white text-2xl font-serif italic">{item.title}</h4>
                    <p className="text-white/40 text-sm italic font-light leading-relaxed">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
