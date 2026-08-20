import React, { useState } from 'react';
import { ArrowLeft, Download, Copy, SlidersHorizontal } from 'lucide-react';
import { StampOptions, StampStyleId } from '../../types';
import { StampPreview } from './StampPreview';
import { COLOR_PRESETS, DEFAULT_EXPORT_SETTINGS, STAMP_STYLES } from '../../utils/constants';
import { ExportModal } from '../export/ExportModal';
import { PostNoteModal } from '../export/PostNoteModal';
import { copyStampToClipboard, downloadStamp, isXhsMiniTool } from '../../utils/exportStamp';

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
  const [isPostNoteModalOpen, setIsPostNoteModalOpen] = useState(false);
  const [isQuickCopying, setIsQuickCopying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isXhs = isXhsMiniTool();

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
      margin: val,
    });
  };

  const handleSelectColor = (hex: string) => {
    onOptionsChange({
      ...options,
      backgroundColor: hex,
    });
  };

  const handleSaveDirectly = async () => {
    try {
      setIsSaving(true);
      const res = await downloadStamp(
        croppedImageUrl,
        options,
        DEFAULT_EXPORT_SETTINGS,
        originalFileName
      );
      onToast(res.success ? 'success' : 'error', res.message);
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
        croppedImageUrl,
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

  // Slider progress percentage
  const minMargin = 4;
  const maxMargin = 40;
  const sliderPercentage = Math.max(0, Math.min(100, ((options.margin - minMargin) / (maxMargin - minMargin)) * 100));

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FAF7F2] text-ink flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* 1. Top Navigation Row */}
      <div className="shrink-0 px-4 pt-2 pb-1 flex items-center justify-between z-10 safe-top">
        <button
          type="button"
          onClick={onBackToCrop}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-bold text-neutral-900 shadow-sm border border-neutral-200 hover:bg-neutral-50 active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="size-3.5 stroke-[2.2]" />
          <span>重新构图</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-bold text-neutral-900 shadow-sm border border-neutral-200 hover:bg-neutral-50 active:scale-[0.97] transition-all"
          title="导出参数"
        >
          <SlidersHorizontal className="size-3.5 stroke-[2.2]" />
          <span>导出参数</span>
        </button>
      </div>

      {/* 2. Main Stamp Live Preview Stage (Flexes to available space) */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-2 overflow-hidden">
        <StampPreview
          croppedImageUrl={croppedImageUrl}
          options={options}
        />
      </div>

      {/* 3. Customization Control Panel */}
      <div className="shrink-0 p-4 bg-white rounded-t-3xl shadow-float border-t border-[#ECE7DE] space-y-3.5 safe-bottom">
        {/* Style Selector (Segmented Tabs) */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-900 font-bold mb-1.5 px-0.5">
            <span>齿孔样式</span>
            <span className="font-mono text-[11px] text-neutral-500">
              {options.style === 'classic' ? '标准齿' : options.style === 'fine' ? '密齿' : '大齿'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
                  className={`h-8 rounded-xl text-xs font-bold transition-all text-center select-none flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#F4F1FD] border-2 border-[#5B4BD8] text-[#5B4BD8] shadow-xs'
                      : 'bg-[#F8F6F2] border border-neutral-200 text-neutral-900 hover:bg-[#F2ECE2]'
                  }`}
                >
                  {style.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Margin Slider */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-900 font-bold mb-1 px-0.5">
            <span>留白边距</span>
            <span className="font-mono text-[11px] text-[#5B4BD8] font-bold bg-[#F4F1FD] px-2 py-0.5 rounded-md border border-[#5B4BD8]/20">
              {options.margin}px
            </span>
          </div>
          <input
            type="range"
            min={minMargin}
            max={maxMargin}
            value={options.margin}
            onChange={(e) => handleMarginChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #5B4BD8 ${sliderPercentage}%, #ECE7DE ${sliderPercentage}%)`,
            }}
            aria-label="调整留白边距"
          />
        </div>

        {/* Background Color Selector */}
        <div>
          <div className="text-xs text-neutral-900 font-bold mb-1.5 px-0.5">衬纸底色</div>
          <div className="flex items-center justify-between gap-2 px-1">
            {COLOR_PRESETS.map((color) => {
              const isSelected = options.backgroundColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleSelectColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  className={`size-7 rounded-full border transition-all duration-150 relative ${
                    isSelected
                      ? 'ring-2 ring-[#5B4BD8] ring-offset-2 scale-110 border-neutral-400 shadow-sm'
                      : 'border-neutral-300 hover:scale-105 shadow-xs'
                  }`}
                  aria-label={color.name}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 space-y-2">
          {/* Main Primary CTA Button */}
          <button
            type="button"
            onClick={handleSaveDirectly}
            disabled={isSaving}
            className="w-full h-11 rounded-2xl bg-[#5B4BD8] hover:bg-[#4E3EC8] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Download className="size-4 stroke-[2.4]" />
            <span>{isSaving ? '生成中...' : isXhs ? '保存邮票到手机相册' : '保存高清邮票图片'}</span>
          </button>

          {/* Secondary Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPostNoteModalOpen(true)}
              className="h-9 rounded-xl bg-white border border-neutral-300 hover:bg-[#FAF7F2] text-neutral-900 font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-[0.98] transition-all"
            >
              <span>📕</span>
              <span>发布小红书图文</span>
            </button>

            <button
              type="button"
              onClick={handleCopyClipboard}
              disabled={isQuickCopying}
              className="h-9 rounded-xl bg-white border border-neutral-300 hover:bg-[#FAF7F2] text-neutral-900 font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Copy className="size-3.5 text-[#5B4BD8] stroke-[2.2]" />
              <span>{isQuickCopying ? '复制中...' : '复制透明图'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post to Note Modal */}
      <PostNoteModal
        isOpen={isPostNoteModalOpen}
        onClose={() => setIsPostNoteModalOpen(false)}
        croppedImageUrl={croppedImageUrl}
        options={options}
        onToast={onToast}
      />

      {/* Export & Resolution Settings Modal */}
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
