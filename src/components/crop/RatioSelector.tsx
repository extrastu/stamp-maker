import React from 'react';
import { RATIOS } from '../../utils/constants';
import { AspectRatioId } from '../../types';

interface RatioSelectorProps {
  selectedRatio: AspectRatioId;
  onSelectRatio: (ratio: AspectRatioId) => void;
}

export const RatioSelector: React.FC<RatioSelectorProps> = ({
  selectedRatio,
  onSelectRatio,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 w-full">
      {RATIOS.map((ratio) => {
        const isSelected = selectedRatio === ratio.id;
        return (
          <button
            key={ratio.id}
            type="button"
            onClick={() => onSelectRatio(ratio.id)}
            className={`py-2.5 px-1 rounded-xl text-xs font-semibold transition-all text-center select-none ${
              isSelected
                ? 'bg-[#7059E8] text-white shadow-md shadow-purple-900/40 ring-1 ring-white/30 scale-[1.02]'
                : 'bg-[#24242C] text-neutral-400 hover:text-white hover:bg-[#30303A]'
            }`}
          >
            {ratio.id}
          </button>
        );
      })}
    </div>
  );
};
