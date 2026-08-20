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
    <div className="min-h-screen bg-[#141418] text-white flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none safe-top">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-1.5 text-xs text-white/90 bg-black/50 hover:bg-black/70 px-3.5 py-2 rounded-full backdrop-blur-md border border-white/15 transition-all active:scale-[0.97] shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>重选图片</span>
        </button>

        <button
          onClick={handleRotate}
          className="pointer-events-auto flex items-center gap-1 text-xs text-white/90 bg-black/50 hover:bg-black/70 px-3 py-2 rounded-full backdrop-blur-md border border-white/15 transition-all active:scale-[0.97] shadow-md"
          title="旋转图片"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">{rotation}°</span>
        </button>
      </div>

      {/* Main Cropper Stage */}
      <div className="relative flex-1 min-h-[460px] w-full bg-[#0A0A0D] overflow-hidden flex items-center justify-center">
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
            cropAreaClassName: '!border-white !border-2 !rounded-none shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]',
          }}
        />

        {/* Center Tip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] text-white/75 font-medium tracking-wide">
          拖动调整画面 · 双指缩放
        </div>
      </div>

      {/* Bottom Control Sheet */}
      <div className="bg-[#1A1A22] border-t border-[#2A2A35] p-4 sm:p-5 space-y-4 safe-bottom">
        {/* Ratio Selector */}
        <div className="space-y-2">
          <div className="text-xs text-neutral-400 font-medium tracking-wide">
            选择画幅比例
          </div>
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelectRatio={(r) => setSelectedRatio(r)}
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-1">
          <button
            onClick={handleNext}
            disabled={isProcessing}
            className="w-full h-12 rounded-2xl bg-[#7059E8] hover:bg-[#5E47E0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/50 active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isProcessing ? '正在处理裁切...' : '下一步：定制邮票'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
