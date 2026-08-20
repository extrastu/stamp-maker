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
    <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
      {RATIOS.map((ratio) => {
        const isSelected = selectedRatio === ratio.id;
        return (
          <button
            key={ratio.id}
            onClick={() => onSelectRatio(ratio.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              isSelected
                ? 'bg-ink text-paper-50 shadow-sm'
                : 'bg-paper-200/80 text-ink-muted hover:text-ink hover:bg-paper-300/80'
            }`}
          >
            {/* Visual ratio miniature box */}
            <span
              className={`inline-block border ${
                isSelected ? 'border-paper-50 bg-paper-50/20' : 'border-ink-muted/60'
              } rounded-[1px]`}
              style={{
                width: ratio.width > ratio.height ? '14px' : `${Math.round(14 * (ratio.width / ratio.height))}px`,
                height: ratio.height > ratio.width ? '14px' : `${Math.round(14 * (ratio.height / ratio.width))}px`,
              }}
            />
            <span>{ratio.id}</span>
          </button>
        );
      })}
    </div>
  );
};
