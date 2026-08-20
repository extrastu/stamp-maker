import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { ArrowLeft, ArrowRight, RotateCw, RotateCcw, Check } from 'lucide-react';
import { RatioSelector } from './RatioSelector';
import { AspectRatioId, ImageItem } from '../../types';
import { RATIOS } from '../../utils/constants';
import { getCroppedImg } from '../../utils/cropImage';

interface CropViewProps {
  images: ImageItem[];
  initialRatio?: AspectRatioId;
  onBack: () => void;
  onAllCropsComplete: (croppedImages: ImageItem[]) => void;
}

export const CropView: React.FC<CropViewProps> = ({
  images,
  initialRatio = '3:4',
  onBack,
  onAllCropsComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<ImageItem[]>(() =>
    images.map((img) => ({
      ...img,
      ratioId: img.ratioId || initialRatio,
      rotation: img.rotation || 0,
    }))
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentItem = items[currentIndex] || items[0];
  const activeRatioObj = RATIOS.find((r) => r.id === currentItem.ratioId) || RATIOS[1];

  const handleCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const saveCurrentCrop = async (targetIndex = currentIndex): Promise<ImageItem[]> => {
    const item = items[targetIndex];
    if (!croppedAreaPixels) return items;

    const croppedUrl = await getCroppedImg(
      item.rawUrl,
      croppedAreaPixels,
      item.rotation
    );

    const updated = [...items];
    updated[targetIndex] = {
      ...item,
      croppedUrl,
      croppedAreaPixels,
    };
    setItems(updated);
    return updated;
  };

  const handleRotate = () => {
    setItems((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        rotation: (updated[currentIndex].rotation + 90) % 360,
      };
      return updated;
    });
  };

  const handleResetRotation = () => {
    setItems((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        rotation: 0,
      };
      return updated;
    });
  };

  const handleSelectRatio = (newRatio: AspectRatioId) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        ratioId: newRatio,
      };
      return updated;
    });
  };

  const handleSwitchImage = async (newIndex: number) => {
    if (newIndex === currentIndex || newIndex < 0 || newIndex >= items.length) return;
    try {
      setIsProcessing(true);
      await saveCurrentCrop(currentIndex);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCurrentIndex(newIndex);
    } catch (e) {
      console.error('Failed to switch image crop', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextOrFinish = async () => {
    try {
      setIsProcessing(true);
      const latestItems = await saveCurrentCrop(currentIndex);

      if (currentIndex < items.length - 1) {
        // Move to next image
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        // All images cropped, move to editor
        // Ensure all items have croppedUrl
        const finalItems = [...latestItems];
        for (let i = 0; i < finalItems.length; i++) {
          if (!finalItems[i].croppedUrl) {
            finalItems[i].croppedUrl = finalItems[i].rawUrl;
          }
        }
        onAllCropsComplete(finalItems);
      }
    } catch (e) {
      console.error('Failed to crop image', e);
      alert('图片裁切处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const isLast = currentIndex === items.length - 1;

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-paper text-ink flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Header Bar */}
      <div className="shrink-0 px-4 pt-1 pb-2 bg-paper border-b-2 border-ink z-20 flex items-center justify-between safe-top">
        {/* Reselect Image Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-7 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink transition-all"
        >
          <ArrowLeft className="size-3 stroke-[2.5]" />
          <span>重选图片</span>
        </button>

        {/* Center Batch Pager Badge (if multiple images) */}
        {items.length > 1 && (
          <div className="inline-flex items-center gap-1 bg-sand border-2 border-ink px-2.5 py-0.5 rounded-full shadow-neo-sm text-[11px] font-mono font-bold text-ink">
            <span>第 {currentIndex + 1} / {items.length} 张</span>
          </div>
        )}

        {/* Right Rotation Controls Group */}
        <div className="flex items-center gap-1.5">
          {/* Angle Reset Button */}
          {currentItem.rotation !== 0 && (
            <button
              type="button"
              onClick={handleResetRotation}
              className="inline-flex h-7 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink transition-all"
              title="重置角度为 0°"
            >
              <RotateCcw className="size-3 stroke-[2.5]" />
              <span>重置 0°</span>
            </button>
          )}

          {/* Rotate 90° Button */}
          <button
            type="button"
            onClick={handleRotate}
            className="inline-flex h-7 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink transition-all"
            title="顺时针旋转 90 度"
          >
            <RotateCw className="size-3 stroke-[2.5]" />
            <span>旋转 {currentItem.rotation !== 0 ? `${currentItem.rotation}°` : '90°'}</span>
          </button>
        </div>
      </div>

      {/* Main Cropper Darkroom Stage */}
      <div className="relative flex-1 min-h-0 w-full bg-[#1A1410] overflow-hidden flex items-center justify-center">
        <Cropper
          key={`${currentItem.id}-${currentIndex}`}
          image={currentItem.rawUrl}
          crop={crop}
          zoom={zoom}
          rotation={currentItem.rotation}
          aspect={activeRatioObj.value}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropCompleteInternal}
          showGrid={true}
          classes={{
            containerClassName: 'relative w-full h-full',
            cropAreaClassName: '!border-sun !border-2 !rounded-none shadow-[0_0_0_9999px_rgba(38,32,26,0.85)]',
          }}
        />

        {/* Center Tip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border-2 border-ink shadow-neo-sm text-[11px] font-bold text-ink">
          <span>拖动画面 · 双指缩放</span>
        </div>
      </div>

      {/* Bottom Control Sheet */}
      <div className="shrink-0 bg-paper border-t-2 border-ink p-3.5 space-y-2.5 safe-bottom">
        {/* Multi-Image Thumbnail Pager (if > 1 image) */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              const isCropped = Boolean(item.croppedUrl);
              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => handleSwitchImage(idx)}
                  className={`size-10 rounded-xl border-2 overflow-hidden shrink-0 relative transition-all ${
                    isActive
                      ? 'border-ink shadow-neo scale-105 ring-2 ring-sun ring-offset-1'
                      : 'border-ink/50 opacity-70 hover:opacity-100 hover:border-ink'
                  }`}
                >
                  <img src={item.croppedUrl || item.rawUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  {isCropped && !isActive && (
                    <div className="absolute bottom-0.5 right-0.5 bg-accent text-white rounded-full size-3 flex items-center justify-center">
                      <Check className="size-2 stroke-[3]" />
                    </div>
                  )}
                  <div className="absolute top-0.5 left-0.5 bg-ink/80 text-white font-mono text-[8px] px-1 rounded-xs">
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Ratio Selector */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink px-0.5">
            <span>画幅比例</span>
            <span className="font-mono text-[11px] bg-sand px-2 py-0.5 rounded-md border border-ink/30 text-ink-2">
              {activeRatioObj.label}
            </span>
          </div>
          <RatioSelector
            selectedRatio={currentItem.ratioId}
            onSelectRatio={handleSelectRatio}
            theme="light"
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleNextOrFinish}
            disabled={isProcessing}
            className="w-full h-10 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 border-ink shadow-neo btn-neo transition-all disabled:opacity-50"
          >
            <span>
              {isProcessing
                ? '处理中...'
                : items.length > 1
                ? isLast
                  ? `完成全部裁切 (${items.length}张) · 定制齿孔 💌`
                  : `下一张 (${currentIndex + 1}/${items.length}) ➔`
                : '下一步：定制齿孔 💌'}
            </span>
            <ArrowRight className="size-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
