import React, { useState } from 'react';
import { Download, X, Check, Layers } from 'lucide-react';
import { StampOptions, ExportSettings } from '../../types';
import { downloadStamp, isXhsMiniTool } from '../../utils/exportStamp';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  croppedImageUrl: string;
  options: StampOptions;
  originalFileName?: string;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  croppedImageUrl,
  options,
  originalFileName,
  onToast,
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'png',
    resolution: 2160,
    transparent: true,
    paperColor: '#FFF4DD',
  });

  const [isExporting, setIsExporting] = useState(false);
  const isXhs = isXhsMiniTool();

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const res = await downloadStamp(
        croppedImageUrl,
        options,
        settings,
        originalFileName
      );
      onToast(res.success ? 'success' : 'error', res.message);
      if (res.success) onClose();
    } catch (err) {
      console.error('Download error', err);
      onToast('error', '导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-neo-xl border-2 border-ink overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b-2 border-ink flex items-center justify-between bg-card">
          <div>
            <h3 className="font-extrabold text-[15px] text-ink leading-tight">导出高级参数</h3>
            <p className="text-[11px] text-ink-2 mt-0.5 font-medium">按需定制输出精度与底衬</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-paper border-2 border-ink shadow-neo-sm btn-neo text-ink hover:bg-rose transition-colors"
            aria-label="关闭"
          >
            <X className="size-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* 1. Resolution Selection */}
          <div>
            <label className="block text-xs font-extrabold text-ink mb-2 px-0.5">
              输出精度
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { res: 1080 as const, label: '1080p', desc: '社交快传' },
                { res: 2160 as const, label: '2160p', desc: '超清推荐' },
                { res: 3240 as const, label: '3240p', desc: '手账打印' },
              ].map((item) => {
                const isSelected = settings.resolution === item.res;
                return (
                  <button
                    key={item.res}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, resolution: item.res }))}
                    className={`p-3 rounded-2xl text-left border-2 border-ink btn-neo transition-all relative ${
                      isSelected
                        ? 'bg-sun text-ink shadow-neo'
                        : 'bg-card text-ink shadow-none hover:bg-sand opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold">
                        {item.label}
                      </span>
                      {isSelected && <Check className="size-3.5 text-ink stroke-[3]" />}
                    </div>
                    <div className="text-[10px] text-ink-2 font-medium mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Background Mode Selection */}
          <div>
            <label className="block text-xs font-extrabold text-ink mb-2 px-0.5">
              底衬模式
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, transparent: true }))}
                className={`p-3 rounded-2xl border-2 border-ink btn-neo flex items-center gap-2.5 text-left transition-all ${
                  settings.transparent
                    ? 'bg-sun text-ink shadow-neo'
                    : 'bg-card text-ink shadow-none hover:bg-sand opacity-90'
                }`}
              >
                <div className="size-8 rounded-xl bg-transparency-grid border-2 border-ink shrink-0" />
                <div>
                  <div className="text-xs font-extrabold">
                    透明镂空 (PNG)
                  </div>
                  <div className="text-[10px] text-ink-2 font-medium mt-0.5">真实齿孔边缘</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, transparent: false }))}
                className={`p-3 rounded-2xl border-2 border-ink btn-neo flex items-center gap-2.5 text-left transition-all ${
                  !settings.transparent
                    ? 'bg-sun text-ink shadow-neo'
                    : 'bg-card text-ink shadow-none hover:bg-sand opacity-90'
                }`}
              >
                <div className="size-8 rounded-xl bg-paper border-2 border-ink flex items-center justify-center shrink-0">
                  <Layers className="size-4 text-ink stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">
                    浅米衬纸 (Paper)
                  </div>
                  <div className="text-[10px] text-ink-2 font-medium mt-0.5">自带纸张底色</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Format Selection */}
          <div>
            <label className="block text-xs font-extrabold text-ink mb-2 px-0.5">
              文件格式
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((fmt) => {
                const isSelected = settings.format === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, format: fmt }))}
                    className={`h-8 rounded-xl text-xs font-mono font-bold uppercase border-2 border-ink btn-neo transition-all text-center select-none ${
                      isSelected
                        ? 'bg-accent text-white shadow-neo'
                        : 'bg-card text-ink hover:bg-sand'
                    }`}
                  >
                    .{fmt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 pt-3 pb-5 border-t-2 border-ink bg-card safe-bottom">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full h-11 rounded-2xl bg-accent hover:bg-accent-hover text-white font-extrabold text-sm flex items-center justify-center gap-2 border-2 border-ink shadow-neo-lg btn-neo transition-all disabled:opacity-50"
          >
            <Download className="size-4 stroke-[2.5]" />
            <span>{isExporting ? '导出中...' : isXhs ? '保存高清邮票到相册 📬' : '下载高清邮票图片 📬'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
