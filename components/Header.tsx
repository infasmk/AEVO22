
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Collection', path: '/shop' },
    { name: 'Heritage', path: '/about' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-effect border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Navigation - Left Side (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-10 text-[9px] uppercase tracking-[0.4em] font-bold">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-[#C5A059]' : 'text-white/60 hover:text-white'}`}>The Collection</Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-[#C5A059]' : 'text-white/60 hover:text-white'}`}>Heritage</Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="text-3xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-white transition-transform hover:scale-105">
          AEVO
        </Link>

        {/* Actions - Right Side */}
        <div className="flex items-center space-x-5 md:space-x-8">
          <Link to="/wishlist" className="p-2 text-white/60 hover:text-[#C5A059] transition-all relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#C5A059]' : ''}`} />
            {wishlist.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span>}
          </Link>
          <button className="hidden sm:block p-2 text-white/60 hover:text-white transition-all">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-4 border-l border-white/10 pl-8">
             <Link to="/admin" className="text-[9px] uppercase tracking-[0.3em] font-black text-[#C5A059] hover:text-white transition-colors">
               Atelier
             </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Full Screen Overlay) */}
      <div className={`fixed inset-0 z-[100] bg-[#0F0F0F] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex justify-between items-center p-8">
          <span className="font-serif text-3xl tracking-tighter text-white">AEVO</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-full text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex flex-col px-12 pt-20 space-y-10">
          {navLinks.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.path} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl font-serif italic text-white/90 hover:text-[#C5A059] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl font-serif italic text-[#C5A059]"
          >
            Atelier Portal
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
