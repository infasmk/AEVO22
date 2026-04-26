
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Clock, ArrowRight, X, Percent } from './Icons';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;

import CountdownTimer from './CountdownTimer';

const OfferBar: React.FC = () => {
  const { offer } = useStore();
  const [isVisible, setIsVisible] = useState(true);

  if (!offer || !offer.is_active || !isVisible) return null;

  return (
    <div className="relative z-[60] bg-black text-white px-4 py-2.5 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-center md:text-left">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A68E74]/30 to-transparent" />
        
        <div className="flex items-center space-x-3">
          <div className="bg-[#A68E74] text-black p-1 rounded-sm flex items-center justify-center">
            {offer.percentage ? (
                <span className="text-[10px] font-black">{offer.percentage}%</span>
            ) : (
                <Percent className="w-3 h-3 font-bold" />
            )}
          </div>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] animate-pulse whitespace-nowrap">
            {offer.heading}
          </p>
        </div>

        <p className="text-[9px] md:text-[10px] uppercase font-medium tracking-widest text-white/70 max-w-sm hidden lg:block truncate">
          {offer.paragraph}
        </p>

        {offer.end_time && (
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3 h-3 text-[#A68E74]" />
            <CountdownTimer 
              endTime={offer.end_time} 
              className="text-[9px] md:text-[10px] text-white"
            />
          </div>
        )}

        {offer.button_text && (
          <Link to={offer.button_link || '#'} className="group flex items-center space-x-2 text-[9px] uppercase font-black tracking-widest text-[#A68E74] border-b border-[#A68E74]/50 pb-0.5 hover:text-white hover:border-white transition-all">
            <span>{offer.button_text}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <button onClick={() => setIsVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default OfferBar;
