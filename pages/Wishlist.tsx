import React from 'react';
// Use star import to resolve named export issues in some environments
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { products, wishlist } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="text-center mb-24">
          <span className="text-[#8C7861] uppercase text-[10px] font-black tracking-[0.6em] mb-4 block animate-fadeInUp">Personal Collection</span>
          <h1 className="text-5xl md:text-8xl font-serif text-black/80 italic animate-fadeInUp">The Vault</h1>
          <div className="w-12 h-px bg-black/10 mx-auto mt-10" />
        </header>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            {wishlistedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-black/5 rounded-[3rem]">
            <h3 className="text-2xl font-serif text-black/30 mb-6 italic">Your collection is empty</h3>
            <Link 
              to="/shop" 
              className="inline-block text-[#8C7861] text-[9px] uppercase font-black tracking-[0.5em] border-b border-[#8C7861] pb-2 hover:text-black hover:border-black transition-all"
            >
              Explore the Archive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;