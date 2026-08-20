import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { SampleStamp } from './SampleStamp';
import { OFFLINE_SAMPLES } from '../../utils/sampleImages';

interface StartViewProps {
  onImageSelected: (file: File, url: string) => void;
}

export const StartView: React.FC<StartViewProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Global Paste Listener (Ctrl/Cmd + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传有效的图片文件 (JPG / PNG / WEBP)');
      return;
    }
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSampleClick = (sampleUrl: string, sampleTitle: string) => {
    try {
      setIsProcessing(true);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 600;
        canvas.height = img.height || 800;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `${sampleTitle.toLowerCase().replace(/\s+/g, '-')}.png`, {
                type: 'image/png',
              });
              onImageSelected(file, sampleUrl);
            }
            setIsProcessing(false);
          }, 'image/png');
        } else {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
      };
      img.src = sampleUrl;
    } catch (err) {
      console.error('Failed to load sample image', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 overflow-hidden">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />
      {/* Camera Capture Input */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full my-auto flex flex-col items-center text-center">
        {/* Subtle Decorative Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper-200 text-ink text-xs font-medium mb-6 tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Japanese Editorial · 数字手账与小红书配图</span>
        </div>

        {/* Editorial Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink mb-4 leading-tight">
          Turn your memories <br className="hidden sm:inline" />
          <span className="italic font-normal">into tiny stamps.</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted max-w-lg mb-8 font-serif leading-relaxed">
          把一张日常随拍，变成充满温度的专属齿孔邮票。
        </p>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-xl p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer bg-white/70 backdrop-blur-sm shadow-paper hover:shadow-stamp group ${
            isDragging
              ? 'border-ink bg-paper-200/90 scale-[1.01]'
              : 'border-paper-300 hover:border-ink/60 hover:bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-paper-100 flex items-center justify-center text-ink group-hover:scale-110 transition-transform shadow-inner">
              <Upload className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="font-medium text-ink text-base mb-1">
                点击选择图片 / 拖拽图片至此处
              </div>
              <div className="text-xs text-ink-muted flex items-center justify-center gap-2">
                <span>支持 JPG, PNG, WEBP</span>
                <span>·</span>
                <span className="hidden sm:inline">支持 Ctrl / Cmd + V 粘贴</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Upload & Camera */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-md">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink text-paper-50 font-medium text-sm hover:bg-ink-dark transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <ImageIcon className="w-4 h-4" />
            <span>上传图片</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-paper-200 text-ink border border-paper-300/80 font-medium text-sm hover:bg-paper-300/80 transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>现场拍照</span>
          </button>
        </div>

        {/* Privacy Promise Banner */}
        <div className="mt-8 flex items-center gap-2 text-xs text-ink-muted/90 bg-paper-200/50 px-4 py-2 rounded-full border border-paper-300/40">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>图片仅在你的浏览器中纯本地处理，绝不上传任何服务器</span>
        </div>

        {/* Sample Stamps Carousel / Scrapbook Display */}
        <div className="mt-14 w-full">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="font-serif text-sm font-semibold text-ink">没有素材？点击立即体验示例：</span>
            <span className="text-xs text-ink-muted">1 秒生成</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {OFFLINE_SAMPLES.map((sample) => (
              <SampleStamp
                key={sample.id}
                title={sample.title}
                price={sample.price}
                imageUrl={sample.url}
                rotation={sample.rotation}
                onClick={() => handleSampleClick(sample.url, sample.title)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="mt-12 text-center text-xs text-ink-muted pt-6 border-t border-paper-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto w-full">
        <span>Stamp Maker · 纯客户端轻量邮票生成器</span>
        <span className="font-serif italic text-ink-muted">Designed with Japanese Editorial Aesthetics</span>
      </footer>

      {isProcessing && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-stamp-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-ink">正在准备示例图片...</span>
          </div>
        </div>
      )}
    </div>
  );
};
