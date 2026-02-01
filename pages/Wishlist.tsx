
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { products, wishlist } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0F0F0F]">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="text-center mb-24">
          <span className="text-[#C5A059] uppercase text-[10px] font-black tracking-[0.6em] mb-4 block animate-fadeInUp">Personal Collection</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white italic animate-fadeInUp">The Vault</h1>
          <div className="w-12 h-px bg-white/10 mx-auto mt-10" />
        </header>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-white/5 rounded-[3rem]">
            <h3 className="text-2xl font-serif text-white mb-6 italic opacity-30">Your collection is empty</h3>
            <Link 
              to="/shop" 
              className="inline-block text-[#C5A059] text-[9px] uppercase font-black tracking-[0.5em] border-b border-[#C5A059] pb-2 hover:text-white hover:border-white transition-all"
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
