import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, Camera, X, ArrowRight, Copy, Check, ExternalLink } from "lucide-react";
import { SampleStamp } from "./SampleStamp";
import { ChangelogModal } from "../common/ChangelogModal";
import { OFFLINE_SAMPLES } from "../../utils/sampleImages";
import { isXhsMiniTool } from "../../utils/exportStamp";
import logoImg from "../../assets/logo.png";

interface StartViewProps {
  onImagesSelected: (items: { file: File; url: string }[]) => void;
  onToast?: (type: "success" | "error", message: string) => void;
}

export const StartView: React.FC<StartViewProps> = ({ onImagesSelected, onToast }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const isXhs = isXhsMiniTool();

  // Global Paste Listener (Ctrl/Cmd + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const collected: { file: File; url: string }[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            collected.push({ file, url });
          }
        }
      }
      if (collected.length > 0) {
        onImagesSelected(collected);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImagesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const items: { file: File; url: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        items.push({ file, url });
      }
      onImagesSelected(items);
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
              onImagesSelected([{ file, url: sampleUrl }]);
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

  const handleCopyLink = async (key: string, url: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedKey(key);
      if (onToast) {
        onToast("success", `已复制 ${label} 链接，可前往浏览器粘贴打开 📋`);
      }
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Copy link failed", err);
      if (onToast) {
        onToast("error", "复制失败，请重试");
      }
    }
  };

  return (
    <div className='min-h-screen bg-paper flex flex-col justify-between py-4 px-4 sm:px-6 max-w-md mx-auto relative select-none safe-top'>
      {/* Hidden File Inputs (multiple support) */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/png,image/jpeg,image/jpg,image/webp'
        multiple
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

      {/* Top Hero Section */}
      <div className='relative flex flex-col items-center justify-center pt-1 pb-4 text-center'>
        <div className='w-16 h-16 mb-2 rounded-2xl overflow-hidden shadow-neo border-2 border-ink bg-card p-1 rotate-[1.5deg] hover:rotate-0 transition-transform duration-200'>
          <img src={logoImg} alt='Stamp Maker Logo' className='w-full h-full object-cover rounded-xl' />
        </div>

        <h1 className='text-[24px] font-extrabold text-ink tracking-tight leading-tight'>Stamp Maker</h1>
        <p className='text-xs font-semibold text-ink-2 mt-1'>把日常照片，变成复古物理齿孔小邮票 💌</p>
      </div>

      {/* Main Action Cards */}
      <div className='space-y-2.5 mb-4'>
        {/* Upload Card (Supports Multiple Photos) */}
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='w-full flex items-center justify-between p-3.5 rounded-2xl bg-card border-2 border-ink shadow-neo btn-neo group text-left hover:bg-sun-tint transition-all'
        >
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-sun border-2 border-ink shadow-neo-sm flex items-center justify-center text-ink group-hover:scale-105 transition-transform'>
              <ImageIcon className='w-5 h-5 stroke-[2.2]' />
            </div>
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='font-extrabold text-ink text-sm leading-tight'>从相册上传</span>
                <span className='font-mono text-[9.5px] font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded border border-accent/30'>
                  支持多选
                </span>
              </div>
              <div className='text-[11px] font-medium text-ink-2 mt-0.5'>支持批量选择多张照片</div>
            </div>
          </div>
          <div className='w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center shadow-neo-sm group-hover:translate-x-0.5 transition-transform'>
            <ArrowRight className='size-3.5 stroke-[2.5]' />
          </div>
        </button>

        {/* Camera Card */}
        <button
          type='button'
          onClick={() => cameraInputRef.current?.click()}
          className='w-full flex items-center justify-between p-3.5 rounded-2xl bg-card border-2 border-ink shadow-neo btn-neo group text-left hover:bg-mint-tint transition-all'
        >
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-mint border-2 border-ink shadow-neo-sm flex items-center justify-center text-ink group-hover:scale-105 transition-transform'>
              <Camera className='w-5 h-5 stroke-[2.2]' />
            </div>
            <div>
              <div className='font-extrabold text-ink text-sm leading-tight'>即时拍摄</div>
              <div className='text-[11px] font-medium text-ink-2 mt-0.5'>打开相机现场抓拍</div>
            </div>
          </div>
          <div className='w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center shadow-neo-sm group-hover:translate-x-0.5 transition-transform'>
            <ArrowRight className='size-3.5 stroke-[2.5]' />
          </div>
        </button>
      </div>

      {/* Sample Gallery Section */}
      <div className='flex-1 mb-3'>
        <div className='flex items-center justify-between mb-2 px-1'>
          <div className='flex items-center gap-1.5'>
            <span className='text-xs'>🎨</span>
            <h2 className='text-xs font-extrabold text-ink uppercase tracking-wider'>灵感样张</h2>
          </div>
          <span className='font-mono text-[10px] font-bold text-ink-2 bg-sand px-2 py-0.5 rounded-md border border-ink/30'>
            6 SAMPLES
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2'>
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
      <footer className='flex items-center justify-center gap-2 text-center text-[11px] text-ink-2 pt-1 pb-3 safe-bottom font-mono'>
        <button
          type='button'
          onClick={() => setShowChangelog(true)}
          className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border-2 border-ink shadow-neo-sm btn-neo font-bold text-ink hover:bg-sun transition-colors'
        >
          <span>📜</span>
          <span>更新日志</span>
          <span className='font-mono text-[9px] bg-accent text-white px-1.5 py-0.2 rounded-full font-black'>v1.0.4</span>
        </button>

        <button
          type='button'
          onClick={() => setShowAbout(true)}
          className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border-2 border-ink shadow-neo-sm btn-neo font-bold text-ink hover:bg-sun transition-colors'
        >
          <span>关于</span>
        </button>
      </footer>

      {/* About Modal (Adaptive: Copy in XHS, Direct Link in Web) */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          className='fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='bg-paper rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-neo-xl relative border-2 border-ink animate-in zoom-in-95 duration-150'
          >
            {/* Close Button X */}
            <button
              type='button'
              onClick={() => setShowAbout(false)}
              className='absolute top-3 right-3 w-7 h-7 rounded-full bg-card border-2 border-ink shadow-neo-sm btn-neo flex items-center justify-center text-ink hover:bg-rose transition-colors'
              aria-label='关闭'
            >
              <X className='size-3.5 stroke-[2.5]' />
            </button>

            <div className='w-14 h-14 rounded-2xl overflow-hidden mx-auto shadow-neo border-2 border-ink bg-card p-1 rotate-[2deg]'>
              <img src={logoImg} alt='Stamp Maker Logo' className='w-full h-full object-cover rounded-xl' />
            </div>

            <div>
              <h3 className='text-base font-extrabold text-ink'>Stamp Maker</h3>
              <p className='text-xs font-semibold text-ink-2 mt-1 leading-relaxed'>
                把日常照片一键转换为真实齿孔邮票。
                <br />
                100% 本地纯离线渲染，安全保密。
              </p>
            </div>

            {/* Links Section in About Modal */}
            <div className='space-y-1.5 text-left pt-1 border-t-2 border-dashed border-ink/20'>
              <div className='text-[10px] font-bold text-ink-3 px-0.5'>{isXhs ? "点击复制链接：" : "相关链接："}</div>

              {/* 1. Web Version */}
              {isXhs ? (
                <button
                  type='button'
                  onClick={() => handleCopyLink("web", "https://stampmakers.pages.dev/", "网页版")}
                  className='w-full flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-sun transition-all text-left'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>🌐</span>
                    <span>在线网页版</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-[9.5px] text-ink-2'>stampmakers.pages.dev</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono flex items-center gap-0.5 border border-ink/40 ${copiedKey === "web" ? "bg-mint text-ink font-bold" : "bg-sand text-ink-2"}`}
                    >
                      {copiedKey === "web" ? (
                        <>
                          <Check className='size-2.5' /> 已复制
                        </>
                      ) : (
                        <>
                          <Copy className='size-2.5' /> 复制
                        </>
                      )}
                    </span>
                  </div>
                </button>
              ) : (
                <a
                  href='https://stampmakers.pages.dev/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-sun transition-all no-underline'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>🌐</span>
                    <span>在线网页版</span>
                  </div>
                  <span className='font-mono text-[10px] text-ink-2 font-semibold flex items-center gap-0.5'>
                    stampmakers.pages.dev <ExternalLink className='size-2.5' />
                  </span>
                </a>
              )}

              {/* 2. GitHub Repo */}
              {isXhs ? (
                <button
                  type='button'
                  onClick={() => handleCopyLink("github", "https://github.com/extrastu/stamp-maker", "GitHub 源码")}
                  className='w-full flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-sky transition-all text-left'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>🐙</span>
                    <span>开源 GitHub</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-[9.5px] text-ink-2'>extrastu/stamp-maker</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono flex items-center gap-0.5 border border-ink/40 ${copiedKey === "github" ? "bg-mint text-ink font-bold" : "bg-sand text-ink-2"}`}
                    >
                      {copiedKey === "github" ? (
                        <>
                          <Check className='size-2.5' /> 已复制
                        </>
                      ) : (
                        <>
                          <Copy className='size-2.5' /> 复制
                        </>
                      )}
                    </span>
                  </div>
                </button>
              ) : (
                <a
                  href='https://github.com/extrastu/stamp-maker'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-sky transition-all no-underline'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>🐙</span>
                    <span>开源 GitHub</span>
                  </div>
                  <span className='font-mono text-[10px] text-ink-2 font-semibold flex items-center gap-0.5'>
                    extrastu/stamp-maker <ExternalLink className='size-2.5' />
                  </span>
                </a>
              )}

              {/* 3. Redbook Profile */}
              {isXhs ? (
                <button
                  type='button'
                  onClick={() => handleCopyLink("xhs", "https://xhslink.cn/m/lTR6WMDnhB", "作者小红书")}
                  className='w-full flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-rose transition-all text-left'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>📕</span>
                    <span>关注作者小红书</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-[9.5px] text-accent font-bold'>@extrastu</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono flex items-center gap-0.5 border border-ink/40 ${copiedKey === "xhs" ? "bg-mint text-ink font-bold" : "bg-rose text-ink font-bold"}`}
                    >
                      {copiedKey === "xhs" ? (
                        <>
                          <Check className='size-2.5' /> 已复制
                        </>
                      ) : (
                        <>
                          <Copy className='size-2.5' /> 复制
                        </>
                      )}
                    </span>
                  </div>
                </button>
              ) : (
                <a
                  href='https://xhslink.cn/m/lTR6WMDnhB'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-between p-2 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo text-xs font-bold text-ink hover:bg-rose transition-all no-underline'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>📕</span>
                    <span>关注作者小红书</span>
                  </div>
                  <span className='font-mono text-[10px] text-accent font-bold flex items-center gap-0.5'>
                    关注 <ExternalLink className='size-2.5' />
                  </span>
                </a>
              )}
            </div>

            <div className='flex items-center justify-between pt-1 border-t-2 border-dashed border-ink/20'>
              <button
                type='button'
                onClick={() => {
                  setShowAbout(false);
                  setShowChangelog(true);
                }}
                className='text-[11px] font-bold text-accent hover:underline flex items-center gap-1'
              >
                <span>📜 查看版本更新日志</span>
              </button>
              <span className='text-[10px] text-ink-3 font-mono font-bold'>v1.0.4</span>
            </div>

            <button
              type='button'
              onClick={() => setShowAbout(false)}
              className='w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-extrabold border-2 border-ink shadow-neo btn-neo transition-all'
            >
              我知道了 🙏
            </button>
          </div>
        </div>
      )}

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />

      {isProcessing && (
        <div className='fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-center justify-center'>
          <div className='bg-card px-5 py-3 rounded-2xl shadow-neo border-2 border-ink flex items-center gap-3'>
            <div className='w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin' />
            <span className='text-xs font-bold text-ink'>正在载入图片...</span>
          </div>
        </div>
      )}
    </div>
  );
};
