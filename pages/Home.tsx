
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
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
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'All') return products;
    return products.filter(p => p.tag === activeTab);
  }, [products, activeTab]);

  const tabs: (ProductTag | 'All')[] = ['All', 'Latest', 'Best Seller', 'Offer'];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AEVO Atelier",
    "url": "https://aevo.luxury",
    "logo": "https://aevo.luxury/logo.png",
    "description": "Artisanal Geneva-born atelier crafting luxury clocks and instruments of time.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+41-22-000-0000",
      "contactType": "customer service"
    }
  };

  // Only show spin loader if we have NO products at all
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A68E74]/20 border-t-[#A68E74] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFA]">
      <SEO 
        title="Artisanal Timepieces & Luxury Clocks" 
        description="AEVO Atelier offers a curated collection of artisanal timepieces, Geneva-born engineering, and minimalist luxury wall clocks."
        schema={organizationSchema}
      />

      {/* Hero Showcase */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[#FAF8F6]">
        {banners.length > 0 ? banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-all duration-[2s] ease-in-out ${index === activeBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-20 grayscale-[20%]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#FCFCFA]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <span className="text-[10px] font-black uppercase tracking-[0.8em] mb-6 text-[#A68E74] animate-fadeInUp">
                {banner.tag_label}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif mb-8 max-w-5xl leading-[1.1] text-black/80 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {banner.title}
              </h1>
              <p className="text-black/40 text-sm md:text-lg font-light italic mb-10 max-w-lg animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {banner.subtitle}
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="group relative px-12 py-4 bg-black text-white rounded-full uppercase text-[9px] font-black tracking-[0.3em] transition-all hover:scale-105 active:scale-95 animate-fadeInUp shadow-xl" 
                style={{ animationDelay: '0.6s' }}
              >
                Browse Archive
              </button>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FDFBF7]">
            <span className="font-serif italic text-black/20 text-xl">Atelier Gallery Loading...</span>
          </div>
        )}
        
        {/* Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBanner(i)}
                className={`h-0.5 transition-all duration-700 ${i === activeBanner ? 'w-10 bg-[#A68E74]' : 'w-4 bg-black/10'}`}
                aria-label={`Go to slide ${i + 1}`}
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          {filteredProducts.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <p className="text-black/20 font-serif italic text-lg">No pieces currently listed in this category.</p>
            </div>
          )}
        </div>
      </section>
      
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
