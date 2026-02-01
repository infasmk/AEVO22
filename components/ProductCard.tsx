
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Archived', color: 'text-red-500/80', dot: 'bg-red-500' };
    if (product.stock <= 5) return { label: 'Scarcity', color: 'text-[#C5A059]', dot: 'bg-[#C5A059]' };
    return { label: 'Available', color: 'text-emerald-500/80', dot: 'bg-emerald-500' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className={`group relative rounded-[2rem] transition-all duration-[1000ms] bg-[#1A1918] border border-white/5 overflow-hidden ${
        isHovered ? 'shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] -translate-y-2 border-white/10' : 'shadow-none'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Floating Tag */}
      <div className="absolute top-6 left-6 z-20">
        {product.tag !== 'None' && (
          <span className="bg-[#C5A059] text-white text-[7px] px-4 py-2 uppercase tracking-[0.3em] font-black rounded-full shadow-2xl">
            {product.tag}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="aspect-[4/5] overflow-hidden relative cursor-pointer">
        <img 
          src={product.images[0]} 
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Quick View Button (Desktop) */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <button onClick={handleBuyNow} className="bg-white text-black px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
             View Piece
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[8px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">{product.category}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-1 h-1 rounded-full ${stockStatus.dot}`} />
            <span className={`text-[7px] uppercase tracking-widest font-black ${stockStatus.color}`}>{stockStatus.label}</span>
          </div>
        </div>

        <h3 className="font-serif text-xl text-white group-hover:text-[#C5A059] transition-colors mb-4 line-clamp-1">{product.name}</h3>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <span className="text-lg font-light text-white/90">₹{product.price.toLocaleString('en-IN')}</span>
          <button className="text-white/20 group-hover:text-[#C5A059] transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
