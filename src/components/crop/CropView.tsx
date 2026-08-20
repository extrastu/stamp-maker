import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { RatioSelector } from './RatioSelector';
import { AspectRatioId } from '../../types';
import { RATIOS } from '../../utils/constants';
import { getCroppedImg } from '../../utils/cropImage';

interface CropViewProps {
  imageUrl: string;
  initialRatio?: AspectRatioId;
  onBack: () => void;
  onCropComplete: (croppedUrl: string, pixelCrop: Area, ratioId: AspectRatioId) => void;
}

export const CropView: React.FC<CropViewProps> = ({
  imageUrl,
  initialRatio = '3:4',
  onBack,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioId>(initialRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeRatioObj = RATIOS.find((r) => r.id === selectedRatio) || RATIOS[1];

  const handleCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleNext = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage, croppedAreaPixels, selectedRatio);
    } catch (e) {
      console.error('Failed to crop image', e);
      alert('图片裁切处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#0C0C0E] text-white flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Controls Row (Physically below native nav bar) */}
      <div className="shrink-0 px-4 pb-2 z-20 flex items-center justify-between safe-top">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[12px] font-medium text-white shadow-btn backdrop-blur-md hover:bg-white/15 active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="size-3.5" />
          <span>重选图片</span>
        </button>

        <button
          type="button"
          onClick={handleRotate}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[12px] font-medium text-white shadow-btn backdrop-blur-md hover:bg-white/15 active:scale-[0.97] transition-all"
          title="旋转 90 度"
        >
          <RotateCw className="size-3.5" />
          <span className="font-mono text-[11px] tabular-nums">{rotation}°</span>
        </button>
      </div>

      {/* Main Cropper Stage (Flexibly scales to remaining space) */}
      <div className="relative flex-1 min-h-0 w-full bg-[#08080A] overflow-hidden flex items-center justify-center">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={activeRatioObj.value}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropCompleteInternal}
          showGrid={true}
          classes={{
            containerClassName: 'relative w-full h-full',
            cropAreaClassName: '!border-white/90 !border-[1.5px] !rounded-none shadow-[0_0_0_9999px_rgba(0,0,0,0.75)]',
          }}
        />

        {/* Center Tip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-neutral-300 shadow-hairline backdrop-blur-md">
          <span>拖动构图 · 双指缩放</span>
        </div>
      </div>

      {/* Bottom Control Sheet */}
      <div className="shrink-0 bg-[#141418] border-t border-white/10 p-4 space-y-3.5 safe-bottom">
        {/* Ratio Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[12px] text-neutral-400 font-medium px-1">
            <span>画幅比例</span>
            <span className="font-mono text-[11px] text-neutral-500">{activeRatioObj.label}</span>
          </div>
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelectRatio={(r) => setSelectedRatio(r)}
            theme="dark"
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessing}
            className="w-full h-11 rounded-full bg-white text-[#111113] font-medium text-[13px] flex items-center justify-center gap-1.5 shadow-btn hover:bg-neutral-100 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <span>{isProcessing ? '处理中...' : '下一步：定制齿孔'}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
