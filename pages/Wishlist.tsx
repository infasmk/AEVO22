
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { products, wishlist } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-40 pb-32 min-h-screen bg-[#FDFBF7]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <header className="text-center mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-[80px] md:text-[120px] font-serif opacity-[0.03] select-none pointer-events-none whitespace-nowrap">
            Personal Collection
          </div>
          <span className="text-[#C5A059] uppercase text-[10px] font-bold tracking-[0.6em] mb-6 block animate-fadeInUp">Your Curated Selections</span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#2C2A28] mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>The Vault</h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto italic animate-fadeInUp leading-relaxed" style={{ animationDelay: '0.2s' }}>
            "Time is the ultimate luxury. Here reside the pieces that have captured your imagination, awaiting their place in your legacy."
          </p>
        </header>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-t border-[#F5F1E9] animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="mb-12">
               <div className="w-24 h-24 border border-[#F5F1E9] rounded-full flex items-center justify-center mx-auto mb-8 bg-white shadow-sm">
                 <div className="w-12 h-12 border-2 border-dashed border-[#F5F1E9] rounded-full" />
               </div>
               <h3 className="text-3xl font-serif text-[#2C2A28] mb-4">The Vault is empty</h3>
               <p className="text-gray-400 font-light max-w-xs mx-auto">Discover our masterfully crafted collections and start your curation.</p>
            </div>
            <Link 
              to="/shop" 
              className="inline-block bg-[#2C2A28] text-white px-14 py-5 rounded-full uppercase text-[10px] font-bold tracking-[0.4em] hover:bg-[#C5A059] transition-all duration-700 shadow-2xl"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* Aesthetic Footer for Wishlist */}
        {wishlistedProducts.length > 0 && (
          <div className="mt-32 pt-24 border-t border-[#F5F1E9] flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h4 className="font-serif text-2xl text-[#2C2A28] mb-4">Need a Private Consultation?</h4>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Our master horologists are available to provide technical dossiers and personalized insights into your selected pieces.
              </p>
            </div>
            <button className="bg-transparent border border-[#2C2A28] text-[#2C2A28] px-12 py-5 rounded-full uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-[#2C2A28] hover:text-white transition-all duration-700 group">
              Speak with an Artisan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
