
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { ChevronLeft, ChevronRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { ProductTag } from '../types';

const Home: React.FC = () => {
  const { banners, products, isLoading } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductTag | 'All'>('All');

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
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[10px] uppercase tracking-[1em] opacity-20 italic">Curating Pieces...</div>;
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-[#1A1918]">
        {banners.length > 0 ? banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[10s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] mb-8 text-[#C5A059] animate-fadeInUp">
                {banner.tag_label}
              </span>
              <h1 className="text-6xl md:text-9xl font-serif mb-12 max-w-6xl leading-[0.9] italic animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {banner.title}
              </h1>
              <p className="text-white/50 text-xl font-light italic mb-12 max-w-2xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {banner.subtitle}
              </p>
              <button className="group relative overflow-hidden bg-white text-black px-16 py-6 rounded-full uppercase text-[10px] font-black tracking-[0.4em] hover:text-white transition-colors duration-500 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <span className="relative z-10">Discover Piece</span>
                <div className="absolute inset-0 bg-[#C5A059] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs uppercase tracking-widest">Awaiting Masterpiece Assets</div>
        )}
        
        {/* Controls */}
        {banners.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-16">
            <button onClick={() => setActiveBanner(prev => (prev - 1 + banners.length) % banners.length)} className="text-white/20 hover:text-[#C5A059] transition-all transform hover:scale-125">
              <ChevronLeft className="w-10 h-10" />
            </button>
            <div className="flex space-x-6">
              {banners.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveBanner(i)}
                  className={`h-0.5 transition-all duration-1000 ${i === activeBanner ? 'w-16 bg-[#C5A059]' : 'w-8 bg-white/10'}`} 
                />
              ))}
            </div>
            <button onClick={() => setActiveBanner(prev => (prev + 1) % banners.length)} className="text-white/20 hover:text-[#C5A059] transition-all transform hover:scale-125">
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        )}
      </section>

      {/* Product Discovery Filter */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#F5F1E9] pb-10">
            <div className="flex space-x-12 overflow-x-auto no-scrollbar w-full md:w-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] uppercase font-black tracking-[0.4em] transition-all duration-500 relative pb-6 
                    ${activeTab === tab ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#C5A059]" />}
                </button>
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold mt-8 md:mt-0">
              Vault Index: {filteredProducts.length} Selections
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
