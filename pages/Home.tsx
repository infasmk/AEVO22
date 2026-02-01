
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { ChevronLeft, ChevronRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { ProductTag } from '../types';

const Home: React.FC = () => {
  const { banners, products } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductTag | 'All'>('All');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'All') return products;
    return products.filter(p => p.tag === activeTab);
  }, [products, activeTab]);

  const tabs: (ProductTag | 'All')[] = ['All', 'Latest', 'Best Seller', 'Offer'];

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 animate-fadeIn">{banner.tag}</span>
              <h1 className="text-6xl md:text-8xl font-serif mb-12 max-w-5xl leading-tight">
                {banner.title}
              </h1>
              <button className="bg-white text-black px-12 py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-xl">
                Shop Clocks
              </button>
            </div>
          </div>
        ))}
        
        {/* Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-12">
          <button onClick={() => setActiveBanner(prev => (prev - 1 + banners.length) % banners.length)} className="text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="flex space-x-4">
            {banners.map((_, i) => (
              <div key={i} className={`h-1 w-8 transition-all duration-500 ${i === activeBanner ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
          <button onClick={() => setActiveBanner(prev => (prev + 1) % banners.length)} className="text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#F5F1E9] pb-8">
            <div className="flex space-x-8 md:space-x-12 mb-8 md:mb-0 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] whitespace-nowrap transition-all duration-300 relative pb-4 
                    ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] transition-all duration-500" />}
                </button>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
              Found {filteredProducts.length} Premium Pieces
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid - Updated to 2 columns on mobile/tablet */}
      <section className="pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-40">
              <h2 className="text-4xl font-serif text-gray-300">No collections found in this category</h2>
              <button onClick={() => setActiveTab('All')} className="mt-8 uppercase text-[10px] font-bold tracking-widest border-b border-black">View All</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
