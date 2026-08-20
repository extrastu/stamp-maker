import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1F1F26]/95 backdrop-blur-md text-white rounded-full shadow-lg text-xs border border-white/10 max-w-sm whitespace-nowrap">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        )}
        <span className="font-medium">{toast.text}</span>
        <button
          onClick={onClose}
          className="ml-1 text-neutral-400 hover:text-white transition-colors p-0.5"
          aria-label="关闭提示"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
