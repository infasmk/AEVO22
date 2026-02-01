
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

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
    <div className="fixed inset-0 z-[1000] bg-[#FAF8F6] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A68E74] opacity-[0.06] blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          
          <div className="absolute inset-0 rounded-full border border-black/5 bg-gradient-to-br from-white to-[#F2EFEC] p-1 shadow-sm">
            <div className="w-full h-full rounded-full border border-[#A68E74]/15" />
          </div>

          <div className="absolute inset-4 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#A68E74_0%,_transparent_100%)]" />
             
             <div className="z-10 text-center select-none pointer-events-none mb-14">
                <h2 className="text-black/80 text-2xl md:text-3xl font-serif tracking-[0.4em] uppercase italic">
                  AEVO
                </h2>
                <div className="w-6 h-px bg-[#A68E74]/50 mx-auto mt-2.5" />
             </div>

             {[...Array(12)].map((_, i) => (
               <div
                 key={i}
                 className="absolute w-px bg-[#A68E74]/30 origin-bottom"
                 style={{
                   height: i % 3 === 0 ? '12px' : '6px',
                   bottom: '50%',
                   left: '50%',
                   transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-110px)`,
                 }}
               />
             ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute left-1/2 bottom-1/2 w-1 h-[20%] bg-black/50 rounded-full origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${120 + (progress * 0.1)}deg)` }}
            />
            <div 
              className="absolute left-1/2 bottom-1/2 w-0.5 h-[30%] bg-black/15 rounded-full origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${340 + (progress * 0.5)}deg)` }}
            />
            <div 
              className="absolute left-1/2 bottom-1/2 w-[1.5px] h-[36%] bg-[#A68E74] origin-bottom shadow-sm"
              style={{ transform: `translateX(-50%) rotate(${progress * 6}deg)` }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-[#A68E74]/40 z-30 shadow-sm" />
          </div>

          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.04]">
            <circle cx="50%" cy="50%" r="48%" stroke="rgba(166, 142, 116, 0.05)" strokeWidth="1" fill="none" />
            <circle
              cx="50%" cy="50%" r="48%" stroke="#A68E74" strokeWidth="1" fill="none"
              strokeDasharray="100%" strokeDashoffset={`${100 - progress}%`} pathLength="100"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
        </div>

        <div className="mt-12 text-center space-y-4">
          <h3 className="text-black/30 text-[8px] font-black uppercase tracking-[0.8em] animate-pulse">
            Atelier Preparation
          </h3>
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-4 bg-black/10" />
            <span className="text-[#A68E74] text-[9px] font-bold tracking-[0.3em]">CALIBRATING {Math.round(progress)}%</span>
            <div className="h-px w-4 bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
