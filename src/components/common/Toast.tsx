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
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-paper-900 text-paper-50 rounded-xl shadow-stamp-lg text-sm border border-paper-800/20 max-w-md">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="font-medium leading-relaxed">{toast.text}</span>
        <button
          onClick={onClose}
          className="ml-2 text-paper-300 hover:text-paper-50 transition-colors p-1"
          aria-label="关闭提示"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
