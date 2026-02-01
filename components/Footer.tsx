
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FDFBF7] pt-20 pb-10 border-t border-black/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-black tracking-tighter">AEVO</h2>
            <p className="text-black/40 text-xs leading-relaxed max-w-xs italic">
              Crafting instruments of time that defy the temporary. Geneva born, globally curated.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B88E4B]">Registry</h3>
            <ul className="space-y-3 text-black/50 text-xs">
              <li><Link to="/shop" className="hover:text-black transition-colors">Men's Series</Link></li>
              <li><Link to="/shop" className="hover:text-black transition-colors">Women's Series</Link></li>
              <li><Link to="/shop" className="hover:text-black transition-colors">Wall Series</Link></li>
              <li><Link to="/shop" className="hover:text-black transition-colors">Limited Vault</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B88E4B]">Concierge</h3>
            <ul className="space-y-3 text-black/50 text-xs">
              <li><Link to="#" className="hover:text-black transition-colors">Bespoke Inquiry</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Our Story</Link></li>
              <li><Link to="/admin" className="text-[#B88E4B] font-bold">Atelier Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B88E4B]">Updates</h3>
            <form className="flex border-b border-black/10 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent text-black/60 py-2 w-full focus:outline-none text-[8px] tracking-widest font-bold"
              />
              <button className="uppercase text-[8px] font-black tracking-widest text-[#B88E4B]">Join</button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center text-[8px] text-black/30 uppercase tracking-[0.3em]">
          <p>© 2024 AEVO Atelier Geneva.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-black">Privacy</Link>
            <Link to="#" className="hover:text-black">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
