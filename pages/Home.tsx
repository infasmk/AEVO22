
import React, { useState, useEffect, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { ProductTag } from '../types';

import CountdownTimer from '../components/CountdownTimer';
import { ArrowRight, Star } from '../components/Icons';

const Home: React.FC = () => {
  const { banners, products, isLoading, connectionStatus, offer, categories } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductTag | 'All'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setActiveBanner(prev => (prev + 1) % banners.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'All') return products;
    return products.filter(p => p.tag === activeTab);
  }, [products, activeTab]);

  const tabs: (ProductTag | 'All')[] = ['All', 'Latest', 'Best Seller', 'Offer'];

  // Registry state detection
  const isRegistryEmpty = connectionStatus === 'online' && products.length === 0;
  const isSyncInProgress = connectionStatus === 'connecting' || (isLoading && products.length === 0);

  if (isSyncInProgress) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-[#A68E74]/10 border-t-[#A68E74] rounded-full animate-spin"></div>
        <span className="text-[9px] uppercase tracking-[0.5em] font-black text-[#A68E74] animate-pulse">Syncing Live Registry</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFA]">
      <SEO 
        title="Artisanal Timepieces & Luxury Clocks" 
        description="AEVO Atelier offers a curated collection of artisanal timepieces, Geneva-born engineering, and minimalist luxury wall clocks."
      />

      {/* Hero Showcase */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        {banners.length > 0 ? banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-all duration-[2s] ease-in-out ${index === activeBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FCFCFA] via-transparent to-black/10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <span className="text-[10px] font-black uppercase tracking-[0.8em] mb-6 text-white animate-fadeInUp">
                {banner.tag_label}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif mb-8 max-w-5xl leading-[1.1] text-white animate-fadeInUp">
                {banner.title}
              </h1>
              <p className="text-white/80 text-sm md:text-lg font-light italic mb-10 max-w-lg animate-fadeInUp">
                {banner.subtitle}
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="px-12 py-4 bg-[#A68E74] text-white rounded-full uppercase text-[9px] font-black tracking-[0.3em] transition-all hover:scale-105 active:scale-95 animate-fadeInUp shadow-2xl" 
              >
                Browse Archive
              </button>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1F1A16]">
            <span className="font-serif italic text-[#A68E74] text-xl opacity-30 tracking-widest animate-pulse">Awaiting Showcase Synchronization...</span>
          </div>
        )}
        
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBanner(i)}
                className={`h-0.5 transition-all duration-700 ${i === activeBanner ? 'w-10 bg-white' : 'w-4 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Grid Showcase */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-8 md:space-y-0">
            <h2 className="text-2xl font-serif text-black/80">Curated Registry</h2>
            {!isRegistryEmpty && (
              <div className="flex space-x-8 md:space-x-12 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] uppercase font-black tracking-[0.4em] transition-all relative pb-2 whitespace-nowrap
                      ${activeTab === tab ? 'text-black' : 'text-black/20 hover:text-black/40'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#A68E74]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isRegistryEmpty ? (
            <div className="py-40 text-center border border-dashed border-black/10 rounded-[3rem] animate-fadeIn">
               <span className="text-[#A68E74] uppercase text-[9px] font-black tracking-[0.5em] mb-6 block">Live Sync Active</span>
               <h3 className="text-3xl font-serif text-black/20 italic mb-8">Registry is Uninitialized</h3>
               <p className="text-black/30 text-xs italic max-w-sm mx-auto leading-relaxed">
                 The AEVO Vault is connected to the live database, but no pieces have been enrolled. Use the Atelier Portal to populate the registry.
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Collections Section - Moved & Redesigned */}
      {!isSyncInProgress && categories.length > 0 && (
        <section className="py-20 md:py-32 bg-[#FDFBF9] border-y border-black/[0.02]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-[#A68E74] uppercase text-[8px] font-black tracking-[0.8em] block">Official Taxonomy</span>
                <h2 className="text-2xl md:text-4xl font-serif text-black italic">Atelier Series</h2>
              </div>
              <button 
                onClick={() => navigate('/shop')}
                className="text-[9px] uppercase font-black tracking-[0.4em] text-black/30 hover:text-[#A68E74] transition-colors flex items-center gap-3 group"
              >
                <span>View Full Registry</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {categories.slice(0, 4).map((cat, i) => (
                <div 
                  key={cat.id} 
                  onClick={() => navigate(`/shop?category=${cat.name}`)}
                  className="group relative h-[250px] md:h-[300px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-white border border-black/[0.03] shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  
                  {/* Find first product in this category for background image */}
                  {products.find(p => p.category === cat.name)?.images[0] ? (
                    <img 
                      src={products.find(p => p.category === cat.name)?.images[0]} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] group-hover:opacity-60 grayscale group-hover:grayscale-0" 
                      alt={cat.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F9F7F5]">
                       <span className="text-[8px] uppercase tracking-widest font-black text-black/5 italic">Pending Enrollment</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end">
                    <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight group-hover:text-[#A68E74] transition-colors">{cat.name}</h3>
                    <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] uppercase tracking-widest font-black text-white">View Series</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotion Section */}
      {offer && offer.is_active && (
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-6">
             <div className="relative overflow-hidden bg-black rounded-[3rem] p-10 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 group">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                   <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#A68E74] rounded-full blur-[120px] transition-transform duration-[3s] group-hover:scale-110" />
                </div>
                
                <div className="relative z-10 space-y-6 text-center md:text-left max-w-xl">
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                     <div className="w-10 h-10 border border-[#A68E74]/30 rounded-full flex items-center justify-center text-[#A68E74]">
                        <Star className="w-4 h-4 fill-[#A68E74]" />
                     </div>
                     <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#A68E74]">{offer.percentage}% Exclusive Advantage</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-serif italic text-white leading-tight">
                    {offer.heading}
                  </h2>
                  <p className="text-white/60 text-sm md:text-xl font-light italic max-w-md">
                    {offer.paragraph}
                  </p>
                  
                  <div className="pt-8">
                     <button 
                       onClick={() => navigate(offer.button_link || '/shop')}
                       className="group flex items-center space-x-6 text-white"
                     >
                        <div className="w-16 h-16 bg-[#A68E74] rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                           <ArrowRight className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] group-hover:text-[#A68E74] transition-colors">
                          {offer.button_text}
                        </span>
                     </button>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-10 md:min-w-[400px]">
                   <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Protocol Access Remaining</span>
                   <CountdownTimer 
                      endTime={offer.end_time || ''} 
                      variant="elaborate"
                      className="text-white"
                   />
                </div>
             </div>
          </div>
        </section>
      )}
      
      {/* Narrative Section */}
      <section className="py-24 md:py-40 bg-[#F9F7F5] border-y border-black/[0.03] text-center">
        <div className="container mx-auto px-6">
          <span className="text-[#A68E74] uppercase text-[9px] font-black tracking-[0.8em] block mb-10">Heritage</span>
          <h2 className="text-3xl md:text-6xl font-serif italic text-black/60 max-w-4xl mx-auto leading-tight px-4">
            "Artistry that honors the silence between seconds."
          </h2>
          <div className="w-12 h-px bg-[#A68E74]/30 mx-auto mt-12" />
        </div>
      </section>
    </main>
  );
};

export default Home;
