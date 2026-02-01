
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1918] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-white tracking-tighter">AEVO</h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs italic">
              Redefining luxury horology through minimal design and artisanal Swiss craftsmanship.
            </p>
            <div className="flex space-x-6">
              {['IG', 'FB', 'PN'].map(s => (
                <a key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#C5A059] transition-colors">{s}</a>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Collections</h3>
            <ul className="space-y-4 text-white/40 text-sm">
              {['Men', 'Women', 'Wall Clocks', 'Luxury Series'].map(c => (
                <li key={c}><Link to="/shop" className="hover:text-white transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Experience</h3>
            <ul className="space-y-4 text-white/40 text-sm">
              {['Contact Us', 'Our Story', 'Boutiques'].map(i => (
                <li key={i}><Link to="#" className="hover:text-white transition-colors">{i}</Link></li>
              ))}
              <li><Link to="/admin" className="text-[#C5A059] font-bold hover:underline">Atelier Access</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">The AEVO Letter</h3>
            <p className="text-white/30 text-xs italic">Join the circle for private showcases.</p>
            <form className="flex border-b border-white/10 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent text-white/60 py-2 w-full focus:outline-none text-[10px] tracking-widest"
              />
              <button className="uppercase text-[9px] font-bold tracking-widest text-[#C5A059]">Join</button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-white/20 uppercase tracking-[0.3em] space-y-6 md:space-y-0 text-center md:text-left">
          <p>© 2024 AEVO Horology. Established in Geneva.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="#" className="hover:text-white">Privacy</Link>
            <Link to="#" className="hover:text-white">Terms</Link>
            <Link to="#" className="hover:text-white">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
