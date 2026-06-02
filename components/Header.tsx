
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM;
import { useStore } from '../store';
import { Search, Heart } from './Icons';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const { wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount === 5) {
      setLogoClicks(0);
      navigate('/admin');
    } else {
      if (location.pathname !== '/') navigate('/');
    }
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'glass-effect border-b border-black/5 py-3 shadow-sm' : 'bg-[#FCFCFA] py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Navigation - Adaptive Layout */}
        <nav className="flex items-center space-x-6 sm:space-x-12 text-[9px] uppercase tracking-[0.4em] font-black">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-black' : 'text-[#A68E74] hover:text-black'}`}></Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-black' : 'text-[#A68E74] hover:text-black'}`}></Link>
        </nav>

        {/* Logo - Signature Gold */}
        <Link to="/" onClick={handleLogoClick} className="text-2xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:-ml-12 text-[#A68E74] transition-transform hover:scale-105 active:scale-95 select-none z-10">
          AEVO
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/wishlist" className="p-2 text-[#A68E74] hover:text-black transition-all relative">
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#A68E74]' : ''}`} />
            {wishlist.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>}
          </Link>
          <button className="hidden sm:block p-2 text-[#A68E74] hover:text-black transition-all">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
