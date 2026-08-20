import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, Camera, X, ArrowRight, Sparkles } from "lucide-react";
import { SampleStamp } from "./SampleStamp";
import { OFFLINE_SAMPLES } from "../../utils/sampleImages";
import logoImg from "../../assets/logo.png";

interface StartViewProps {
  onImageSelected: (file: File, url: string) => void;
}

export const StartView: React.FC<StartViewProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Global Paste Listener (Ctrl/Cmd + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            onImageSelected(file, url);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    }
  };

  const handleSampleClick = (sampleUrl: string, sampleTitle: string) => {
    try {
      setIsProcessing(true);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width || 600;
        canvas.height = img.height || 800;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `${sampleTitle.toLowerCase().replace(/\s+/g, "-")}.png`, {
                type: "image/png",
              });
              onImageSelected(file, sampleUrl);
            }
            setIsProcessing(false);
          }, "image/png");
        } else {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
      };
      img.src = sampleUrl;
    } catch (err) {
      console.error("Failed to load sample image", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className='min-h-screen bg-paper flex flex-col justify-between py-5 px-4 sm:px-6 max-w-md mx-auto relative select-none safe-top'>
      {/* Hidden File Inputs */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/png,image/jpeg,image/jpg,image/webp'
        className='hidden'
      />
      <input
        type='file'
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept='image/*'
        capture='environment'
        className='hidden'
      />

      {/* Top Hero Section (Codex-Resets Sticker Neo-Brutalism) */}
      <div className='relative flex flex-col items-center justify-center pt-2 pb-5 text-center'>
        {/* Kicker Chip Badge */}
        {/*<div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sun border-2 border-ink shadow-neo-sm text-[11px] font-mono font-bold text-ink mb-3 rotate-[-1deg]'>
          <Sparkles className='size-3 text-accent' />
          <span>VINTAGE STAMP STUDIO</span>
          <span className='bg-ink text-white text-[9px] px-1.5 py-0.2 rounded-full'>v1.0.1</span>
        </div>*/}

        {/* Logo Sticker with physical tilt */}
        <div className='w-16 h-16 mb-2.5 rounded-2xl overflow-hidden shadow-neo border-2 border-ink bg-card p-1 rotate-[1.5deg] hover:rotate-0 transition-transform duration-200'>
          <img src={logoImg} alt='Stamp Maker Logo' className='w-full h-full object-cover rounded-xl' />
        </div>

        <h1 className='text-[26px] font-extrabold text-ink tracking-tight leading-tight'>Stamp Maker</h1>
        <p className='text-xs font-semibold text-ink-2 mt-1'>把日常照片，变成复古物理齿孔小邮票 💌</p>
      </div>

      {/* Main Action Cards (Neo-Brutalist Sticker Cards) */}
      <div className='space-y-3 mb-6'>
        {/* Upload Card (Sunny Yellow Accent) */}
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='w-full flex items-center justify-between p-4 rounded-2xl bg-card border-2 border-ink shadow-neo btn-neo group text-left hover:bg-sun-tint transition-all'
        >
          <div className='flex items-center gap-3.5'>
            <div className='w-12 h-12 rounded-xl bg-sun border-2 border-ink shadow-neo-sm flex items-center justify-center text-ink group-hover:scale-105 transition-transform'>
              <ImageIcon className='w-6 h-6 stroke-[2.2]' />
            </div>
            <div>
              <div className='font-extrabold text-ink text-base leading-tight'>从相册上传</div>
              <div className='text-xs font-medium text-ink-2 mt-0.5'>选取手机里的相片</div>
            </div>
          </div>
          <div className='w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center shadow-neo-sm group-hover:translate-x-0.5 transition-transform'>
            <ArrowRight className='size-4 stroke-[2.5]' />
          </div>
        </button>

        {/* Camera Card (Mint Accent) */}
        <button
          type='button'
          onClick={() => cameraInputRef.current?.click()}
          className='w-full flex items-center justify-between p-4 rounded-2xl bg-card border-2 border-ink shadow-neo btn-neo group text-left hover:bg-mint-tint transition-all'
        >
          <div className='flex items-center gap-3.5'>
            <div className='w-12 h-12 rounded-xl bg-mint border-2 border-ink shadow-neo-sm flex items-center justify-center text-ink group-hover:scale-105 transition-transform'>
              <Camera className='w-6 h-6 stroke-[2.2]' />
            </div>
            <div>
              <div className='font-extrabold text-ink text-base leading-tight'>即时拍摄</div>
              <div className='text-xs font-medium text-ink-2 mt-0.5'>打开相机现场抓拍</div>
            </div>
          </div>
          <div className='w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center shadow-neo-sm group-hover:translate-x-0.5 transition-transform'>
            <ArrowRight className='size-4 stroke-[2.5]' />
          </div>
        </button>
      </div>

      {/* Sample Gallery Section */}
      <div className='flex-1 mb-5'>
        <div className='flex items-center justify-between mb-3 px-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>🎨</span>
            <h2 className='text-xs font-extrabold text-ink uppercase tracking-wider'>灵感样张</h2>
          </div>
          <span className='font-mono text-[10px] font-bold text-ink-2 bg-sand px-2 py-0.5 rounded-md border border-ink/30'>
            6 SAMPLES
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2.5'>
          {OFFLINE_SAMPLES.map((sample) => (
            <SampleStamp
              key={sample.id}
              title={sample.title}
              imageUrl={sample.url}
              onClick={() => handleSampleClick(sample.url, sample.title)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className='text-center text-[11px] text-ink-2 pt-1 pb-5 safe-bottom font-mono'>
        <button
          type='button'
          onClick={() => setShowAbout(true)}
          className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border-2 border-ink shadow-neo-sm btn-neo font-bold text-ink hover:bg-sun transition-colors'
        >
          <span>Crafted by</span>
          <span className='text-accent underline decoration-2'>extrastu</span>
          <span>· 关于</span>
        </button>
      </footer>

      {/* About Modal (Neo-Brutalism Sticker Dialog) */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          className='fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='bg-paper rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-neo-xl relative border-2 border-ink animate-in zoom-in-95 duration-150'
          >
            {/* Close Button X */}
            <button
              type='button'
              onClick={() => setShowAbout(false)}
              className='absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-card border-2 border-ink shadow-neo-sm btn-neo flex items-center justify-center text-ink hover:bg-rose transition-colors'
              aria-label='关闭'
            >
              <X className='w-4 h-4 stroke-[2.5]' />
            </button>

            <div className='w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-neo border-2 border-ink bg-card p-1 rotate-[2deg]'>
              <img src={logoImg} alt='Stamp Maker Logo' className='w-full h-full object-cover rounded-xl' />
            </div>

            <div>
              <h3 className='text-lg font-extrabold text-ink'>Stamp Maker</h3>
              <p className='text-xs font-semibold text-ink-2 mt-1.5 leading-relaxed'>
                把日常照片一键转换为真实齿孔邮票。
                <br />
                100% 本地纯离线渲染，安全保密。
              </p>
            </div>

            <div className='text-[10px] text-ink-3 pt-1 border-t-2 border-dashed border-ink/30 font-mono font-bold'>
              v1.0.1 · Built for Xiaohongshu
            </div>

            <button
              type='button'
              onClick={() => setShowAbout(false)}
              className='w-full py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-extrabold border-2 border-ink shadow-neo btn-neo transition-all'
            >
              我知道了 🙏
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className='fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-center justify-center'>
          <div className='bg-card px-5 py-3.5 rounded-2xl shadow-neo border-2 border-ink flex items-center gap-3'>
            <div className='w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin' />
            <span className='text-xs font-bold text-ink'>正在载入图片...</span>
          </div>
        </div>
      )}
    </div>
  );
};
