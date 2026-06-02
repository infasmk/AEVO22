import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Compass, Feather, Clock, Star } from '../components/Icons';

const About: React.FC = () => {
  return (
    <div className="pt-24 md:pt-32 pb-32 bg-[#FCFCFA] text-black">
      <SEO 
        title="Our Story – The Journey of AEVO" 
        description="Founded by Abhijith K (NIT Raipur Architecture), AEVO blends architectural geometry and material honesty into premium handcrafted wooden clocks and custom luxury decor."
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "Our Story - AEVO",
          "description": "The story behind AEVO and its founder Abhijith K, architectural designer and craftsman.",
          "publisher": {
            "@type": "Organization",
            "name": "AEVO",
            "url": "https://aevodesigns.in"
          }
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Editorial Subheader */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#A68E74] font-black uppercase text-[10px] tracking-[0.4em] block">HERITAGE</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-black">Our Story</h1>
          <div className="h-px w-16 bg-[#A68E74]/30 mx-auto my-6" />
          <p className="text-[#A68E74] font-serif italic text-lg leading-relaxed">
            "Crafted with purpose. Designed to endure."
          </p>
        </div>

        {/* Cinematic Split Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden border border-black/5 bg-[#F9F7F4] p-4 rounded-sm shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200" 
                alt="Wood Crafting Studio Workshop" 
                className="w-full h-[320px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8 bg-[#1F1A16]/95 text-white p-6 backdrop-blur-md max-w-xs border border-white/5 rounded-sm">
                <span className="text-[9px] font-black tracking-[0.3em] text-[#A68E74] block mb-2 uppercase">Brand Identity</span>
                <p className="font-serif italic text-sm text-[#FAF8F5]/80 leading-relaxed">
                  Inspired by material honesty, structural purity, and the quiet dignity of contemporary design.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-black">The Confluence of Architecture & Craft</h2>
            <p className="text-black/60 text-sm leading-relaxed">
              Founded by <strong>Abhijith K</strong>, a fifth-year architecture student at <strong>NIT Raipur</strong> with a passion for thoughtful design and craftsmanship, our journey began in 2021 with the creation of handcrafted wooden décor pieces.
            </p>
            <p className="text-black/60 text-sm leading-relaxed">
              What started as a small-scale production venture has now evolved into an online destination for distinctive, design-led home décor, launched officially in 2026.
            </p>
            
            {/* Nit Raipur Student Highlight Badge */}
            <div className="p-6 bg-[#FAF8F5] border-l-2 border-[#A68E74] rounded-r-md space-y-2">
              <span className="text-[9px] font-black tracking-[0.2em] text-[#A68E74] block uppercase">NIT RAIPUR DESIGN LAB</span>
              <p className="text-xs text-black/70 italic font-serif leading-relaxed">
                "As an architectural designer, I look at every clock and lighting fixture not merely as a decorative accessory, but as a mini spatial installation. The play of light, shadows of hands, and premium natural textures should interact and elevate the entire room."
              </p>
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black">— Abhijith K, Architecture NITRR</p>
                <p className="text-[9px] text-[#A68E74] tracking-normal">Founder & Chief Designer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Focus Card Grid */}
        <div className="bg-[#FAF8F5] border border-black/[0.03] rounded-sm p-8 md:p-12 mb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="w-10 h-10 bg-[#A68E74]/10 rounded-sm flex items-center justify-center text-[#A68E74] mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif mb-2">Architectural Rigor</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Drawing direct inspiration from contemporary structures, tectonic forms, and minimalist alignments. We avoid clutter, letting raw geometric space speak.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 bg-[#A68E74]/10 rounded-sm flex items-center justify-center text-[#A68E74] mb-4">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif mb-2">Material Honesty</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              We focus on the natural authenticity of wood. Every ring, knot, and texture is treated with premium oil coatings that preserve the organic character of wood.
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-[#A68E74]/10 rounded-sm flex items-center justify-center text-[#A68E74] mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif mb-2">Built To Last</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Every detail is designed with meticulous attention to assembly. These are not fast-fashion items—they are heirloom decor assets created to endure for generations.
            </p>
          </div>
        </div>

        {/* Narrative & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <div className="space-y-6 order-2 lg:order-1">
            <span className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em] block">OUR PHILOSOPHY</span>
            <h2 className="text-3xl font-serif tracking-tight text-black">A Belief In Meaningful Simplicity</h2>
            <p className="text-black/60 text-sm leading-relaxed">
              We specialize in creating wooden wall clocks, table clocks, wall lights, hanging lights, and carefully curated décor pieces that blend functionality with timeless aesthetics.
            </p>
            <p className="text-black/60 text-sm leading-relaxed">
              At the heart of our work is a belief that good design should be both beautiful and meaningful. We focus on clean forms, quality craftsmanship, and the natural elegance of wood to create pieces that complement modern homes while retaining a unique identity.
            </p>
            <p className="text-black/60 text-sm leading-relaxed font-serif italic text-black/80">
              Every product is designed with attention to detail, ensuring it is not just a décor item, but a lasting part of your living space.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden border border-black/5 bg-[#F9F7F4] p-4 rounded-sm shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200" 
                alt="Architectural Design Sketches & Drafts" 
                className="w-full h-[300px] object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Premium Graphic Timeline */}
        <div className="border-t border-black/5 pt-20 mb-20">
          <div className="text-center max-w-md mx-auto mb-16 space-y-2">
            <span className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em] block">CHRONOLOGY</span>
            <h2 className="text-2xl md:text-3xl font-serif text-black">Our Journey Timeline</h2>
            <p className="text-black/45 text-xs">Transforming spatial ideations into tangible heritage artifacts.</p>
          </div>

          <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
            {/* Center Line for Desktop, Left for Mobile */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#A68E74] via-[#A68E74]/40 to-transparent -translate-x-1/2" />

            {/* Event 1: 2021 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="md:text-right pr-0 md:pr-12 md:pb-0 pb-2">
                <div className="inline-block md:float-right px-3 py-1 bg-[#1F1A16] text-[#A68E74] font-serif italic text-sm tracking-widest rounded-sm mb-3">
                  2021
                </div>
                <div className="clear-both" />
                <h4 className="text-lg font-serif text-black font-semibold mt-1">The Small-Scale Genesis</h4>
                <p className="text-xs text-black/50 mt-2 leading-relaxed">
                  Abhijith K began crafted custom hand-carved wood accents inside a collegiate studio environment. Exploring geometries, testing timber species, and finding paths to express physical form.
                </p>
              </div>
              <div className="hidden md:block" />
              {/* Timeline dot */}
              <div className="absolute left-[32px] md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-[#1F1A16] border-2 border-[#A68E74] -translate-x-1/2" />
            </div>

            {/* Event 2: 2022 - 2024 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="hidden md:block" />
              <div className="pl-0 md:pl-12 md:pb-0 pb-2">
                <div className="inline-block px-3 py-1 bg-[#FAF8F5] border border-[#A68E74]/40 text-[#A68E74] font-serif italic text-sm tracking-widest rounded-sm mb-3">
                  2022 – 2024
                </div>
                <h4 className="text-lg font-serif text-black font-semibold mt-1">Architectural Iterations & Prototyping</h4>
                <p className="text-xs text-black/50 mt-2 leading-relaxed">
                  While undergoing rigorous spatial design studies at NIT Raipur, Abhijith integrated lighting and contemporary clocks. Working with seasoned local turning artisans to polish complex joins and seamless clock enclosures.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="absolute left-[32px] md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-[#FAF8F5] border-2 border-[#A68E74] -translate-x-1/2" />
            </div>

            {/* Event 3: 2025 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="md:text-right pr-0 md:pr-12 md:pb-0 pb-2">
                <div className="inline-block md:float-right px-3 py-1 bg-[#FAF8F5] border border-[#A68E74]/40 text-[#A68E74] font-serif italic text-sm tracking-widest rounded-sm mb-3">
                  2025
                </div>
                <div className="clear-both" />
                <h4 className="text-lg font-serif text-black font-semibold mt-1">Founding AEVO Atelier</h4>
                <p className="text-xs text-black/50 mt-2 leading-relaxed">
                  Transitioned from personal custom works to establishing a dedicated luxury studio pipeline. The AEVO name was chosen to symbolize timeless era (Aevo), prioritizing elegant, slow-made wooden pieces.
                </p>
              </div>
              <div className="hidden md:block" />
              {/* Timeline dot */}
              <div className="absolute left-[32px] md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-[#FAF8F5] border-2 border-[#A68E74] -translate-x-1/2" />
            </div>

            {/* Event 4: 2026 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="hidden md:block" />
              <div className="pl-0 md:pl-12">
                <div className="inline-block px-3 py-1 bg-[#1F1A16] text-[#A68E74] font-serif italic text-sm tracking-widest rounded-sm mb-3">
                  2026
                </div>
                <h4 className="text-lg font-serif text-black font-semibold mt-1">Domestic Registry Launch</h4>
                <p className="text-xs text-black/50 mt-2 leading-relaxed">
                  Launching aevodesigns.in to bring handcrafted luxury wall clocks, key organizers, and modular lighting directly to aesthetic spaces, preserving individual design identities in every built ornament.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="absolute left-[32px] md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-[#1F1A16] border-2 border-[#A68E74] -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Call to Action */}
        <div className="mt-28 py-16 px-8 bg-[#FAF8F5] border border-black/[0.03] text-center rounded-sm max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center space-x-1 text-[#A68E74]">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[#A68E74] font-black uppercase text-[9px] tracking-[0.3em] block">DISCOVER THE ARCHIVE</span>
          <h2 className="text-2xl md:text-3xl font-serif text-black max-w-lg mx-auto">Elevate Your Living Space With Authentic Wooden Artistry</h2>
          <p className="text-xs text-black/50 max-w-md mx-auto leading-relaxed">
            Browse our limited releases of wall clocks, organic wooden lights, and premium key anchors conceptualized under architectural disciplines.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="px-8 py-3 bg-[#1F1A16] text-[#A68E74] hover:bg-black hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all shadow-sm rounded-sm"
            >
              Explore Collections
            </Link>
            <a 
              href="mailto:concierge@aevo.luxury" 
              className="px-8 py-3 bg-white border border-black/10 hover:border-black text-black font-bold text-[10px] tracking-widest uppercase transition-all rounded-sm"
            >
              Custom Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
