import React from "react";
import { ShieldCheck, Stamp, RotateCcw } from "lucide-react";
import { AppStep } from "../../types";

interface HeaderProps {
  currentStep: AppStep;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onReset }) => {
  return (
    <header className='w-full border-b border-paper-200 bg-paper-100/90 backdrop-blur-md sticky top-0 z-30 transition-all safe-top'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        {/* Brand Logo & Name */}
        <div
          onClick={currentStep !== "start" ? onReset : undefined}
          className={`flex items-center gap-2.5 ${currentStep !== "start" ? "cursor-pointer group" : ""}`}
        >
          <div className='w-9 h-9 rounded-lg bg-ink text-paper-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform'>
            <Stamp className='w-5 h-5 text-paper-100' />
          </div>
          <div>
            <div className='flex items-center gap-1.5'>
              <span className='font-serif font-bold text-lg tracking-wide text-ink'>Stamp Maker</span>
            </div>
            <p className='text-[11px] text-ink-muted leading-none hidden sm:block'>把照片变成专属复古邮票</p>
          </div>
        </div>

        {/* Step Progress indicators (for Crop & Edit) */}
        {currentStep !== "start" && (
          <div className='hidden md:flex items-center gap-2 text-xs text-ink-muted'>
            <span
              className={`px-2 py-1 rounded-md transition-colors ${currentStep === "crop" ? "bg-paper-200 text-ink font-semibold" : ""}`}
            >
              1. 裁切构图
            </span>
            <span>→</span>
            <span
              className={`px-2 py-1 rounded-md transition-colors ${currentStep === "edit" ? "bg-paper-200 text-ink font-semibold" : ""}`}
            >
              2. 邮票定制
            </span>
          </div>
        )}

        {/* Right side Actions */}
        <div className='flex items-center gap-3'>
          {currentStep !== "start" && onReset && (
            <button
              onClick={onReset}
              className='flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-paper-200 transition-colors'
              title='重新上传图片'
            >
              <RotateCcw className='w-3.5 h-3.5' />
              <span className='hidden sm:inline'>换一张图</span>
            </button>
          )}

          {/* Privacy Badge */}
          <div className='flex items-center gap-1 text-[11px] text-ink-muted bg-paper-200/70 border border-paper-300/60 px-2.5 py-1 rounded-full'>
            <ShieldCheck className='w-3.5 h-3.5 text-emerald-600' />
            <span className='hidden sm:inline'>100% 本地处理 · 隐私安全</span>
            <span className='sm:hidden'>本地处理</span>
          </div>
        </div>
      </div>
    </header>
  );
};
