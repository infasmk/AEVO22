
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500; // Elegant slow progression

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(nextProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#1A1918] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C5A059] opacity-[0.03] blur-[160px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Stable Clock Container */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
          
          {/* Outer Polished Bezel */}
          <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-gradient-to-br from-white/5 to-transparent p-1">
            <div className="w-full h-full rounded-full border border-[#C5A059]/20" />
          </div>

          {/* The Dial Face */}
          <div className="absolute inset-4 rounded-full bg-[#1F1E1D] shadow-inner flex items-center justify-center overflow-hidden">
             {/* Radial Sunburst Texture */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />
             
             {/* AEVO Center Logo */}
             <div className="z-10 text-center select-none pointer-events-none mb-20">
                <h2 className="text-white text-3xl md:text-4xl font-serif tracking-[0.4em] uppercase italic opacity-80">
                  AEVO
                </h2>
                <div className="w-8 h-px bg-[#C5A059] mx-auto mt-2 opacity-40" />
             </div>

             {/* Minimalist Hour Markers */}
             {[...Array(12)].map((_, i) => (
               <div
                 key={i}
                 className="absolute w-0.5 bg-gradient-to-b from-[#C5A059] to-transparent origin-bottom"
                 style={{
                   height: i % 3 === 0 ? '20px' : '10px',
                   width: i % 3 === 0 ? '2px' : '1px',
                   bottom: '50%',
                   left: '50%',
                   transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-135px)`,
                   opacity: 0.6
                 }}
               />
             ))}
          </div>

          {/* Precision Hands - Anchored to Exact Center */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* Hour Hand */}
            <div 
              className="absolute left-1/2 bottom-1/2 w-1.5 h-[22%] bg-white/90 rounded-full origin-bottom shadow-lg"
              style={{ 
                transform: `translateX(-50%) rotate(${120 + (progress * 0.1)}deg)`,
                transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            
            {/* Minute Hand */}
            <div 
              className="absolute left-1/2 bottom-1/2 w-1 h-[32%] bg-white/40 rounded-full origin-bottom"
              style={{ 
                transform: `translateX(-50%) rotate(${340 + (progress * 0.5)}deg)`,
                transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            
            {/* Second Hand - High-Frequency Mechanical Sweep */}
            <div 
              className="absolute left-1/2 bottom-1/2 w-[1.5px] h-[38%] bg-[#C5A059] origin-bottom shadow-[0_0_15px_rgba(197,160,89,0.3)]"
              style={{ 
                transform: `translateX(-50%) rotate(${progress * 6}deg)`,
                // This transition simulates a high-beat mechanical movement
                transition: 'transform 0.125s cubic-bezier(0.4, 1.2, 0.6, 1)',
              }}
            >
              {/* Counter-weight */}
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 border border-[#C5A059] rounded-full bg-[#1F1E1D]" />
            </div>
            
            {/* Cannon Pinion (Center Hub) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1A1918] border-2 border-[#C5A059] z-30 shadow-2xl flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059]" />
            </div>
          </div>

          {/* Progress Circular Accent */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.05]">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="rgba(197, 160, 89, 0.05)"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="#C5A059"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="100%"
              strokeDashoffset={`${100 - progress}%`}
              pathLength="100"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
        </div>

        {/* Narrative Information */}
        <div className="mt-16 text-center space-y-6">
          <div className="overflow-hidden">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[1em] opacity-40 animate-pulse">
              Authenticating Mechanism
            </h3>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center space-x-4 mb-2">
                <div className="h-px w-6 bg-[#C5A059]/30" />
                <span className="text-[#C5A059] text-[11px] font-serif italic tracking-widest uppercase">
                  CALIBRATION {Math.round(progress)}%
                </span>
                <div className="h-px w-6 bg-[#C5A059]/30" />
             </div>
             <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-medium">
               Geneva • Zurich • London
             </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default LoadingScreen;
