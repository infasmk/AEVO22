
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  
  // Luxury backgrounds for variety - used primarily for the bottom info section
  const bgColors = ['bg-[#FDFBF7]', 'bg-[#F5F1E9]', 'bg-[#F0EEEB]'];
  const bgColor = bgColors[parseInt(product.id) % bgColors.length];

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Sold Out', color: 'text-red-500', dot: 'bg-red-500' };
    if (product.stock <= 5) return { label: 'Low Stock', color: 'text-[#C5A059]', dot: 'bg-[#C5A059]' };
    return { label: 'In Stock', color: 'text-emerald-600', dot: 'bg-emerald-600' };
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
      {/* Floating Elements atop Full Image */}
      <div className="absolute top-6 left-6 z-20 transition-transform duration-700 group-hover:translate-x-1 group-hover:translate-y-1">
        {product.tag !== 'None' && (
          <span className="bg-white/90 backdrop-blur-md text-[#2C2A28] text-[8px] px-4 py-2 uppercase tracking-[0.2em] font-bold rounded-full shadow-lg border border-black/5">
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
      <div className="block aspect-[3/4] overflow-hidden relative w-full cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-[3000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Buy Now Overlay Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 z-10 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleBuyNow}
            className="bg-[#2C2A28] text-white px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl transform transition-all duration-500 hover:bg-[#C5A059] hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Discover Piece'}</span>
          </button>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Content Area */}
      <div className="p-8 pb-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] uppercase tracking-[0.5em] text-[#C5A059] font-bold">{product.category}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.dot} animate-pulse`} />
                <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${stockStatus.color}`}>{stockStatus.label}</span>
              </div>
            </div>
            <h3 className="font-serif text-2xl tracking-tight transition-colors duration-500 group-hover:text-[#C5A059] leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <p className="text-2xl font-light tracking-tighter text-[#2C2A28]">${product.price.toLocaleString()}</p>
          <button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-[9px] uppercase tracking-[0.4em] font-bold border-b border-transparent hover:border-[#C5A059] hover:text-[#C5A059] transition-all pb-1"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
