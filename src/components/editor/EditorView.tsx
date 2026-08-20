import React, { useState } from 'react';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { StampOptions } from '../../types';
import { StampPreview } from './StampPreview';
import { StampStylePicker } from './StampStylePicker';
import { BackgroundPicker } from './BackgroundPicker';
import { MarginSlider } from './MarginSlider';
import { ExportModal } from '../export/ExportModal';
import { copyStampToClipboard } from '../../utils/exportStamp';
import { DEFAULT_EXPORT_SETTINGS } from '../../utils/constants';

interface EditorViewProps {
  croppedImageUrl: string;
  options: StampOptions;
  onOptionsChange: (options: StampOptions) => void;
  onBackToCrop: () => void;
  originalFileName?: string;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  croppedImageUrl,
  options,
  onOptionsChange,
  onBackToCrop,
  originalFileName,
  onToast,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQuickCopying, setIsQuickCopying] = useState(false);

  const handleUpdateOptions = (partial: Partial<StampOptions>) => {
    onOptionsChange({
      ...options,
      ...partial,
    });
  };

  const handleQuickCopy = async () => {
    try {
      setIsQuickCopying(true);
      const res = await copyStampToClipboard(
        croppedImageUrl,
        options,
        DEFAULT_EXPORT_SETTINGS
      );
      onToast(res.success ? 'success' : 'error', res.message);
    } catch (err) {
      console.error('Quick copy error', err);
      onToast('error', '复制失败，请尝试保存导出');
    } finally {
      setIsQuickCopying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-paper-200">
        <button
          onClick={onBackToCrop}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg hover:bg-paper-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>重新构图</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm sm:text-base text-ink">邮票定制</span>
        </div>

        {/* Top Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickCopy}
            disabled={isQuickCopying}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-paper-200 text-ink hover:bg-paper-300 px-3.5 py-2 rounded-xl transition-all border border-paper-300/60"
            title="一键复制透明 PNG 邮票到剪贴板"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isQuickCopying ? '复制中...' : '复制'}</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-ink text-paper-50 px-4 py-2 rounded-xl hover:bg-ink-dark transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>保存 / 导出</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Desktop Left-Right, Mobile Top-Bottom */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left / Bottom Controls Sidebar (Desktop: 5 cols, Mobile: scrollable bottom) */}
        <div className="lg:col-span-5 order-2 lg:order-1 overflow-y-auto pr-0 lg:pr-2 space-y-6 pb-20 lg:pb-6">
          <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-paper-200 shadow-paper space-y-6">
            {/* 1. Stamp Perforation Style Preset & Sliders */}
            <StampStylePicker
              options={options}
              onChange={handleUpdateOptions}
            />

            <hr className="border-paper-200/80" />

            {/* 2. Margin & Corner Radius */}
            <MarginSlider
              margin={options.margin}
              photoRadius={options.photoRadius}
              onMarginChange={(margin) => handleUpdateOptions({ margin })}
              onPhotoRadiusChange={(photoRadius) => handleUpdateOptions({ photoRadius })}
            />

            <hr className="border-paper-200/80" />

            {/* 3. Paper Background Color */}
            <BackgroundPicker
              selectedColor={options.backgroundColor}
              onChange={(backgroundColor) => handleUpdateOptions({ backgroundColor })}
            />
          </div>

          {/* Quick tips */}
          <div className="p-3.5 bg-paper-200/50 rounded-xl border border-paper-300/40 text-[11px] text-ink-muted leading-relaxed">
            💡 <strong>小贴士：</strong> 导出透明 PNG 后，可无缝拖拽至 Photoshop、Canva 或小红书图片编辑中作为手账贴纸使用。
          </div>
        </div>

        {/* Right Preview Viewport (Desktop: 7 cols, Mobile: Sticky top preview) */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col h-full bg-white/40 rounded-2xl p-2 sm:p-4 border border-paper-200/70 shadow-paper overflow-hidden">
          <StampPreview
            croppedImageUrl={croppedImageUrl}
            options={options}
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-paper-100/95 backdrop-blur-md border-t border-paper-200 flex items-center gap-2.5 z-20">
        <button
          onClick={handleQuickCopy}
          disabled={isQuickCopying}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-paper-200 text-ink text-xs font-medium border border-paper-300"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{isQuickCopying ? '复制中...' : '复制透明图'}</span>
        </button>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-ink text-paper-50 text-xs font-medium shadow-sm active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>保存图片</span>
        </button>
      </div>

      {/* Export Modal Dialog */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        croppedImageUrl={croppedImageUrl}
        options={options}
        originalFileName={originalFileName}
        onToast={onToast}
      />
    </div>
  );
};
