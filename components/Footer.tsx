
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F1E9] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-serif mb-6">AEVO</h2>
            <p className="text-gray-500 leading-relaxed max-w-xs mb-8">
              Redefining luxury horology through minimal design and artisanal craftsmanship. Every second matters.
            </p>
            <div className="flex space-x-4">
              {['Instagram', 'Facebook', 'Pinterest'].map(s => (
                <a key={s} href="#" className="text-xs uppercase tracking-widest hover:text-[#C5A059] transition-colors">{s}</a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">Collections</h3>
            <ul className="space-y-4 text-gray-500">
              {['Men', 'Women', 'Wall Clocks', 'Smart Series'].map(c => (
                <li key={c}><Link to="/shop" className="hover:text-[#C5A059] transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">Experience</h3>
            <ul className="space-y-4 text-gray-500">
              {['Contact Us', 'Our Story', 'Boutiques', 'Careers'].map(i => (
                <li key={i}><Link to="#" className="hover:text-[#C5A059] transition-colors">{i}</Link></li>
              ))}
              <li><Link to="/admin" className="text-[#C5A059] font-bold hover:underline">Atelier Portal (Admin)</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">The AEVO Letter</h3>
            <p className="text-gray-500 text-sm mb-6">Join our exclusive circle for latest arrivals and private showcases.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-b border-gray-400 py-2 w-full focus:outline-none focus:border-[#C5A059] text-sm"
              />
              <button className="ml-4 uppercase text-xs font-semibold tracking-widest hover:text-[#C5A059] transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest space-y-4 md:space-y-0">
          <p>© 2024 AEVO Horology. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <Link to="#" className="hover:text-[#C5A059]">Privacy Policy</Link>
            <Link to="#" className="hover:text-[#C5A059]">Terms of Service</Link>
            <Link to="#" className="hover:text-[#C5A059]">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
