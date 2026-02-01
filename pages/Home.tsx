
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
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#0F0F0F]">
        {banners.length > 0 ? banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${index === activeBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0F0F0F]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 text-[#C5A059] animate-fadeInUp">
                {banner.tag_label}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif mb-8 max-w-5xl leading-tight text-white italic animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {banner.title}
              </h1>
              <p className="text-white/40 text-base md:text-xl font-light italic mb-10 max-w-xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {banner.subtitle}
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-full uppercase text-[10px] font-black tracking-[0.3em] transition-all animate-fadeInUp" 
                style={{ animationDelay: '0.6s' }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Discover Piece</span>
                <div className="absolute inset-0 bg-[#C5A059] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 uppercase tracking-[1em] text-xs">Awaiting Assets</div>
        )}
        
        {/* Controls - Mobile Hidden for cleaner look */}
        {banners.length > 1 && (
          <div className="hidden sm:flex absolute bottom-12 left-1/2 -translate-x-1/2 z-20 items-center space-x-12">
            <button onClick={() => setActiveBanner(prev => (prev - 1 + banners.length) % banners.length)} className="text-white/20 hover:text-white">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="flex space-x-4">
              {banners.map((_, i) => (
                <div key={i} className={`h-px transition-all duration-1000 ${i === activeBanner ? 'w-10 bg-[#C5A059]' : 'w-4 bg-white/10'}`} />
              ))}
            </div>
            <button onClick={() => setActiveBanner(prev => (prev + 1) % banners.length)} className="text-white/20 hover:text-white">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </section>

      {/* Discovery Filter */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-10 space-y-8 md:space-y-0">
            <div className="flex space-x-8 md:space-x-12 overflow-x-auto no-scrollbar w-full md:w-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[9px] uppercase font-bold tracking-[0.4em] transition-all relative pb-4 whitespace-nowrap
                    ${activeTab === tab ? 'text-[#C5A059]' : 'text-white/30 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />}
                </button>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">
              Archived pieces: {filteredProducts.length}
            </div>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Quote Section */}
      <section className="py-32 md:py-48 bg-[#1A1918] border-y border-white/5 text-center">
        <div className="container mx-auto px-6">
          <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.8em] block mb-10">Geneva Atelier</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-white/90 max-w-4xl mx-auto leading-tight">
            "We don't sell clocks. We archive moments in Swiss-engineered steel."
          </h2>
          <div className="w-12 h-px bg-white/10 mx-auto mt-12" />
        </div>
      </section>
    </main>
  );
};

export default Home;
