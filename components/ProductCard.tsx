
import React, { useState, useMemo } from 'react';
// Use star import to resolve named export issues in some environments
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { Product } from '../types';
import { ShoppingBag } from './Icons';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Recalibrated "More More Light" Pastel Palette
  const pastels = [
    '#DDE2E0', // Lightened Sage Mist
    '#F2EFEC', // Lightened Parchment
    '#FFF5E9', // Lightened Apricot Silk
    '#FAF9F2', // Lightened Ivory Dew
  ];

  const cardColor = useMemo(() => pastels[index % pastels.length], [index]);

  const handleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { 
        label: 'Out of Stock', 
        color: 'text-red-600', 
        dot: 'bg-red-500' 
      };
    }
    if (product.stock <= 3) {
      return { 
        label: 'Low Stock', 
        color: 'text-orange-600', 
        dot: 'bg-orange-500' 
      };
    }
    return { 
      label: 'Available', 
      color: 'text-emerald-600', 
      dot: 'bg-emerald-500' 
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className={`group relative rounded-[1.5rem] transition-all duration-[800ms] border border-black/[0.03] overflow-hidden cursor-pointer ${
        isHovered ? 'shadow-xl -translate-y-1' : 'shadow-none'
      }`}
      style={{ backgroundColor: cardColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Floating Tag */}
      {product.tag !== 'None' && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-md text-black/50 text-[7px] px-2.5 py-1 uppercase tracking-[0.2em] font-black rounded-full shadow-sm border border-black/5">
            {product.tag}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4/5] overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-[1200ms] mix-blend-multiply opacity-90 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Quick Action */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
           <button onClick={handleDetails} className="w-full bg-white/90 backdrop-blur-sm text-black py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md border border-black/5">
             View Piece
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[7px] uppercase tracking-[0.3em] text-[#A68E74] font-black">{product.category}</span>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.dot} ${product.stock > 0 ? 'animate-pulse' : ''}`} />
            <span className={`text-[7px] uppercase tracking-widest font-black ${stockStatus.color}`}>{stockStatus.label}</span>
          </div>
        </div>

        <h3 className="font-serif text-base md:text-lg text-black/70 group-hover:text-[#A68E74] transition-colors mb-2 line-clamp-1">{product.name}</h3>
        
        <div className="flex justify-between items-center pt-2.5 border-t border-black/[0.05]">
          <span className="text-sm md:text-base font-medium text-black/50">₹{product.price.toLocaleString('en-IN')}</span>
          <div className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingBag className="w-3 h-3 text-black/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
