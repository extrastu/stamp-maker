import React from 'react';

interface SampleStampProps {
  title: string;
  imageUrl: string;
  className?: string;
  onClick?: () => void;
}

export const SampleStamp: React.FC<SampleStampProps> = ({
  title,
  imageUrl,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      {/* Real Stamp Card with caption */}
      <div className="relative p-1.5 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-neutral-200/60 rounded-[3px]">
        <div className="w-full aspect-[3/4] overflow-hidden relative bg-neutral-100 rounded-[1px]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-1 text-[10px] text-neutral-500 font-medium truncate text-center">
          {title}
        </div>
      </div>
    </div>
  );
};
