import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { ArrowLeft, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';
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

  const handleResetRotation = () => {
    setRotation(0);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-paper text-ink flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Header Bar (Warm Paper Background with Crisp Neo-Brutalist Buttons) */}
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

        {/* Right Rotation Controls Group */}
        <div className="flex items-center gap-1.5">
          {/* Angle Reset Button (Visible when rotated) */}
          {rotation !== 0 && (
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
            <span>旋转 {rotation !== 0 ? `${rotation}°` : '90°'}</span>
          </button>
        </div>
      </div>

      {/* Main Cropper Darkroom Stage */}
      <div className="relative flex-1 min-h-0 w-full bg-[#1A1410] overflow-hidden flex items-center justify-center">
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
        {/* Ratio Selector */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink px-0.5">
            <span>画幅比例</span>
            <span className="font-mono text-[11px] bg-sand px-2 py-0.5 rounded-md border border-ink/30 text-ink-2">
              {activeRatioObj.label}
            </span>
          </div>
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelectRatio={(r) => setSelectedRatio(r)}
            theme="light"
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessing}
            className="w-full h-10 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 border-ink shadow-neo btn-neo transition-all disabled:opacity-50"
          >
            <span>{isProcessing ? '处理中...' : '下一步：定制齿孔 💌'}</span>
            <ArrowRight className="size-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
