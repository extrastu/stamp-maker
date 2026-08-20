import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, Camera, Settings, X } from "lucide-react";
import { SampleStamp } from "./SampleStamp";
import { OFFLINE_SAMPLES } from "../../utils/sampleImages";

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
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请上传有效的图片文件 (JPG / PNG / WEBP)");
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
    <div className='min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-6 px-4 sm:px-6 max-w-md mx-auto relative select-none'>
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

      {/* Top Header */}
      <div className='relative text-center pt-2 pb-6'>
        <button
          onClick={() => setShowAbout(true)}
          className='absolute right-0 top-3 text-neutral-600 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors'
          aria-label='设置'
        >
          <Settings className='w-5 h-5 stroke-[1.8]' />
        </button>

        <h1 className='text-2xl font-bold text-neutral-900 tracking-tight'>邮票制作</h1>
        <p className='text-xs text-neutral-500 mt-1'>把每一张照片，变成你的专属邮票</p>
      </div>

      {/* Main Action Cards */}
      <div className='space-y-3.5 mb-7'>
        {/* Upload Card */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className='w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F0F5FF] hover:bg-[#E8F0FE] border border-blue-100/60 transition-all text-left group shadow-xs active:scale-[0.99]'
        >
          <div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-xs group-hover:scale-105 transition-transform'>
            <ImageIcon className='w-6 h-6 stroke-[1.8]' />
          </div>
          <div>
            <div className='font-semibold text-neutral-900 text-base leading-tight'>上传图片</div>
            <div className='text-xs text-neutral-400 mt-0.5 font-normal'>从相册选择</div>
          </div>
        </button>

        {/* Camera Card */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className='w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F0F9F2] hover:bg-[#E6F4EA] border border-emerald-100/60 transition-all text-left group shadow-xs active:scale-[0.99]'
        >
          <div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-xs group-hover:scale-105 transition-transform'>
            <Camera className='w-6 h-6 stroke-[1.8]' />
          </div>
          <div>
            <div className='font-semibold text-neutral-900 text-base leading-tight'>拍照</div>
            <div className='text-xs text-neutral-400 mt-0.5 font-normal'>打开相机拍摄</div>
          </div>
        </button>
      </div>

      {/* Sample Gallery Section */}
      <div className='flex-1 mb-6'>
        <div className='text-xs text-neutral-400 mb-3 font-medium'>示例</div>
        <div className='grid grid-cols-3 gap-3'>
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
      <footer className="text-center text-[11px] text-neutral-400 pt-2 pb-6 safe-bottom">
        <span>Built by <span className="font-medium text-neutral-600">extrastu</span></span>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl relative border border-neutral-100 animate-in zoom-in-95 duration-200"
          >
            {/* Close Button X */}
            <button
              type="button"
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F4F1FD] text-[#7059E8] mx-auto flex items-center justify-center font-serif font-bold text-xl">
              💌
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900">邮票制作</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                把日常照片一键转换为真实齿孔邮票。<br />
                100% 浏览器纯本地处理，保障隐私安全。
              </p>
            </div>

            <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-100 font-mono">
              Version 1.0.0 · Built by extrastu
            </div>

            <button
              type="button"
              onClick={() => setShowAbout(false)}
              className="w-full py-3 bg-[#7059E8] hover:bg-[#5E47E0] text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98] shadow-md shadow-purple-200"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center'>
          <div className='bg-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3'>
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
            <span className='text-xs font-medium text-neutral-800'>正在载入图片...</span>
          </div>
        </div>
      )}
    </div>
  );
};
