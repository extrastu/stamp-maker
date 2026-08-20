import React from 'react';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ZoomSliderProps {
  zoom: number;
  rotation: number;
  onZoomChange: (zoom: number) => void;
  onRotateChange: (rotation: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({
  zoom,
  rotation,
  onZoomChange,
  onRotateChange,
  minZoom = 1,
  maxZoom = 3,
}) => {
  const handleRotate = () => {
    onRotateChange((rotation + 90) % 360);
  };

  return (
    <div className="flex items-center gap-3 w-full bg-paper-200/60 p-2 rounded-xl border border-paper-300/40">
      <button
        onClick={() => onZoomChange(Math.max(minZoom, zoom - 0.2))}
        className="p-1 text-ink-muted hover:text-ink transition-colors rounded"
        title="缩小"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={0.05}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
          aria-label="缩放图片"
        />
        <span className="text-[11px] font-mono text-ink-muted w-10 text-right">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <button
        onClick={() => onZoomChange(Math.min(maxZoom, zoom + 0.2))}
        className="p-1 text-ink-muted hover:text-ink transition-colors rounded"
        title="放大"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-paper-300" />

      <button
        onClick={handleRotate}
        className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink p-1 hover:bg-paper-300/50 rounded transition-colors"
        title="顺时针旋转90度"
      >
        <RotateCw className="w-4 h-4" />
        <span className="text-[11px] font-mono">{rotation}°</span>
      </button>
    </div>
  );
};
