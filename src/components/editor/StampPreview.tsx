import React, { useEffect, useRef, useState } from 'react';
import { StampOptions } from '../../types';
import { renderStamp } from '../../utils/renderStamp';
import { Eye, Layers } from 'lucide-react';

interface StampPreviewProps {
  croppedImageUrl: string;
  options: StampOptions;
}

export const StampPreview: React.FC<StampPreviewProps> = ({
  croppedImageUrl,
  options,
}) => {
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [previewBg, setPreviewBg] = useState<'paper' | 'transparent'>('paper');
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const renderRequestId = useRef<number>(0);

  useEffect(() => {
    let isCancelled = false;
    const currentReq = ++renderRequestId.current;

    const generatePreview = async () => {
      setIsRendering(true);
      try {
        // Preview rendering with ~900px max side for speed
        const result = await renderStamp(
          croppedImageUrl,
          options,
          900,
          true // Always get transparent stamp to preview over selected previewBg
        );

        if (!isCancelled && currentReq === renderRequestId.current) {
          setPreviewDataUrl(result.dataUrl);
          setDimensions({ width: result.width, height: result.height });
        }
      } catch (err) {
        console.error('Failed to render stamp preview', err);
      } finally {
        if (!isCancelled && currentReq === renderRequestId.current) {
          setIsRendering(false);
        }
      }
    };

    generatePreview();

    return () => {
      isCancelled = true;
    };
  }, [croppedImageUrl, options]);

  return (
    <div className="flex flex-col h-full items-center justify-between">
      {/* Top Preview Controls / Metadata */}
      <div className="w-full flex items-center justify-between px-3 py-2 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Eye className="w-3.5 h-3.5" />
          <span>实时预览</span>
          {dimensions.width > 0 && (
            <span className="text-paper-800/60 hidden sm:inline">
              ({dimensions.width} × {dimensions.height})
            </span>
          )}
        </div>

        {/* Preview Backdrop Toggle */}
        <div className="flex items-center gap-1 bg-paper-200/80 p-0.5 rounded-lg border border-paper-300/40">
          <button
            onClick={() => setPreviewBg('paper')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              previewBg === 'paper'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            纸张底
          </button>
          <button
            onClick={() => setPreviewBg('transparent')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              previewBg === 'transparent'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>透明底</span>
          </button>
        </div>
      </div>

      {/* Main Stamp Stage */}
      <div
        className={`w-full flex-1 min-h-[340px] sm:min-h-[460px] rounded-2xl flex items-center justify-center p-6 sm:p-10 transition-colors border border-paper-200 ${
          previewBg === 'transparent' ? 'bg-transparency-grid' : 'bg-paper-100 paper-texture'
        }`}
      >
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          {previewDataUrl ? (
            <div className="relative group select-none">
              {/* Realistic Stamp Drop Shadow */}
              <img
                src={previewDataUrl}
                alt="Stamp Preview"
                className={`max-w-full max-h-[50vh] sm:max-h-[56vh] object-contain transition-all duration-200 ${
                  options.shadow
                    ? 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:drop-shadow-[0_16px_32px_rgba(0,0,0,0.16)]'
                    : ''
                }`}
              />

              {/* Subtle hover info tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-ink/80 text-paper-50 text-[10px] px-2.5 py-1 rounded-md backdrop-blur-sm whitespace-nowrap">
                真实齿孔透明镂空效果
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-muted text-xs">
              <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              <span>正在生成邮票齿孔...</span>
            </div>
          )}

          {isRendering && previewDataUrl && (
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
              更新中...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full text-center text-[11px] text-ink-muted/80 pt-2 font-serif">
        ✨ 齿孔由 Canvas 动态挖孔生成 · 导出时将输出高清无损画质
      </div>
    </div>
  );
};
