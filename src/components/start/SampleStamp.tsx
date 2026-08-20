import React from 'react';

interface SampleStampProps {
  title: string;
  price?: string;
  imageUrl: string;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

export const SampleStamp: React.FC<SampleStampProps> = ({
  title,
  price = '80¢',
  imageUrl,
  rotation = 0,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`group relative p-2.5 bg-stamp-ivory rounded-none shadow-stamp hover:shadow-stamp-lg transition-all duration-300 cursor-pointer select-none hover:scale-105 hover:z-20 ${className}`}
    >
      {/* CSS Stamp Perforated Edges simulation for landing cards */}
      <div className="relative p-1 bg-white border border-paper-200/40">
        <div className="w-full aspect-[3/4] overflow-hidden bg-paper-200 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <span className="text-[10px] text-white font-medium">点击一键制作 ↗</span>
          </div>
        </div>

        {/* Stamp Typography details */}
        <div className="pt-2 pb-1 px-1 flex items-center justify-between font-serif text-[10px] text-ink-muted">
          <span className="truncate max-w-[70px] font-semibold text-ink uppercase tracking-wider">{title}</span>
          <span className="font-mono text-ink/70">{price}</span>
        </div>
      </div>

      {/* Postage cancellation mark stamp watermark decoration */}
      <div className="absolute -bottom-2 -right-2 w-10 h-10 border border-ink-muted/30 rounded-full flex items-center justify-center pointer-events-none rotate-12 opacity-70 group-hover:opacity-90 transition-opacity">
        <div className="text-[7px] font-mono text-ink-muted text-center leading-none">
          POST<br/>2026
        </div>
      </div>
    </div>
  );
};
