import React, { useState } from 'react';
import { Download, X, Check, Share2, Layers } from 'lucide-react';
import { StampOptions, ExportSettings } from '../../types';
import { downloadStamp, postStampToXhsNote, isXhsMiniTool } from '../../utils/exportStamp';

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
    paperColor: '#FAF8F5',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
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

  const handlePostNote = async () => {
    try {
      setIsPosting(true);
      const res = await postStampToXhsNote(
        croppedImageUrl,
        options,
        settings
      );
      onToast(res.success ? 'success' : 'error', res.message);
      if (res.success) onClose();
    } catch (err) {
      console.error('Post note error', err);
      onToast('error', '发布笔记失败');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h3 className="font-bold text-base text-neutral-900 leading-tight">导出高清邮票</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">选择输出分辨率与背景模式</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* 1. Resolution Selection */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
              输出画质与分辨率
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { res: 1080 as const, label: '1080p 标准', desc: '快速分享' },
                { res: 2160 as const, label: '2160p 超清', desc: '小红书推荐' },
                { res: 3240 as const, label: '3240p 极清', desc: '打印海报' },
              ].map((item) => {
                const isSelected = settings.resolution === item.res;
                return (
                  <button
                    key={item.res}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, resolution: item.res }))}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#F4F1FD] border-2 border-[#7059E8] shadow-xs'
                        : 'bg-[#F8F7F4] border-neutral-200/80 hover:bg-[#F0EEEA]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#7059E8]' : 'text-neutral-900'}`}>
                        {item.label.split(' ')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7059E8]" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Background Mode Selection */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
              背景模式
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, transparent: true }))}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  settings.transparent
                    ? 'bg-[#F4F1FD] border-2 border-[#7059E8] shadow-xs'
                    : 'bg-[#F8F7F4] border-neutral-200/80 hover:bg-[#F0EEEA]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-transparency-grid border border-neutral-200 shrink-0" />
                <div>
                  <div className={`text-xs font-bold ${settings.transparent ? 'text-[#7059E8]' : 'text-neutral-900'}`}>
                    透明背景 (PNG)
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">齿孔真实镂空</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, transparent: false }))}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  !settings.transparent
                    ? 'bg-[#F4F1FD] border-2 border-[#7059E8] shadow-xs'
                    : 'bg-[#F8F7F4] border-neutral-200/80 hover:bg-[#F0EEEA]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-neutral-300 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${!settings.transparent ? 'text-[#7059E8]' : 'text-neutral-900'}`}>
                    衬纸背景 (Paper)
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">浅米色质感底</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Format Selection */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
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
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold uppercase border transition-all text-center ${
                      isSelected
                        ? 'bg-[#7059E8] text-white border-[#7059E8] shadow-xs'
                        : 'bg-[#F8F7F4] text-neutral-700 border-neutral-200/80 hover:bg-[#F0EEEA]'
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
        <div className="p-5 pt-3 pb-5 border-t border-neutral-100 bg-[#FAF8F5] space-y-2.5 safe-bottom">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting || isPosting}
            className="w-full h-12 rounded-2xl bg-[#7059E8] hover:bg-[#5E47E0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200 active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>{isExporting ? '正在导出中...' : isXhs ? '保存高清邮票到相册' : '下载高清邮票图片'}</span>
          </button>

          {isXhs && (
            <button
              type="button"
              onClick={handlePostNote}
              disabled={isPosting || isExporting}
              className="w-full h-11 rounded-xl bg-white border border-[#D8CFFB] hover:bg-[#F4F1FD] text-[#7059E8] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>{isPosting ? '准备发布中...' : '发布到小红书笔记'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
