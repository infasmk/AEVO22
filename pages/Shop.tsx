
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('latest');
  
  // Fix: categories should be string[] to match Product.category which is a string
  const categories: string[] = ['Men', 'Women', 'Wall Clocks', 'Smart Clocks', 'Luxury Series'];
  const activeCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    switch (sortBy) {
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'best-selling': result = [...result].filter(p => p.tag === 'Best Seller'); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="pt-32 pb-32 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 italic">The Collection</h1>
          <p className="text-white/40 max-w-xl mx-auto italic font-light text-sm md:text-base">
            Engineered for longevity. Curated for the discerning.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] border-b border-white/5 pb-4">Collections</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-xs uppercase tracking-widest transition-colors ${!activeCategory ? 'text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    All Series
                  </button>
                </li>
                {categories.map(c => (
                  <li key={c}>
                    <button 
                      onClick={() => setSearchParams({ category: c })}
                      className={`text-xs uppercase tracking-widest transition-colors ${activeCategory === c ? 'text-white' : 'text-white/40 hover:text-white'}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] border-b border-white/5 pb-4">Sort Protocol</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#1A1918] text-white/80 text-[10px] uppercase tracking-widest border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="latest">Latest Acquisitions</option>
                <option value="price-low">Price: Ascending</option>
                <option value="price-high">Price: Descending</option>
                <option value="best-selling">High Momentum</option>
              </select>
            </div>

            <div className="p-8 bg-[#1A1918] rounded-3xl border border-white/5 space-y-4">
              <h4 className="font-serif text-white text-lg">Concierge</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Private viewing requests for the Luxury Series are handled via encrypted channel.</p>
              <button className="w-full bg-[#C5A059] text-white py-4 rounded-full text-[9px] uppercase font-black tracking-widest hover:scale-105 transition-transform">Book Viewing</button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10 text-[9px] uppercase tracking-widest text-white/20 font-bold">
              <span>Cataloged: {filteredProducts.length} Entries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Fix: Added missing required index prop */}
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
                <h3 className="text-2xl font-serif text-white mb-4">Archive Empty</h3>
                <p className="text-white/40 text-sm italic mb-8">Try adjusting your filtration criteria.</p>
                <button onClick={() => {setSearchParams({}); setSortBy('latest');}} className="text-[#C5A059] text-[9px] uppercase font-bold tracking-[0.4em] border-b border-[#C5A059] pb-2">Reset Protocols</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
