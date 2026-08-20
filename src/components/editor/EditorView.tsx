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

  // Slider progress percentage for purple track fill
  const minMargin = 4;
  const maxMargin = 40;
  const sliderPercentage = Math.max(0, Math.min(100, ((options.margin - minMargin) / (maxMargin - minMargin)) * 100));

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* 1. Top Navigation Row */}
      <div className="px-4 pt-3.5 pb-1 flex items-center justify-between z-10 safe-top">
        <button
          type="button"
          onClick={onBackToCrop}
          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-neutral-200/80 backdrop-blur-xs transition-all active:scale-[0.97]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>重新构图</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-lg hover:bg-neutral-200/50 transition-colors"
          title="高级导出设置"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>导出设置</span>
        </button>
      </div>

      {/* 2. Main Stamp Live Preview Stage */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-[260px] overflow-hidden">
        <StampPreview
          croppedImageUrl={croppedImageUrl}
          options={options}
        />
      </div>

      {/* 3. Customization Control Panel (Card Style) */}
      <div className="p-4 sm:p-5 bg-white rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)] border-t border-neutral-100 space-y-4 safe-bottom">
        {/* Border Styles (边框样式) */}
        <div>
          <div className="text-xs text-neutral-500 mb-2 font-medium">边框样式</div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'classic' as const, name: '标准', desc: '经典齿孔' },
              { id: 'fine' as const, name: '密齿', desc: '高密复古' },
              { id: 'wide' as const, name: '大齿', desc: '现代艺术' },
            ].map((style) => {
              const isSelected = options.style === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => handleSelectStyle(style.id)}
                  className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                    isSelected
                      ? 'bg-[#F4F1FD] border-2 border-[#7059E8] shadow-xs'
                      : 'bg-[#F8F7F4] border border-neutral-200/70 hover:bg-[#F0EEEA]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-[2px] border border-dashed border-neutral-400 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-neutral-300 rounded-[1px]" />
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-[#7059E8]' : 'text-neutral-700'}`}>
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Margin Slider (边距) */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5 font-medium">
            <span>留白边距</span>
            <span className="text-[#7059E8] font-mono font-bold bg-[#F4F1FD] px-2 py-0.5 rounded-md text-[11px]">
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
              background: `linear-gradient(to right, #7059E8 ${sliderPercentage}%, #E8E6E0 ${sliderPercentage}%)`,
            }}
            aria-label="调整留白边距"
          />
        </div>

        {/* Background Color Selector (背景颜色) */}
        <div>
          <div className="text-xs text-neutral-500 mb-2 font-medium">背景颜色</div>
          <div className="flex items-center justify-between gap-2 px-1">
            {COLOR_PRESETS.map((color) => {
              const isSelected = options.backgroundColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.id}
                  onClick={() => handleSelectColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-8 h-8 rounded-full border transition-all relative ${
                    isSelected
                      ? 'ring-2 ring-[#7059E8] ring-offset-2 scale-110 border-neutral-300 shadow-sm'
                      : 'border-neutral-300/80 hover:scale-105 shadow-xs'
                  }`}
                  aria-label={color.name}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="pt-2 space-y-2.5">
          {/* Main Primary CTA: Post to Little Red Book Note */}
          <button
            onClick={() => setIsPostNoteModalOpen(true)}
            className="w-full h-12 rounded-2xl bg-[#E03A3E] hover:bg-[#C92F33] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-200 active:scale-[0.98]"
          >
            <span className="text-base">📕</span>
            <span>创建小红书图文笔记</span>
          </button>

          {/* Secondary Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleSaveDirectly}
              disabled={isSaving}
              className="h-11 rounded-xl bg-white border border-[#D8CFFB] hover:bg-[#F4F1FD] text-[#7059E8] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isSaving ? '正在保存...' : isXhs ? '保存到手机相册' : '保存高清图片'}</span>
            </button>

            <button
              onClick={handleCopyClipboard}
              disabled={isQuickCopying}
              className="h-11 rounded-xl bg-white border border-[#D8CFFB] hover:bg-[#F4F1FD] text-[#7059E8] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98]"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isQuickCopying ? '复制中...' : '复制透明图'}</span>
            </button>
          </div>
        </div>

        {/* Quality Tip */}
        <div className="text-center text-[11px] text-neutral-400 font-normal pt-0.5">
          支持一键拉起小红书发布图文 · 图片纯本地安全处理
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
