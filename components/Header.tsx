
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM;
import { useStore } from '../store';
import { Search, Menu, X, Heart, Star } from './Icons';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const { wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Collection', path: '/shop', number: '01' },
    { name: 'Home', path: '/about', number: '02' },
    { name: 'Liked ', path: '/wishlist', number: '03' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount === 5) {
      setLogoClicks(0);
      navigate('/admin');
    } else {
      // Still navigate home on single click if needed, but the user said "only open when click 5 times"
      // to imply the admin portal. Let's just navigate home if it's not the 5th click to keep standard behavior.
      if (location.pathname !== '/') navigate('/');
    }
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'glass-effect border-b border-black/5 py-3 shadow-sm' : 'bg-[#FCFCFA] py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-[#A68E74] hover:text-black transition-colors" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-12 text-[9px] uppercase tracking-[0.4em] font-black">
          <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-black' : 'text-[#A68E74] hover:text-black'}`}>Collection</Link>
          <Link to="/about" className="text-[#A68E74] hover:text-black transition-colors">Home</Link>
        </nav>

        {/* Logo - Signature Gold */}
        <Link to="/" onClick={handleLogoClick} className="text-2xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-[#A68E74] transition-transform hover:scale-105 active:scale-95 select-none">
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

      {/* Editorial Side Drawer (Mobile Menu) */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        <div className={`absolute top-0 left-0 bottom-0 w-[90%] max-w-sm bg-[#FAF8F5] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full`}>
          {/* Menu Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-black/[0.03] shrink-0">
            <span className="font-serif text-2xl tracking-tighter text-[#A68E74]">AEVO</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-black/[0.02] hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-8 space-y-10">
            {/* Handcrafted wooden décor headline */}
            <p className="text-black/60 italic font-serif font-light text-[13px] md:text-sm leading-relaxed">
              Handcrafted wooden décor inspired by modern living. Designed to bring warmth, simplicity, and timeless character into every space.
            </p>
            
            {/* Collections Section */}
            <div className="space-y-4">
              <h3 className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em]">Collections</h3>
              <ul className="space-y-3 font-serif italic text-base md:text-lg text-black/70 pl-0.5">
                <li>
                  <Link to="/shop?category=Wall%20Clocks" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Wall Clocks</Link>
                </li>
                <li>
                  <Link to="/shop?category=Wooden%20D%C3%A9cor" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Wooden Décor</Link>
                </li>
                <li>
                  <Link to="/shop?category=Hanging%20Lights" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Hanging Lights</Link>
                </li>
                <li>
                  <Link to="/shop?category=Key%20Holders" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Key Holders</Link>
                </li>
                <li>
                  <Link to="/shop?category=Limited%20Editions" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Limited Editions</Link>
                </li>
              </ul>
            </div>

            {/* Studio Section */}
            <div className="space-y-4">
              <h3 className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em]">Studio</h3>
              <ul className="space-y-3 font-serif italic text-base md:text-lg text-black/70 pl-0.5">
                <li>
                  <a href="mailto:concierge@aevo.luxury" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Custom Orders</a>
                </li>
                <li>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">Our Craftsmanship</Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors block py-0.5">About AEVO</Link>
                </li>
              </ul>
            </div>

            {/* Stay Connected Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em]">Stay Connected</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you to register in the AEVO artisan registry.");
                  setMobileMenuOpen(false);
                }}
                className="flex border-b border-black/10 pb-2 mt-4 gap-4"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  className="bg-transparent text-black/80 py-1.5 w-full focus:outline-none text-xs font-light italic tracking-wide"
                />
                <button type="submit" className="uppercase text-[9px] font-black tracking-widest text-[#A68E74] hover:text-black transition-colors shrink-0">SUBSCRIBE</button>
              </form>
            </div>

            {/* In-drawer Footer Details */}
            <div className="pt-12 pb-6 border-t border-black/[0.03] text-center text-[8px] text-black/30 uppercase tracking-[0.3em] space-y-3">
              <p>© 2024 AEVO Designs.</p>
              <p>CREATED BY INFAS.MK || TEAM WEBBITS</p>
              <div className="flex justify-center space-x-4 pt-1 text-[7px]">
                <Link to="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors">PRIVACY</Link>
                <span>|</span>
                <Link to="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-black transition-colors">TERMS</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
