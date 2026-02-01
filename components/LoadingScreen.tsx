
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Natural easing-style progress increments
        const remaining = 100 - prev;
        const inc = Math.max(1, Math.floor(remaining / 15));
        return prev + inc;
      });
    }, 120); // Sync with 2222ms duration

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#1A1918] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Specular Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
          style={{
            background: `radial-gradient(circle at center, #C5A059 0%, transparent 70%)`,
            filter: 'blur(100px)',
            transform: `translate(-50%, -50%) scale(${1 + progress * 0.005})`
          }}
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Masterpiece Skeleton Watch */}
        <div className="relative w-72 h-72 mb-20 flex items-center justify-center">
          
          {/* Outer Polished Case */}
          <div className="absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-white/5 to-transparent" />
          
          {/* Animated Internal Gears (Skeleton Movement) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            {/* Main Drive Gear */}
            <svg width="140" height="140" viewBox="0 0 100 100" className="absolute animate-spin-slow">
              <path d="M50 10 L55 25 L70 30 L60 45 L65 60 L50 55 L35 60 L40 45 L30 30 L45 25 Z" fill="none" stroke="#C5A059" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="10" stroke="#C5A059" strokeWidth="0.5" fill="none" />
              {[...Array(12)].map((_, i) => (
                <rect key={i} x="49" y="5" width="2" height="8" fill="#C5A059" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
            {/* Escapement Wheel */}
            <svg width="80" height="80" viewBox="0 0 100 100" className="absolute -translate-x-12 translate-y-8 animate-spin-reverse-slow">
              <circle cx="50" cy="50" r="30" stroke="#C5A059" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
              {[...Array(20)].map((_, i) => (
                <rect key={i} x="49.5" y="15" width="1" height="5" fill="#C5A059" transform={`rotate(${i * 18} 50 50)`} />
              ))}
            </svg>
          </div>

          {/* Hour Indices (Applied to Glass) */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-white/40 to-transparent"
              style={{
                height: i % 3 === 0 ? '16px' : '8px',
                transform: `rotate(${i * 30}deg) translateY(-120px)`,
                opacity: progress > (i * 8) ? 1 : 0.1,
                transition: 'opacity 0.5s ease'
              }}
            />
          ))}

          {/* Circular Progress Ring (Complication) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-95">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="rgba(197, 160, 89, 0.1)"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="#C5A059"
              strokeWidth="2"
              fill="none"
              strokeDasharray="816.8"
              strokeDashoffset={816.8 - (816.8 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Clock Hands */}
          {/* Hour Hand (Breguet Style) */}
          <div 
            className="absolute w-2 h-20 bg-gradient-to-t from-white/20 via-white/80 to-white/20 rounded-full origin-bottom"
            style={{ 
              transform: `translateY(-40px) rotate(${progress * 0.3}deg)`,
              bottom: '50%',
              boxShadow: '0 0 15px rgba(255,255,255,0.1)'
            }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute w-1 h-32 bg-gradient-to-t from-white/10 via-white/40 to-white/10 rounded-full origin-bottom"
            style={{ 
              transform: `translateY(-64px) rotate(${progress * 3.6}deg)`,
              bottom: '50%'
            }}
          />
          {/* Second Hand (The Needle) */}
          <div 
            className="absolute w-[1.5px] h-36 bg-[#C5A059] origin-bottom"
            style={{ 
              transform: `translateY(-72px) rotate(${progress * 43.2}deg)`,
              bottom: '50%',
              transition: 'transform 0.15s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
              boxShadow: '0 0 20px rgba(197, 160, 89, 0.4)'
            }}
          >
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 border border-[#C5A059] rounded-full bg-[#1A1918]" />
          </div>
          
          {/* Jewel Center Hub */}
          <div className="absolute w-5 h-5 rounded-full bg-[#2C2A28] border-2 border-[#C5A059] flex items-center justify-center z-20 shadow-2xl">
            <div className="w-1.5 h-1.5 bg-red-500/80 rounded-full blur-[1px]" /> {/* The Ruby Pivot */}
          </div>
        </div>

        {/* Loading Narrative */}
        <div className="text-center relative">
          <div className="overflow-hidden">
            <h1 
              className="text-white text-xs font-bold uppercase tracking-[1.5em] mb-4 transition-all duration-1000"
              style={{ 
                letterSpacing: `${0.8 + (progress / 100) * 1.5}em`,
                opacity: 0.5 + (progress / 200)
              }}
            >
              Establishing Precision
            </h1>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="text-[10px] font-serif italic text-[#C5A059] opacity-40 mb-6">
               Chronometer Grade Calibration
             </div>
             
             {/* Micro-Progress Bar */}
             <div className="w-48 h-[1px] bg-white/5 relative">
               <div 
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent transition-all duration-700"
                 style={{ width: `${progress}%` }}
               />
             </div>
          </div>
        </div>
      </div>

      {/* Boutique Location Footer */}
      <div className="absolute bottom-16 w-full flex justify-center space-x-12 opacity-20 text-[8px] uppercase tracking-[0.4em] font-medium text-white">
        <span>Geneva</span>
        <span className="text-[#C5A059]">|</span>
        <span>Zurich</span>
        <span className="text-[#C5A059]">|</span>
        <span>London</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 10s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LoadingScreen;
