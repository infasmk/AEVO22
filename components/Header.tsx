
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Collection', path: '/shop' },
    { name: 'Heritage', path: '/about' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'glass-effect shadow-sm py-4' : 'bg-transparent py-7'}`}>
      <div className="container mx-auto px-8 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-[#2C2A28] hover:opacity-50 transition-opacity" onClick={() => setMobileMenuOpen(true)}>
          <Menu />
        </button>

        {/* Navigation - Left Side (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-12 text-[10px] uppercase tracking-[0.4em] font-bold">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'}`}>The Collection</Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'}`}>Heritage</Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="text-4xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 transition-transform hover:scale-105 duration-500">
          AEVO
        </Link>

        {/* Actions - Right Side */}
        <div className="flex items-center space-x-8">
          <Link to="/wishlist" className="p-2 hover:text-[#C5A059] transition-all relative group">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#C5A059]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
            )}
          </Link>
          <button className="p-2 hover:text-[#C5A059] transition-all">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-4 border-l border-black/5 pl-8">
             <Link to="/admin" className="text-[9px] uppercase tracking-[0.3em] font-black text-[#2C2A28] hover:text-[#C5A059] transition-colors">
               Atelier Access
             </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#FDFBF7] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center p-8 border-b border-[#F5F1E9]">
          <span className="font-serif text-3xl tracking-tighter">AEVO</span>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="p-3 bg-[#F5F1E9] rounded-full hover:bg-[#2C2A28] hover:text-white transition-all duration-500 transform active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col h-full overflow-y-auto">
          <nav className="flex flex-col p-12 space-y-8">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-5xl md:text-6xl font-serif italic text-[#2C2A28] transition-all duration-700 hover:pl-6 hover:text-[#C5A059] flex items-center group ${
                    mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  } ${isActive ? 'text-[#C5A059] pl-6' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className={`w-0 h-px bg-[#C5A059] transition-all duration-700 mr-0 group-hover:w-12 group-hover:mr-6 ${isActive ? 'w-12 mr-6' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-5xl md:text-6xl font-serif italic text-[#C5A059] transition-all duration-700 hover:pl-6 flex items-center group ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${navLinks.length * 100}ms` }}
            >
              <span className="w-0 h-px bg-[#C5A059] transition-all duration-700 mr-0 group-hover:w-12 group-hover:mr-6" />
              Atelier Portal
            </Link>
          </nav>
          
          <div className={`mt-auto p-12 pb-24 border-t border-[#F5F1E9] transition-all duration-1000 delay-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-bold mb-6">Concierge Services</p>
            <div className="space-y-4">
              <a href="tel:+123456789" className="block text-xl font-light tracking-tight text-[#2C2A28] hover:text-[#C5A059] transition-colors">+1 (234) 567-AEVO</a>
              <a href="mailto:concierge@aevo.luxury" className="block text-xl font-light tracking-tight text-[#2C2A28] hover:text-[#C5A059] transition-colors">concierge@aevo.luxury</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
