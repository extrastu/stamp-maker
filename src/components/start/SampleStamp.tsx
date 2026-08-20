import React from 'react';

interface SampleStampProps {
  id?: string;
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
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left select-none overflow-hidden rounded-2xl bg-card p-2 border-2 border-ink shadow-neo btn-neo hover:-translate-y-0.5 hover:shadow-neo-lg transition-all focus:outline-none ${className}`}
    >
      {/* Image thumbnail container */}
      <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-sand relative border border-ink/20">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card Info */}
      <div className="pt-2 px-0.5 flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink truncate font-sans">
          {title}
        </span>
        <span className="text-[10px] font-bold text-accent shrink-0">
          ✨
        </span>
      </div>
    </button>
  );
};
