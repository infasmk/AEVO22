
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';
import { Heart, ShoppingBag } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  
  const bgColors = ['bg-[#FDFBF7]', 'bg-[#F5F1E9]', 'bg-[#F0EEEB]'];
  const bgColor = bgColors[parseInt(product.id) % bgColors.length];

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Sold Out', color: 'text-red-500', dot: 'bg-red-500', pill: 'bg-red-50/50 border-red-100' };
    if (product.stock <= 5) return { label: 'Low Stock', color: 'text-[#C5A059]', dot: 'bg-[#C5A059]', pill: 'bg-amber-50/50 border-amber-100' };
    return { label: 'In Stock', color: 'text-emerald-600', dot: 'bg-emerald-600', pill: 'bg-emerald-50/50 border-emerald-100' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className={`group relative rounded-[2.5rem] transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) ${bgColor} overflow-hidden ${
        isHovered ? 'shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] -translate-y-4' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tag */}
      <div className="absolute top-8 left-8 z-20 transition-all duration-1000 ease-out opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
        {product.tag !== 'None' && (
          <span className="bg-white/95 backdrop-blur-xl text-[#2C2A28] text-[8px] px-5 py-2.5 uppercase tracking-[0.3em] font-extrabold rounded-full shadow-2xl border border-black/5 block">
            {product.tag}
          </span>
        )}
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className={`absolute top-6 right-6 z-20 p-4 rounded-full transition-all duration-700 border ${
          isWishlisted 
            ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-2xl scale-110' 
            : 'bg-white/80 backdrop-blur-md text-gray-400 border-transparent hover:text-black hover:border-black/5 hover:scale-110 shadow-sm'
        }`}
      >
        <Heart fill={isWishlisted ? "currentColor" : "none"} className={`w-4 h-4 ${isWishlisted ? 'animate-pulse' : ''}`} />
      </button>

      {/* Full-Bleed Image Container */}
      <div className="block aspect-[4/5] overflow-hidden relative w-full cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-[3000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isHovered ? 'scale-110' : 'scale-105'
          }`}
        />
        
        {/* Overlay Action */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 z-10 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleBuyNow}
            className="bg-[#2C2A28] text-white px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl transform transition-all duration-500 hover:bg-[#C5A059] hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Discover Piece'}</span>
          </button>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Content Area */}
      <div className="p-6 pb-8 md:p-8 md:pb-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-[#C5A059] font-bold">{product.category}</span>
              <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-colors duration-500 ${stockStatus.pill}`}>
                <div className={`w-1 h-1 rounded-full ${stockStatus.dot} ${product.stock > 0 ? 'animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]' : ''}`} />
                <span className={`text-[7px] uppercase tracking-[0.15em] font-extrabold ${stockStatus.color}`}>{stockStatus.label}</span>
              </div>
            </div>
            <h3 className="font-serif text-xl md:text-2xl tracking-tight transition-colors duration-500 group-hover:text-[#C5A059] leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-black/5">
          <p className="text-xl md:text-2xl font-light tracking-tighter text-[#2C2A28]">₹{product.price.toLocaleString('en-IN')}</p>
          <button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold border-b border-transparent hover:border-[#C5A059] hover:text-[#C5A059] transition-all pb-1"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
