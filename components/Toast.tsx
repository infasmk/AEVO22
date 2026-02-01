
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-12 right-12 z-[600] animate-fadeInUp">
      <div className={`px-8 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center space-x-4 ${
        type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}>
        <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
