
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Heart, Search, Menu, X } from './Icons';

const Header: React.FC = () => {
  const { wishlist } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-effect shadow-sm py-4' : 'bg-transparent py-7'}`}>
      <div className="container mx-auto px-8 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-[#2C2A28]" onClick={() => setMobileMenuOpen(true)}>
          <Menu />
        </button>

        {/* Navigation - Left Side */}
        <nav className="hidden lg:flex items-center space-x-12 text-[10px] uppercase tracking-[0.4em] font-bold">
          <Link to="/shop" className="hover:text-[#C5A059] transition-colors">The Collection</Link>
          <Link to="/about" className="hover:text-[#C5A059] transition-colors">Heritage</Link>
        </nav>

        {/* Logo - Centered absolute on mobile/tablet, flex on desktop */}
        <Link to="/" className="text-4xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          AEVO
        </Link>

        {/* Actions - Right Side */}
        <div className="flex items-center space-x-8">
          <button className="hidden sm:block p-2 hover:text-[#C5A059] transition-all">
            <Search className="w-5 h-5" />
          </button>
          
          <Link to="/vault" className="relative group p-2 transition-all flex items-center space-x-3">
            <div className="relative">
              <Heart 
                fill={wishlist.length > 0 ? "#C5A059" : "none"} 
                className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${wishlist.length > 0 ? 'text-[#C5A059]' : 'text-[#2C2A28]'}`} 
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2C2A28] text-white text-[7px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce font-bold border border-[#C5A059]/20">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-[#C5A059] transition-colors">The Vault</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#FDFBF7] animate-fadeIn">
          <div className="flex justify-between items-center p-8 border-b border-[#F5F1E9]">
            <span className="font-serif text-3xl tracking-tighter">AEVO</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X className="w-8 h-8" /></button>
          </div>
          <div className="flex flex-col p-12 space-y-10 text-4xl font-serif italic text-[#2C2A28]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            <Link to="/vault" onClick={() => setMobileMenuOpen(false)}>The Vault</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our Heritage</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
