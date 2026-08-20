import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { ArrowLeft, ArrowRight, Crop } from 'lucide-react';
import { RatioSelector } from './RatioSelector';
import { ZoomSlider } from './ZoomSlider';
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

  const activeRatioObj = RATIOS.find((r) => r.id === selectedRatio) || RATIOS[0];

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-paper-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg hover:bg-paper-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-paper-200 text-ink flex items-center justify-center">
            <Crop className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif font-bold text-sm sm:text-base text-ink">裁切构图</span>
        </div>

        <button
          onClick={handleNext}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-ink text-paper-50 px-4 py-2 rounded-xl hover:bg-ink-dark transition-all shadow-sm hover:shadow disabled:opacity-50"
        >
          <span>{isProcessing ? '处理中...' : '下一步'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cropper Container */}
      <div className="relative flex-1 min-h-[300px] w-full bg-[#1A1918] rounded-2xl overflow-hidden shadow-stamp border border-paper-300/30">
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

        {/* Floating guidance overlay */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/90 font-medium">
          拖拽调整构图 · 双指缩放
        </div>
      </div>

      {/* Bottom Controls Panel */}
      <div className="mt-4 space-y-3 bg-white/60 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-paper-200 shadow-paper">
        {/* Ratio Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-serif font-semibold text-ink flex items-center gap-1.5">
            <span>邮票画幅比例</span>
            <span className="text-[10px] font-sans text-ink-muted font-normal">(推荐 3:4)</span>
          </div>
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelectRatio={(r) => setSelectedRatio(r)}
          />
        </div>

        {/* Zoom & Rotation */}
        <div className="pt-2 border-t border-paper-200/60">
          <ZoomSlider
            zoom={zoom}
            rotation={rotation}
            onZoomChange={setZoom}
            onRotateChange={setRotation}
          />
        </div>
      </div>
    </div>
  );
};
