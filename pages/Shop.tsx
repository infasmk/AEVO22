
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Category } from '../types';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('latest');
  
  const categories: Category[] = ['Men', 'Women', 'Wall Clocks', 'Smart Clocks', 'Luxury Series'];
  const activeCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    switch (sortBy) {
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      // Fix: Use the correct tag check for best sellers instead of non-existent isBestSeller property
      case 'best-selling': result = [...result].filter(p => p.tag === 'Best Seller'); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif mb-4">The Collection</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Explore our curated selection of fine horological instruments, from wall-mounted masterpieces to intimate wrist companions.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#F5F1E9]">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-sm tracking-wide hover:text-[#C5A059] transition-colors ${!activeCategory ? 'text-[#C5A059] font-medium' : 'text-gray-500'}`}
                  >
                    All Collections
                  </button>
                </li>
                {categories.map(c => (
                  <li key={c}>
                    <button 
                      onClick={() => setSearchParams({ category: c })}
                      className={`text-sm tracking-wide hover:text-[#C5A059] transition-colors ${activeCategory === c ? 'text-[#C5A059] font-medium' : 'text-gray-500'}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#F5F1E9]">Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-sm border-b border-gray-300 py-2 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
              </select>
            </div>

            <div className="p-6 bg-[#F5F1E9]">
              <h4 className="font-serif text-lg mb-4">Need Advice?</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">Our horologists are available for private consultations.</p>
              <button className="w-full bg-black text-white py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C5A059] transition-colors">Book Consult</button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              <span>Showing {filteredProducts.length} Results</span>
              <div className="hidden md:flex space-x-4">
                <button className="text-black">Grid View</button>
                <button className="hover:text-black">List View</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-serif mb-4">No pieces found</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters or explore our latest arrivals.</p>
                <button onClick={() => {setSearchParams({}); setSortBy('latest');}} className="bg-black text-white px-8 py-3 uppercase text-[10px] font-bold tracking-widest">Reset All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
