
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM;
import { useStore } from '../store';
import { Search, Menu, X, Heart, Star } from './Icons';

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
    { name: 'The Archive', path: '/shop', number: '01' },
    { name: 'Heritage', path: '/about', number: '02' },
    { name: 'The Vault', path: '/wishlist', number: '03' },
    { name: 'Atelier Portal', path: '/admin', number: '04', highlight: true },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'glass-effect border-b border-black/5 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-12 text-[9px] uppercase tracking-[0.4em] font-black">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-[#A68E74]' : 'text-black/40 hover:text-black'}`}>Archive</Link>
          <Link to="/about" className="text-black/40 hover:text-black transition-colors">Heritage</Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="text-2xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-black transition-transform hover:scale-105 active:scale-95">
          AEVO
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/wishlist" className="p-2 text-black/40 hover:text-[#A68E74] transition-all relative">
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#A68E74]' : ''}`} />
            {wishlist.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A68E74] rounded-full animate-pulse"></span>}
          </Link>
          <button className="hidden sm:block p-2 text-black/40 hover:text-black transition-all">
            <Search className="w-4 h-4" />
          </button>
          <Link to="/admin" className="hidden md:flex items-center space-x-2 text-[8px] uppercase tracking-[0.3em] font-black text-[#A68E74] border border-[#A68E74]/20 px-5 py-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all">
            <Star className="w-3 h-3" />
            <span>Atelier</span>
          </Link>
        </div>
      </div>

      {/* Editorial Side Drawer (Mobile Menu) */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Scrim */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#FCFCFA] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-8 border-b border-black/[0.03]">
            <span className="font-serif text-2xl tracking-tighter text-black italic">AEVO Atelier</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-black/5 rounded-full text-black hover:bg-black/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col p-10 space-y-12">
            {navLinks.map((link, idx) => (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className={`group flex items-end space-x-4 transition-all duration-500 ${mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-[10px] font-black tracking-widest text-[#A68E74] mb-2">{link.number}</span>
                <span className={`text-4xl font-serif italic ${link.highlight ? 'text-[#A68E74]' : 'text-black/80'} group-hover:text-black transition-colors`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-12 left-10 right-10">
            <div className="h-px w-12 bg-black/10 mb-8" />
            <p className="text-[8px] uppercase tracking-[0.4em] text-black/30 font-black mb-2">Artisanal Support</p>
            <a href="mailto:concierge@aevo.luxury" className="text-[10px] font-bold tracking-widest text-black/60 hover:text-black transition-colors">concierge@aevo.luxury</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
