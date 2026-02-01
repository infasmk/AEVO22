
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, ChevronRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { ProductTag } from '../types';

const Home: React.FC = () => {
  const { banners, products, isLoading } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductTag | 'All'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setActiveBanner(prev => (prev + 1) % banners.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'All') return products;
    return products.filter(p => p.tag === activeTab);
  }, [products, activeTab]);

  const tabs: (ProductTag | 'All')[] = ['All', 'Latest', 'Best Seller', 'Offer'];

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#B88E4B]/20 border-t-[#B88E4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFA]">
      {/* Hero Section - Soft Morning Theme */}
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-[#FDFBF7]">
        {banners.length > 0 ? banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${index === activeBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#FCFCFA]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] mb-6 text-[#B88E4B] animate-fadeInUp">
                {banner.tag_label}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif mb-8 max-w-4xl leading-tight text-black/80 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {banner.title}
              </h1>
              <p className="text-black/40 text-sm md:text-lg font-light italic mb-10 max-w-lg animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {banner.subtitle}
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="group relative px-10 py-4 bg-black text-white rounded-full uppercase text-[9px] font-bold tracking-[0.3em] transition-all hover:scale-105 active:scale-95 animate-fadeInUp" 
                style={{ animationDelay: '0.6s' }}
              >
                Explore Atelier
              </button>
            </div>
          </div>
        )) : null}
        
        {/* Slider Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBanner(i)}
                className={`h-1 rounded-full transition-all duration-700 ${i === activeBanner ? 'w-8 bg-[#B88E4B]' : 'w-2 bg-black/10'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Discovery Section - 2 Grid Layout */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-8 md:space-y-0">
            <div className="flex space-x-6 md:space-x-10 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] uppercase font-black tracking-[0.3em] transition-all relative pb-2 whitespace-nowrap
                    ${activeTab === tab ? 'text-black' : 'text-black/20 hover:text-black/40'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B88E4B]" />}
                </button>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-black/20 font-bold">
              Items: {filteredProducts.length}
            </div>
          </div>

          {/* Optimized 2-column grid for mobile/tablet */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Narrative Section */}
      <section className="py-24 md:py-32 bg-[#FDFBF7] border-y border-black/5 text-center">
        <div className="container mx-auto px-6">
          <span className="text-[#B88E4B] uppercase text-[9px] font-black tracking-[0.6em] block mb-8">Heritage</span>
          <h2 className="text-3xl md:text-5xl font-serif italic text-black/70 max-w-3xl mx-auto leading-relaxed">
            "We preserve the art of slowing down in a world of high-frequency pulses."
          </h2>
          <div className="w-10 h-px bg-black/5 mx-auto mt-10" />
        </div>
      </section>
    </main>
  );
};

export default Home;
