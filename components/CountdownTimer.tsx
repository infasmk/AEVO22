
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
  className?: string;
  onEnd?: () => void;
  variant?: 'simple' | 'elaborate';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, className = "", onEnd, variant = 'simple' }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
        if (onEnd) onEnd();
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  if (!timeLeft) return null;

  if (variant === 'elaborate') {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        {[
          { label: 'Days', value: timeLeft.d },
          { label: 'Hrs', value: timeLeft.h },
          { label: 'Min', value: timeLeft.m },
          { label: 'Sec', value: timeLeft.s }
        ].map((item, idx, arr) => (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-serif italic text-[#A68E74] tracking-tighter tabular-nums">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-black/20 mt-1">{item.label}</span>
            </div>
            {idx < arr.length - 1 && (
              <span className="text-xl md:text-3xl font-serif text-[#A68E74]/20 pt-1">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 font-mono font-bold tracking-tighter ${className}`}>
      <span>{timeLeft.d}D</span>
      <span className="opacity-30">:</span>
      <span>{timeLeft.h}H</span>
      <span className="opacity-30">:</span>
      <span>{timeLeft.m}M</span>
      <span className="opacity-30">:</span>
      <span className="text-[#A68E74]">{timeLeft.s}S</span>
    </div>
  );
};

export default CountdownTimer;
