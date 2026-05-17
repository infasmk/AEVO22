
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate } = ReactRouterDOM;
import { useStore } from '../store';
import { Star, Share, ChevronLeft, Heart, Compass, Feather, Shield, Diamond, Clock } from '../components/Icons';
import SEO from '../components/SEO';
import { ColorOption } from '../types';
import CountdownTimer from '../components/CountdownTimer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, offer } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const product = products.find(p => p.id === id);
  if (!product) return <div className="pt-40 text-center font-serif text-2xl text-black/40">Masterpiece not found.</div>;

  const isWishlisted = wishlist.includes(product.id);
  
  const getIcon = (idx: number): React.ReactElement<{ className?: string }> => {
    const icons = [<Compass />, <Feather />, <Shield />, <Diamond />];
    return icons[idx % icons.length] as React.ReactElement<{ className?: string }>;
  };

  const handleAcquire = () => {
    const phoneNumber = "919745019658";
    const colorText = selectedColor ? `Selected Finish: ${selectedColor.name}` : "";
    const message = `Hello AEVO Atelier, I am interested in acquiring the following masterpiece:
    
Piece: ${product.name}
ID: ${product.id}
Price: ₹${(product.price || 0).toLocaleString('en-IN')}
${colorText}

Please guide me through the acquisition process.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-32 bg-[#FCFCFA]">
      <SEO title={product.name} description={product.description.slice(0, 155)} />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
           <button onClick={() => navigate(-1)} className="text-[#A68E74] hover:text-black flex items-center space-x-2 text-[10px] uppercase tracking-widest transition-colors font-black">
             <ChevronLeft className="w-4 h-4" />
             <span className="hidden sm:inline">Back to Archive</span>
             <span className="sm:hidden">Back</span>
           </button>
           <div className="flex space-x-6">
              <button 
                onClick={() => toggleWishlist(product.id)} 
                className={`transition-all active:scale-90 ${isWishlisted ? 'text-black' : 'text-[#A68E74] hover:text-black'}`}
              >
                <Heart fill={isWishlisted ? 'currentColor' : 'none'} className="w-5 h-5" />
              </button>
              <button onClick={() => {}} className="text-[#A68E74] hover:text-black transition-colors active:scale-90">
                <Share className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 mb-20 lg:mb-32">
          {/* Visual Showcase */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-[#FDFBF7] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-black/5 relative group shadow-sm">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105 mix-blend-multiply opacity-90" 
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${activeImage === i ? 'border-[#A68E74] opacity-100 shadow-md' : 'border-transparent opacity-40 hover:opacity-70'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Narrative */}
          <div className="flex flex-col pt-0 lg:pt-4">
            <span className="text-[#A68E74] uppercase text-[9px] md:text-[10px] font-black tracking-[0.5em] mb-4 md:mb-6">{product.category} Series</span>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-serif text-black/80 mb-6 md:mb-10 italic leading-tight tracking-tight">
              {product.name}
            </h1>
            
            {/* Active Offer Countdown */}
            {offer && offer.is_active && (
              <div className="mb-8 p-6 bg-black rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 group animate-fadeIn">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#A68E74] text-black rounded-full flex items-center justify-center animate-pulse">
                       <span className="text-[10px] font-black">{offer.percentage}%</span>
                    </div>
                    <div>
                       <p className="text-[9px] uppercase tracking-widest text-[#A68E74] font-black">Limited Event Advantage</p>
                       <p className="text-white text-xs font-serif italic">{offer.heading}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Clock className="w-3 h-3 text-[#A68E74]" />
                    <CountdownTimer 
                       endTime={offer.end_time || ''} 
                       className="text-[10px] text-white"
                    />
                 </div>
              </div>
            )}

            <div className="flex items-center space-x-6 mb-8 md:mb-12">
               <span className="text-2xl md:text-3xl font-light text-[#A68E74] tracking-tighter italic font-serif">₹{(product.price || 0).toLocaleString('en-IN')}</span>
               <div className="h-4 w-px bg-black/10" />
               <div className="flex text-[#A68E74] space-x-1">
                 {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5" />)}
               </div>
            </div>

            <p className="text-black/50 text-base md:text-lg italic font-light leading-relaxed mb-10 md:mb-16 max-w-xl">
              {product.description}
            </p>

            {/* CINEMATIC SWATCH SELECTION */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10 md:mb-16 border-t border-black/5 pt-10">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-black">Atelier Colorway</span>
                  {selectedColor && (
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#A68E74] font-black animate-fadeIn">
                      {selectedColor.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-5 md:gap-7">
                  {product.colors.map(color => {
                    const isActive = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-10 h-10 md:w-11 md:h-11 rounded-full transition-all duration-500 flex items-center justify-center ${isActive ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
                        title={color.name}
                      >
                        {/* Selection Ring */}
                        <div className={`absolute -inset-1.5 md:-inset-2 rounded-full border border-[#A68E74]/40 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                        
                        {/* Swatch Circle */}
                        <div 
                          className={`w-full h-full rounded-full border border-black/5 shadow-inner transition-transform duration-500 ${isActive ? 'scale-90' : 'group-hover:scale-95'}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Call to Action - Moved Up */}
                <div className="mt-12 md:mt-16">
                  <button 
                    onClick={handleAcquire}
                    className="w-full bg-[#A68E74] text-white py-6 md:py-8 rounded-full text-[11px] md:text-[12px] font-black uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-4 shadow-[#A68E74]/20"
                  >
                    <span>Secure Acquisition</span>
                  </button>
                  <p className="mt-6 text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#A68E74]/60 font-black">Direct line to the AEVO Artisan Concierge</p>
                </div>
              </div>
            )}
            
            {/* Fallback button if no colors */}
            {(!product.colors || product.colors.length === 0) && (
              <div className="mt-8">
                <button 
                  onClick={handleAcquire}
                  className="w-full bg-[#A68E74] text-white py-6 md:py-8 rounded-full text-[11px] md:text-[12px] font-black uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-4 shadow-[#A68E74]/20"
                >
                  <span>Secure Acquisition</span>
                </button>
                <p className="mt-6 text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#A68E74]/60 font-black">Direct line to the AEVO Artisan Concierge</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Anatomy of Excellence Section */}
        <div className="pt-16 md:pt-24 border-t border-black/5 mb-16 md:mb-24">
          <h2 className="text-[#A68E74] uppercase text-[9px] font-black tracking-[0.8em] mb-10 md:mb-16 text-center">Anatomy of Excellence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto px-4">
              {(product.key_features || []).map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-[#A68E74]/60 group-hover:text-[#A68E74] group-hover:scale-110 transition-all border border-black/[0.03] shrink-0">
                    {React.cloneElement(getIcon(idx), { className: 'w-5 h-5' })}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-black/80 text-base md:text-lg font-serif italic leading-none">{item.title}</h3>
                    <p className="text-black/40 text-xs md:text-[13px] italic font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
              {(!product.key_features || product.key_features.length === 0) && (
                <div className="col-span-full text-center py-10 opacity-20 italic font-serif text-sm">Registry archives for this piece are in preparation.</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
