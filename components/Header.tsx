
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Search, Menu, X, Heart } from './Icons';

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-effect border-b border-black/5 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-black/60 hover:text-black" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-10 text-[9px] uppercase tracking-[0.4em] font-black">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-[#B88E4B]' : 'text-black/40 hover:text-black'}`}>Archive</Link>
          <Link to="/about" className="text-black/40 hover:text-black transition-colors">Heritage</Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="text-2xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-black transition-transform hover:scale-105">
          AEVO
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/wishlist" className="p-2 text-black/40 hover:text-[#B88E4B] transition-all relative">
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#B88E4B]' : ''}`} />
            {wishlist.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#B88E4B] rounded-full"></span>}
          </Link>
          <button className="hidden sm:block p-2 text-black/40 hover:text-black transition-all">
            <Search className="w-4 h-4" />
          </button>
          <Link to="/admin" className="hidden md:block text-[8px] uppercase tracking-[0.3em] font-black text-[#B88E4B] border border-[#B88E4B]/20 px-4 py-1.5 rounded-full hover:bg-[#B88E4B] hover:text-white transition-all">
            Atelier
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[100] bg-[#FCFCFA] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex justify-between items-center p-8">
          <span className="font-serif text-2xl tracking-tighter text-black">AEVO</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-black/5 rounded-full text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex flex-col px-10 pt-12 space-y-8">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif italic text-black/80">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif italic text-black/80">Collection</Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif italic text-black/80">The Vault</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif italic text-[#B88E4B]">Atelier Portal</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
