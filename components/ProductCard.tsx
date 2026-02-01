
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';
import { Heart, ShoppingBag } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  
  // Luxury backgrounds for variety
  const bgColors = ['bg-[#FDFBF7]', 'bg-[#F5F1E9]', 'bg-[#F0EEEB]'];
  const bgColor = bgColors[parseInt(product.id) % bgColors.length];

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Initiating secure acquisition for ${product.name}. Our concierge will contact you shortly to finalize this order.`);
  };

  return (
    <div 
      className={`group relative rounded-[2.5rem] p-7 transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) ${bgColor} ${
        isHovered ? 'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] -translate-y-4' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge Tag */}
      {product.tag !== 'None' && (
        <div className="absolute top-8 left-8 z-10">
          <span className="bg-[#2C2A28] text-white text-[8px] px-4 py-2 uppercase tracking-[0.2em] font-bold rounded-full shadow-lg">
            {product.tag}
          </span>
        </div>
      )}

      {/* Vault/Wishlist Button */}
      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className={`absolute top-8 right-8 z-20 p-4 rounded-full transition-all duration-700 border ${
          isWishlisted 
            ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-2xl scale-110' 
            : 'glass-effect text-gray-300 border-transparent hover:text-black hover:border-black/5 hover:scale-110'
        }`}
      >
        <Heart fill={isWishlisted ? "currentColor" : "none"} className={`w-5 h-5 ${isWishlisted ? 'animate-pulse' : ''}`} />
      </button>

      {/* Image Container */}
      <Link 
        to={`/product/${product.id}`} 
        className="block aspect-[4/5] rounded-[2rem] overflow-hidden mb-10 bg-white/50 backdrop-blur-sm relative border border-white/40"
      >
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={`w-full h-full object-contain p-12 transition-transform duration-[2000ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Buy Now Overlay Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleBuyNow}
            className="bg-[#2C2A28] text-white px-8 py-4 rounded-full text-[9px] uppercase tracking-[0.4em] font-bold shadow-2xl transform transition-transform duration-500 hover:bg-[#C5A059] hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Aesthetic Reveal on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#2C2A28]/10 to-transparent transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </Link>

      {/* Content */}
      <div className="px-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-serif text-3xl mb-2 tracking-tight transition-colors duration-500 group-hover:text-[#C5A059]">
              {product.name}
            </h3>
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold block">{product.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <p className="text-xl font-light tracking-tight text-[#2C2A28]">${product.price.toLocaleString()}</p>
          <Link 
            to={`/product/${product.id}`} 
            className="text-[9px] uppercase tracking-[0.3em] font-bold border-b-2 border-transparent hover:border-[#C5A059] hover:text-[#C5A059] transition-all pb-1"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
