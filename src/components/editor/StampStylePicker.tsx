import React from 'react';
import { STAMP_STYLES } from '../../utils/constants';
import { StampStyleId, StampOptions } from '../../types';
import { Sliders } from 'lucide-react';

interface StampStylePickerProps {
  options: StampOptions;
  onChange: (updated: Partial<StampOptions>) => void;
}

export const StampStylePicker: React.FC<StampStylePickerProps> = ({
  options,
  onChange,
}) => {
  const handleSelectPreset = (presetId: StampStyleId) => {
    const preset = STAMP_STYLES.find((s) => s.id === presetId);
    if (preset) {
      onChange({
        style: presetId,
        holeRadius: preset.baseRadius,
        holeGap: preset.baseGap,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-serif font-semibold text-ink">
          边框齿孔样式 (Perforation Style)
        </label>
      </div>

      {/* 3 Preset Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {STAMP_STYLES.map((preset) => {
          const isSelected = options.style === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-ink bg-ink text-paper-50 shadow-sm'
                  : 'border-paper-300 bg-white/70 text-ink hover:border-ink/50 hover:bg-white'
              }`}
            >
              {/* Visual simulated teeth dots */}
              <div className="flex items-center justify-center gap-1 mb-1.5 h-3">
                {preset.id === 'classic' && (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  </div>
                )}
                {preset.id === 'fine' && (
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                  </div>
                )}
                {preset.id === 'wide' && (
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold">{preset.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-70 font-sans">{preset.name.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Custom Hole Sliders */}
      <div className="pt-2">
        <details className="group">
          <summary className="cursor-pointer text-[11px] text-ink-muted hover:text-ink flex items-center gap-1 list-none select-none">
            <Sliders className="w-3 h-3" />
            <span>微调齿孔半径与间距</span>
            <span className="text-[9px] text-ink-muted/70 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2.5 space-y-2.5 p-3 bg-paper-100 rounded-xl border border-paper-200 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-ink-muted mb-1">
                <span>齿孔半径 (Hole Size)</span>
                <span className="font-mono">{options.holeRadius}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={36}
                value={options.holeRadius}
                onChange={(e) =>
                  onChange({
                    style: 'custom',
                    holeRadius: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-ink-muted mb-1">
                <span>齿孔间距 (Hole Gap)</span>
                <span className="font-mono">{options.holeGap}px</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={options.holeGap}
                onChange={(e) =>
                  onChange({
                    style: 'custom',
                    holeGap: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
