import React, { useState } from 'react';
import { Download, Copy, X, Check, Share2 } from 'lucide-react';
import { StampOptions, ExportSettings } from '../../types';
import { downloadStamp, copyStampToClipboard, postStampToXhsNote, isXhsMiniTool } from '../../utils/exportStamp';

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
    paperColor: '#F5F1E8',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
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

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      const res = await copyStampToClipboard(
        croppedImageUrl,
        options,
        settings
      );
      onToast(res.success ? 'success' : 'error', res.message);
      if (res.success) {
        onClose();
      }
    } catch (err) {
      console.error('Copy error', err);
      onToast('error', '复制失败');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-stamp-lg border border-paper-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-paper-200 flex items-center justify-between bg-paper-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink text-paper-50 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-ink">导出高清邮票</h3>
              <p className="text-[11px] text-ink-muted leading-none">Export High-Resolution Stamp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink rounded-lg hover:bg-paper-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Resolution Choice */}
          <div>
            <label className="block text-xs font-serif font-semibold text-ink mb-2">
              输出分辨率 (Resolution)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { res: 1080 as const, label: '标准 1080p', desc: '社交快速分享' },
                { res: 2160 as const, label: '超清 2160p', desc: '小红书高清推荐' },
                { res: 3240 as const, label: '极清 3240p', desc: '手账打印/海报' },
              ].map((item) => {
                const isSelected = settings.resolution === item.res;
                return (
                  <button
                    key={item.res}
                    onClick={() => setSettings((s) => ({ ...s, resolution: item.res }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-ink bg-paper-100 ring-1 ring-ink'
                        : 'border-paper-300 hover:border-ink/50 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-ink flex items-center justify-between">
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-ink" />}
                    </div>
                    <div className="text-[10px] text-ink-muted mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Choice: Transparent vs Paper */}
          <div>
            <label className="block text-xs font-serif font-semibold text-ink mb-2">
              背景模式 (Background)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSettings((s) => ({ ...s, transparent: true }))}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  settings.transparent
                    ? 'border-ink bg-paper-100 ring-1 ring-ink'
                    : 'border-paper-300 hover:border-ink/50 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-transparency-grid border border-paper-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-ink">透明背景 (PNG)</div>
                  <div className="text-[10px] text-ink-muted">齿孔镂空，方便手账拼贴</div>
                </div>
              </button>

              <button
                onClick={() => setSettings((s) => ({ ...s, transparent: false }))}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  !settings.transparent
                    ? 'border-ink bg-paper-100 ring-1 ring-ink'
                    : 'border-paper-300 hover:border-ink/50 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-paper-100 paper-texture border border-paper-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-ink">衬纸背景 (Paper)</div>
                  <div className="text-[10px] text-ink-muted">包含浅米色质感衬底</div>
                </div>
              </button>
            </div>
          </div>

          {/* Format Choice */}
          <div>
            <label className="block text-xs font-serif font-semibold text-ink mb-2">
              文件格式 (Format)
            </label>
            <div className="flex items-center gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((fmt) => {
                const isSelected = settings.format === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => setSettings((s) => ({ ...s, format: fmt }))}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-medium uppercase border transition-all ${
                      isSelected
                        ? 'bg-ink text-paper-50 border-ink'
                        : 'bg-white text-ink border-paper-300 hover:border-ink/40'
                    }`}
                  >
                    .{fmt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-paper-200 bg-paper-50 flex flex-col sm:flex-row items-center gap-3">
          {isXhs ? (
            <button
              onClick={handlePostNote}
              disabled={isPosting || isExporting}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm transition-all shadow-sm disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>{isPosting ? '准备发布中...' : '发布到小红书笔记'}</span>
            </button>
          ) : (
            <button
              onClick={handleCopy}
              disabled={isCopying || isExporting}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-paper-200 text-ink hover:bg-paper-300/80 font-medium text-xs sm:text-sm transition-all border border-paper-300/60 disabled:opacity-50"
            >
              <Copy className="w-4 h-4" />
              <span>{isCopying ? '复制中...' : '复制透明图'}</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={isExporting || isCopying || isPosting}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ink text-paper-50 hover:bg-ink-dark font-medium text-xs sm:text-sm transition-all shadow-sm hover:shadow disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '处理中...' : isXhs ? '保存到系统相册' : '下载保存图片'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
