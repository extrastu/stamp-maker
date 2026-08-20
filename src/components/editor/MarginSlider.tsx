import React from 'react';
import { Frame, CornerUpRight } from 'lucide-react';

interface MarginSliderProps {
  margin: number;
  photoRadius: number;
  onMarginChange: (margin: number) => void;
  onPhotoRadiusChange: (radius: number) => void;
}

export const MarginSlider: React.FC<MarginSliderProps> = ({
  margin,
  photoRadius,
  onMarginChange,
  onPhotoRadiusChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Margin / White Border Control */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <label className="font-serif font-semibold text-ink flex items-center gap-1.5">
            <Frame className="w-3.5 h-3.5 text-ink-muted" />
            <span>邮票留白边距 (Margin)</span>
          </label>
          <span className="font-mono text-[11px] text-ink-muted">{margin}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={80}
          value={margin}
          onChange={(e) => onMarginChange(Number(e.target.value))}
          aria-label="调整留白边距"
        />
        <div className="flex justify-between text-[10px] text-ink-muted/70 mt-1">
          <span>紧凑 (10px)</span>
          <span>标准 (36px)</span>
          <span>宽边 (80px)</span>
        </div>
      </div>

      {/* Photo Corner Radius Control */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <label className="font-serif font-semibold text-ink flex items-center gap-1.5">
            <CornerUpRight className="w-3.5 h-3.5 text-ink-muted" />
            <span>图片圆角 (Photo Radius)</span>
          </label>
          <span className="font-mono text-[11px] text-ink-muted">{photoRadius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          value={photoRadius}
          onChange={(e) => onPhotoRadiusChange(Number(e.target.value))}
          aria-label="调整图片圆角"
        />
        <div className="flex justify-between text-[10px] text-ink-muted/70 mt-1">
          <span>直角 (0px)</span>
          <span>微圆角 (4px)</span>
          <span>大圆角 (32px)</span>
        </div>
      </div>
    </div>
  );
};
