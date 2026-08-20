import React, { useEffect, useRef, useState } from 'react';
import { MakerMode, StampOptions, TicketOptions } from '../../types';
import { renderStamp } from '../../utils/renderStamp';
import { renderTicket } from '../../utils/renderTicket';

interface StampPreviewProps {
  croppedImageUrl: string;
  mode?: MakerMode;
  options: StampOptions;
  ticketOptions?: TicketOptions;
}

export const StampPreview: React.FC<StampPreviewProps> = ({
  croppedImageUrl,
  mode = 'stamp',
  options,
  ticketOptions,
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
        if (mode === 'ticket' && ticketOptions) {
          const result = await renderTicket(
            croppedImageUrl,
            ticketOptions,
            900,
            true
          );
          if (!isCancelled && currentReq === renderRequestId.current) {
            setPreviewDataUrl(result.dataUrl);
          }
        } else {
          const result = await renderStamp(
            croppedImageUrl,
            options,
            900,
            true
          );
          if (!isCancelled && currentReq === renderRequestId.current) {
            setPreviewDataUrl(result.dataUrl);
          }
        }
      } catch (err) {
        console.error('Failed to render preview', err);
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
  }, [croppedImageUrl, mode, options, ticketOptions]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {previewDataUrl ? (
        <div className="relative select-none flex items-center justify-center p-1 max-h-full">
          {/* Authentic Preview with Soft Shadow */}
          <img
            src={previewDataUrl}
            alt={mode === 'ticket' ? 'Ticket Stub Preview' : 'Stamp Preview'}
            className="max-w-full max-h-[30vh] sm:max-h-[34vh] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-200"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-ink-3 text-xs">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>{mode === 'ticket' ? '正在生成旅行票根...' : '正在生成邮票...'}</span>
        </div>
      )}

      {isRendering && previewDataUrl && (
        <div className="absolute top-1 right-1 bg-ink/70 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
          渲染中
        </div>
      )}
    </div>
  );
};
