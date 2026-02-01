
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag } from './Icons';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Exact requested pastel palette
  const pastels = [
    '#BFC6C4', // Sage Grey
    '#E8E2D8', // Sand Taupe
    '#FFEAD3', // Peach Cream
    '#F6F0D7', // Ivory Silk
  ];

  const cardColor = useMemo(() => pastels[index % pastels.length], [index]);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Archived', color: 'text-gray-400', dot: 'bg-gray-400' };
    if (product.stock <= 5) return { label: 'Limited', color: 'text-[#8C7861]', dot: 'bg-[#8C7861]' };
    return { label: 'In Stock', color: 'text-emerald-600/70', dot: 'bg-emerald-500' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className={`group relative rounded-[1.5rem] transition-all duration-[800ms] border border-black/5 overflow-hidden cursor-pointer ${
        isHovered ? 'shadow-xl -translate-y-1' : 'shadow-none'
      }`}
      style={{ backgroundColor: cardColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Floating Tag */}
      {product.tag !== 'None' && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/80 backdrop-blur-md text-black/60 text-[7px] px-3 py-1.5 uppercase tracking-[0.2em] font-bold rounded-full shadow-sm border border-black/5">
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
          className={`w-full h-full object-cover transition-all duration-[1500ms] mix-blend-multiply opacity-80 ${isHovered ? 'scale-105 rotate-1' : 'scale-100'}`}
        />
        
        {/* Quick Action (Desktop) */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
           <button onClick={handleBuyNow} className="w-full bg-white text-black py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg border border-black/5">
             View Details
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[7px] uppercase tracking-[0.3em] text-[#8C7861] font-black">{product.category}</span>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1 h-1 rounded-full ${stockStatus.dot}`} />
            <span className={`text-[7px] uppercase tracking-widest font-bold ${stockStatus.color}`}>{stockStatus.label}</span>
          </div>
        </div>

        <h3 className="font-serif text-lg text-black/80 group-hover:text-[#8C7861] transition-colors mb-2 line-clamp-1">{product.name}</h3>
        
        <div className="flex justify-between items-center pt-3 border-t border-black/5">
          <span className="text-base font-medium text-black/60">₹{product.price.toLocaleString('en-IN')}</span>
          <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingBag className="w-3.5 h-3.5 text-black/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
