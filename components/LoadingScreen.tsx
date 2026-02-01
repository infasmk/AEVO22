
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
    <div className="fixed inset-0 z-[1000] bg-[#F7F3F0] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8C7861] opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          
          <div className="absolute inset-0 rounded-full border border-black/5 bg-gradient-to-br from-white to-[#E8E2D8] p-1 shadow-sm">
            <div className="w-full h-full rounded-full border border-[#8C7861]/10" />
          </div>

          <div className="absolute inset-4 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#8C7861_0%,_transparent_100%)]" />
             
             <div className="z-10 text-center select-none pointer-events-none mb-16">
                <h2 className="text-black/80 text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase italic">
                  AEVO
                </h2>
                <div className="w-6 h-px bg-[#8C7861]/40 mx-auto mt-2" />
             </div>

             {[...Array(12)].map((_, i) => (
               <div
                 key={i}
                 className="absolute w-px bg-[#8C7861]/30 origin-bottom"
                 style={{
                   height: i % 3 === 0 ? '12px' : '6px',
                   bottom: '50%',
                   left: '50%',
                   transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-115px)`,
                 }}
               />
             ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute left-1/2 bottom-1/2 w-1 h-[22%] bg-black/60 rounded-full origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${120 + (progress * 0.1)}deg)` }}
            />
            <div 
              className="absolute left-1/2 bottom-1/2 w-0.5 h-[32%] bg-black/20 rounded-full origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${340 + (progress * 0.5)}deg)` }}
            />
            <div 
              className="absolute left-1/2 bottom-1/2 w-[1.5px] h-[38%] bg-[#8C7861] origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${progress * 6}deg)` }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#8C7861]/40 z-30 shadow-sm" />
          </div>

          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.05]">
            <circle cx="50%" cy="50%" r="48%" stroke="rgba(140, 120, 97, 0.05)" strokeWidth="1" fill="none" />
            <circle
              cx="50%" cy="50%" r="48%" stroke="#8C7861" strokeWidth="1" fill="none"
              strokeDasharray="100%" strokeDashoffset={`${100 - progress}%`} pathLength="100"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
        </div>

        <div className="mt-12 text-center space-y-4">
          <h3 className="text-black/30 text-[8px] font-black uppercase tracking-[0.8em] animate-pulse">
            Mechanical Synthesis
          </h3>
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-4 bg-black/10" />
            <span className="text-[#8C7861] text-[9px] font-bold tracking-[0.2em]">CALIBRATING {Math.round(progress)}%</span>
            <div className="h-px w-4 bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
