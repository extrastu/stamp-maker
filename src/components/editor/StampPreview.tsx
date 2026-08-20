import React, { useEffect, useRef, useState } from 'react';
import { StampOptions } from '../../types';
import { renderStamp } from '../../utils/renderStamp';

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
  const renderRequestId = useRef<number>(0);

  useEffect(() => {
    let isCancelled = false;
    const currentReq = ++renderRequestId.current;

    const generatePreview = async () => {
      setIsRendering(true);
      try {
        const result = await renderStamp(
          croppedImageUrl,
          options,
          900,
          true
        );

        if (!isCancelled && currentReq === renderRequestId.current) {
          setPreviewDataUrl(result.dataUrl);
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
    <div className="w-full h-full flex items-center justify-center relative">
      {previewDataUrl ? (
        <div className="relative select-none flex items-center justify-center p-2">
          {/* Authentic Stamp Soft Shadow */}
          <img
            src={previewDataUrl}
            alt="Stamp Preview"
            className="max-w-full max-h-[36vh] sm:max-h-[40vh] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-200"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-neutral-400 text-xs">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>正在生成邮票...</span>
        </div>
      )}

      {isRendering && previewDataUrl && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full">
          更新中...
        </div>
      )}
    </div>
  );
};
