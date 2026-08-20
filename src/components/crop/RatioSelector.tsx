import React from 'react';
import { RATIOS } from '../../utils/constants';
import { AspectRatioId } from '../../types';

interface RatioSelectorProps {
  selectedRatio: AspectRatioId;
  onSelectRatio: (ratio: AspectRatioId) => void;
  theme?: 'dark' | 'light';
}

export const RatioSelector: React.FC<RatioSelectorProps> = ({
  selectedRatio,
  onSelectRatio,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-5 gap-2 w-full">
      {RATIOS.map((ratio) => {
        const isSelected = selectedRatio === ratio.id;
        return (
          <button
            key={ratio.id}
            type="button"
            onClick={() => onSelectRatio(ratio.id)}
            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center select-none btn-neo ${
              isSelected
                ? isDark
                  ? 'bg-accent text-white border-2 border-white shadow-neo-white'
                  : 'bg-accent text-white border-2 border-ink shadow-neo'
                : isDark
                ? 'bg-[#1E1915] text-neutral-300 border-2 border-white/20 hover:border-white/60'
                : 'bg-card text-ink border-2 border-ink/40 hover:border-ink hover:bg-sand'
            }`}
          >
            {ratio.id}
          </button>
        );
      })}
    </div>
  );
};
