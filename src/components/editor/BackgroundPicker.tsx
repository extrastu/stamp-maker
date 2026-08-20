import React from 'react';
import { COLOR_PRESETS } from '../../utils/constants';
import { Pipette, Check } from 'lucide-react';

interface BackgroundPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  selectedColor,
  onChange,
}) => {
  const isCustomColor = !COLOR_PRESETS.some(
    (c) => c.hex.toLowerCase() === selectedColor.toLowerCase()
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-serif font-semibold text-ink">
          邮票底纸颜色 (Paper Background)
        </label>
        <span className="text-[11px] font-mono text-ink-muted uppercase">
          {selectedColor}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {COLOR_PRESETS.map((preset) => {
          const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase();
          const isDark = preset.id === 'black';

          return (
            <button
              key={preset.id}
              onClick={() => onChange(preset.hex)}
              title={preset.name}
              style={{ backgroundColor: preset.hex }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-transform relative ${
                isSelected
                  ? 'scale-110 ring-2 ring-ink ring-offset-2 border-transparent'
                  : 'hover:scale-105 border-paper-300/80 shadow-xs'
              }`}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    isDark ? 'text-white' : 'text-ink'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Custom Color Picker Input */}
        <label
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-paper-300 flex items-center justify-center cursor-pointer hover:border-ink transition-colors relative overflow-hidden ${
            isCustomColor ? 'ring-2 ring-ink ring-offset-2 border-ink' : ''
          }`}
          title="自定义颜色"
          style={isCustomColor ? { backgroundColor: selectedColor } : {}}
        >
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            aria-label="选择自定义颜色"
          />
          {!isCustomColor && <Pipette className="w-3.5 h-3.5 text-ink-muted" />}
        </label>
      </div>
    </div>
  );
};
