import React, { useState } from 'react';
import { ArrowLeft, Download, Copy, SlidersHorizontal, Layers } from 'lucide-react';
import { StampOptions, StampStyleId, ImageItem } from '../../types';
import { StampPreview } from './StampPreview';
import { COLOR_PRESETS, DEFAULT_EXPORT_SETTINGS, STAMP_STYLES } from '../../utils/constants';
import { ExportModal } from '../export/ExportModal';
import { PostNoteModal } from '../export/PostNoteModal';
import { copyStampToClipboard, downloadStamp, downloadMultipleStamps, isXhsMiniTool } from '../../utils/exportStamp';

interface EditorViewProps {
  images: ImageItem[];
  options: StampOptions;
  onOptionsChange: (options: StampOptions) => void;
  onBackToCrop: () => void;
  originalFileName?: string;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  images,
  options,
  onOptionsChange,
  onBackToCrop,
  originalFileName,
  onToast,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPostNoteModalOpen, setIsPostNoteModalOpen] = useState(false);
  const [isQuickCopying, setIsQuickCopying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isXhs = isXhsMiniTool();

  const currentImage = images[activeIndex] || images[0];
  const activeImageUrl = currentImage?.croppedUrl || currentImage?.rawUrl || '';

  const handleSelectStyle = (styleId: StampStyleId) => {
    const preset = STAMP_STYLES.find((s) => s.id === styleId);
    if (preset) {
      onOptionsChange({
        ...options,
        style: styleId,
        holeRadius: preset.baseRadius,
        holeGap: preset.baseGap,
      });
    }
  };

  const handleMarginChange = (val: number) => {
    onOptionsChange({
      ...options,
      margin: Math.max(0, val),
    });
  };

  const handleSelectColor = (hex: string) => {
    onOptionsChange({
      ...options,
      backgroundColor: hex,
    });
  };

  const handleSaveAllOrCurrent = async () => {
    try {
      setIsSaving(true);
      if (images.length > 1) {
        const sources = images.map((img) => img.croppedUrl || img.rawUrl);
        const res = await downloadMultipleStamps(
          sources,
          options,
          DEFAULT_EXPORT_SETTINGS,
          originalFileName
        );
        onToast(res.success ? 'success' : 'error', res.message);
      } else {
        const res = await downloadStamp(
          activeImageUrl,
          options,
          DEFAULT_EXPORT_SETTINGS,
          originalFileName
        );
        onToast(res.success ? 'success' : 'error', res.message);
      }
    } catch (err) {
      console.error('Save error', err);
      onToast('error', '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      setIsQuickCopying(true);
      const res = await copyStampToClipboard(
        activeImageUrl,
        options,
        DEFAULT_EXPORT_SETTINGS
      );
      onToast(res.success ? 'success' : 'error', res.message);
    } catch (err) {
      console.error('Copy error', err);
      onToast('error', '复制失败');
    } finally {
      setIsQuickCopying(false);
    }
  };

  // Slider progress percentage (0px to 36px)
  const minMargin = 0;
  const maxMargin = 36;
  const sliderPercentage = Math.max(0, Math.min(100, ((options.margin - minMargin) / (maxMargin - minMargin)) * 100));

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-paper text-ink flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* 1. Top Navigation Row */}
      <div className="shrink-0 px-4 pt-1 pb-1 flex items-center justify-between z-10 safe-top">
        <button
          type="button"
          onClick={onBackToCrop}
          className="inline-flex h-7 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink transition-all"
        >
          <ArrowLeft className="size-3 stroke-[2.5]" />
          <span>重新构图</span>
        </button>

        {/* Center badge if multiple */}
        {images.length > 1 && (
          <div className="inline-flex items-center gap-1 bg-sun border-2 border-ink px-2.5 py-0.5 rounded-full shadow-neo-sm text-[11px] font-mono font-bold text-ink">
            <Layers className="size-3 stroke-[2.5]" />
            <span>共 {images.length} 张邮票</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex h-7 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink transition-all"
          title="导出参数"
        >
          <SlidersHorizontal className="size-3 stroke-[2.5]" />
          <span>导出参数</span>
        </button>
      </div>

      {/* 2. Main Stamp Live Preview Stage */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-3 py-1 overflow-hidden relative">
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <StampPreview
            croppedImageUrl={activeImageUrl}
            options={options}
          />
        </div>

        {/* Thumbnail Selector Strip if multiple images */}
        {images.length > 1 && (
          <div className="shrink-0 flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar py-1 px-2 bg-card/80 backdrop-blur-xs border-2 border-ink rounded-2xl shadow-neo-sm">
            {images.map((img, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`size-8 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                    isSelected
                      ? 'border-ink shadow-neo-sm ring-2 ring-sun scale-110'
                      : 'border-ink/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.croppedUrl || img.rawUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Customization Control Panel */}
      <div className="shrink-0 p-3.5 bg-card rounded-t-3xl border-t-2 border-ink shadow-neo-xl space-y-2.5 safe-bottom">
        {/* Perforation Style Selector */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-1 px-0.5">
            <span>齿孔样式</span>
            <span className="font-mono text-[10px] font-bold text-ink-2 bg-sand px-1.5 py-0.2 rounded border border-ink/30">
              {options.style === 'classic' ? '标准齿' : options.style === 'fine' ? '密齿' : '大齿'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'classic' as const, name: '标准齿' },
              { id: 'fine' as const, name: '复古密齿' },
              { id: 'wide' as const, name: '艺术大齿' },
            ].map((style) => {
              const isSelected = options.style === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectStyle(style.id)}
                  className={`h-7.5 rounded-xl text-[11.5px] font-extrabold transition-all text-center select-none flex items-center justify-center border-2 border-ink btn-neo ${
                    isSelected
                      ? 'bg-sun text-ink shadow-neo-sm'
                      : 'bg-paper text-ink shadow-none hover:bg-sand opacity-90'
                  }`}
                >
                  {style.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Margin Slider & Quick Mode Pills */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-1 px-0.5">
            <span>留白边距</span>
            <span className="font-mono text-[10px] font-bold text-ink bg-sun px-2 py-0.2 rounded-md border-2 border-ink shadow-neo-sm">
              {options.margin === 0 ? '满幅打孔 (0px)' : `${options.margin}px`}
            </span>
          </div>

          {/* Quick Margin Pills */}
          <div className="grid grid-cols-3 gap-1.5 mb-1.5">
            <button
              type="button"
              onClick={() => handleMarginChange(0)}
              className={`h-6 rounded-lg text-[10.5px] font-extrabold border-2 border-ink btn-neo transition-all ${
                options.margin === 0
                  ? 'bg-accent text-white shadow-neo-sm'
                  : 'bg-paper text-ink hover:bg-sand'
              }`}
            >
              满幅打孔
            </button>
            <button
              type="button"
              onClick={() => handleMarginChange(14)}
              className={`h-6 rounded-lg text-[10.5px] font-extrabold border-2 border-ink btn-neo transition-all ${
                options.margin === 14
                  ? 'bg-accent text-white shadow-neo-sm'
                  : 'bg-paper text-ink hover:bg-sand'
              }`}
            >
              经典留白
            </button>
            <button
              type="button"
              onClick={() => handleMarginChange(26)}
              className={`h-6 rounded-lg text-[10.5px] font-extrabold border-2 border-ink btn-neo transition-all ${
                options.margin === 26
                  ? 'bg-accent text-white shadow-neo-sm'
                  : 'bg-paper text-ink hover:bg-sand'
              }`}
            >
              宽幅相框
            </button>
          </div>

          <input
            type="range"
            min={minMargin}
            max={maxMargin}
            value={options.margin}
            onChange={(e) => handleMarginChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #FF5C2B ${sliderPercentage}%, #F1E3C4 ${sliderPercentage}%)`,
            }}
            aria-label="调整留白边距"
          />
        </div>

        {/* Background Color Selector */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-1 px-0.5">
            <span>衬纸底色</span>
            {options.margin === 0 && (
              <span className="text-[10px] text-ink-3 font-normal">满幅打孔无需底色</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-1.5 px-0.5">
            {COLOR_PRESETS.map((color) => {
              const isSelected = options.backgroundColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleSelectColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  className={`size-6 rounded-full border-2 border-ink transition-all relative ${
                    isSelected
                      ? 'ring-2 ring-ink ring-offset-2 scale-110 shadow-neo-sm'
                      : 'hover:scale-105 opacity-90'
                  }`}
                  aria-label={color.name}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-0.5 space-y-1.5">
          {/* Main Primary CTA Button */}
          <button
            type="button"
            onClick={handleSaveAllOrCurrent}
            disabled={isSaving}
            className="w-full h-10 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 border-ink shadow-neo btn-neo transition-all disabled:opacity-50"
          >
            <Download className="size-3.5 stroke-[2.5]" />
            <span>
              {isSaving
                ? '正在生成中...'
                : images.length > 1
                ? isXhs
                  ? `一键保存全部 (${images.length}张) 邮票到相册 📬`
                  : `一键批量下载全部 (${images.length}张) 邮票 📬`
                : isXhs
                ? '保存邮票到手机相册 📬'
                : '保存高清邮票图片 📬'}
            </span>
          </button>

          {/* Secondary Action Row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setIsPostNoteModalOpen(true)}
              className="h-8 rounded-xl bg-rose border-2 border-ink shadow-neo-sm btn-neo text-ink font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all"
            >
              <span>📕</span>
              <span>发布小红书图文 {images.length > 1 && `(${images.length}张)`}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyClipboard}
              disabled={isQuickCopying}
              className="h-8 rounded-xl bg-sky border-2 border-ink shadow-neo-sm btn-neo text-ink font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              <Copy className="size-3 stroke-[2.5] text-ink" />
              <span>{isQuickCopying ? '复制中...' : images.length > 1 ? '复制当前透明图' : '复制透明图'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post to Note Modal */}
      <PostNoteModal
        isOpen={isPostNoteModalOpen}
        onClose={() => setIsPostNoteModalOpen(false)}
        images={images}
        croppedImageUrl={activeImageUrl}
        options={options}
        onToast={onToast}
      />

      {/* Export & Resolution Settings Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        croppedImageUrl={activeImageUrl}
        options={options}
        originalFileName={currentImage?.name || originalFileName}
        onToast={onToast}
      />
    </div>
  );
};
