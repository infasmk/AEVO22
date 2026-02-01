
import React from 'react';
import { X } from './Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm Protocol",
  cancelText = "Abort",
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#000]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A1918] w-full max-w-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden animate-fadeInUp">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-serif text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/20 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-10">
          <p className="text-white/40 text-sm italic font-light leading-relaxed mb-10">
            {message}
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${
                type === 'danger' 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                  : 'bg-[#C5A059] text-white hover:scale-[1.02]'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
