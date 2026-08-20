import React, { useState } from 'react';
import { ArrowLeft, Download, Copy, SlidersHorizontal, Home } from 'lucide-react';
import { MakerMode, StampOptions, StampStyleId, TicketOptions, ImageItem } from '../../types';
import { StampPreview } from './StampPreview';
import {
  COLOR_PRESETS,
  TICKET_COLOR_PRESETS,
  TICKET_STATION_PRESETS,
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_TICKET_OPTIONS,
  STAMP_STYLES,
} from '../../utils/constants';
import { ExportModal } from '../export/ExportModal';
import { PostNoteModal } from '../export/PostNoteModal';
import {
  copyStampToClipboard,
  downloadStamp,
  downloadMultipleStamps,
  isXhsMiniTool,
} from '../../utils/exportStamp';

interface EditorViewProps {
  images: ImageItem[];
  options: StampOptions;
  onOptionsChange: (options: StampOptions) => void;
  onBackToCrop: () => void;
  onResetToHome: () => void;
  originalFileName?: string;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  images,
  options,
  onOptionsChange,
  onBackToCrop,
  onResetToHome,
  originalFileName,
  onToast,
}) => {
  const [mode, setMode] = useState<MakerMode>('stamp');
  const [ticketOptions, setTicketOptions] = useState<TicketOptions>(DEFAULT_TICKET_OPTIONS);
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

  const handleSelectTicketPreset = (preset: (typeof TICKET_STATION_PRESETS)[0]) => {
    setTicketOptions((prev) => ({
      ...prev,
      stationTitle: preset.title,
      stationSubtitle: preset.subtitle,
      themeColor: preset.themeColor,
    }));
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
          originalFileName,
          mode,
          ticketOptions
        );
        onToast(res.success ? 'success' : 'error', res.message);
      } else {
        const res = await downloadStamp(
          activeImageUrl,
          options,
          DEFAULT_EXPORT_SETTINGS,
          originalFileName,
          undefined,
          mode,
          ticketOptions
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
        DEFAULT_EXPORT_SETTINGS,
        mode,
        ticketOptions
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
      {/* 1. Top Navigation Row (Spacious & Clean, Zero Wrap) */}
      <div className="shrink-0 px-4 pt-1.5 pb-1 flex items-center justify-between z-10 safe-top">
        {/* Left Navigation Buttons: Return to Home + Re-crop */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onResetToHome}
            className="inline-flex h-7.5 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink whitespace-nowrap transition-all"
            title="返回首页重新选图"
          >
            <Home className="size-3 stroke-[2.5]" />
            <span>首页选图</span>
          </button>

          <button
            type="button"
            onClick={onBackToCrop}
            className="inline-flex h-7.5 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink whitespace-nowrap transition-all"
            title="返回上一页重新构图"
          >
            <ArrowLeft className="size-3 stroke-[2.5]" />
            <span>重新构图</span>
          </button>
        </div>

        {/* Right Settings Button */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex h-7.5 items-center gap-1 rounded-xl bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[11px] font-extrabold text-ink whitespace-nowrap transition-all"
          title="导出参数"
        >
          <SlidersHorizontal className="size-3 stroke-[2.5]" />
          <span>导出参数</span>
        </button>
      </div>

      {/* 2. Main Live Preview Stage */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-3 py-1 overflow-hidden relative">
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <StampPreview
            croppedImageUrl={activeImageUrl}
            mode={mode}
            options={options}
            ticketOptions={ticketOptions}
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

      {/* 3. Customization Control Panel (Segmented Tabs on top) */}
      <div className="shrink-0 p-3 bg-card rounded-t-3xl border-t-2 border-ink shadow-neo-xl space-y-2 safe-bottom">
        {/* Mode Switcher Segmented Control (Full Width, Never Cramped) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-paper rounded-2xl border-2 border-ink shadow-neo-sm">
          <button
            type="button"
            onClick={() => setMode('stamp')}
            className={`h-7.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap btn-neo ${
              mode === 'stamp'
                ? 'bg-sun text-ink border-2 border-ink shadow-neo-sm'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <span>💌</span>
            <span>经典邮票</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('ticket')}
            className={`h-7.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap btn-neo ${
              mode === 'ticket'
                ? 'bg-sun text-ink border-2 border-ink shadow-neo-sm'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <span>🎫</span>
            <span>旅行票根</span>
          </button>
        </div>

        {mode === 'stamp' ? (
          /* ================= STAMP MODE CONTROLS ================= */
          <>
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
              <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-0.5 px-0.5">
                <span>留白边距</span>
                <span className="font-mono text-[10px] font-bold text-ink bg-sun px-2 py-0.2 rounded-md border-2 border-ink shadow-neo-sm">
                  {options.margin === 0 ? '满幅打孔 (0px)' : `${options.margin}px`}
                </span>
              </div>

              {/* Quick Margin Pills */}
              <div className="grid grid-cols-3 gap-1.5 mb-1">
                <button
                  type="button"
                  onClick={() => handleMarginChange(0)}
                  className={`h-5.5 rounded-lg text-[10px] font-extrabold border-2 border-ink btn-neo transition-all ${
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
                  className={`h-5.5 rounded-lg text-[10px] font-extrabold border-2 border-ink btn-neo transition-all ${
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
                  className={`h-5.5 rounded-lg text-[10px] font-extrabold border-2 border-ink btn-neo transition-all ${
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
                  <span className="text-[10px] text-ink-3 font-normal">满幅模式无需底色</span>
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
          </>
        ) : (
          /* ================= TICKET STUB CONTROLS ================= */
          <>
            {/* Quick Destination Presets */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-1 px-0.5">
                <span>目的地与站点</span>
                <span className="text-[9.5px] font-mono text-ink-2">点击快捷填词</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {TICKET_STATION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTicketPreset(preset)}
                    className="h-6 rounded-lg bg-paper border border-ink shadow-neo-sm btn-neo px-2 text-[10px] font-bold text-ink whitespace-nowrap hover:bg-sun transition-colors"
                  >
                    {preset.subtitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Station Title & Subtitle Inputs */}
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[10px] font-bold text-ink-2 px-0.5 block mb-0.5">英文站名</label>
                <input
                  type="text"
                  value={ticketOptions.stationTitle}
                  onChange={(e) =>
                    setTicketOptions((prev) => ({ ...prev, stationTitle: e.target.value.toUpperCase() }))
                  }
                  placeholder="GREAT WALL OF CHINA"
                  className="w-full px-2 py-1 rounded-lg border-2 border-ink bg-paper text-[11px] font-extrabold uppercase text-ink focus:outline-none focus:bg-sun-tint"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-2 px-0.5 block mb-0.5">中文站名 / 年月日</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={ticketOptions.stationSubtitle}
                    onChange={(e) =>
                      setTicketOptions((prev) => ({ ...prev, stationSubtitle: e.target.value }))
                    }
                    placeholder="万里长城"
                    className="w-1/2 px-2 py-1 rounded-lg border-2 border-ink bg-paper text-[11px] font-bold text-ink focus:outline-none focus:bg-sun-tint"
                  />
                  <input
                    type="text"
                    value={ticketOptions.date}
                    onChange={(e) =>
                      setTicketOptions((prev) => ({ ...prev, date: e.target.value }))
                    }
                    placeholder="08.20"
                    className="w-1/2 px-2 py-1 rounded-lg border-2 border-ink bg-paper text-[11px] font-mono font-bold text-ink focus:outline-none focus:bg-sun-tint"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Card Theme Color Palettes */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-extrabold text-ink mb-1 px-0.5">
                <span>票面主题色</span>
                <span className="font-mono text-[9.5px] text-ink-2 bg-sand px-1 rounded border border-ink/30">
                  {TICKET_COLOR_PRESETS.find((c) => c.hex.toLowerCase() === ticketOptions.themeColor.toLowerCase())?.name || '自定义'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 px-0.5">
                {TICKET_COLOR_PRESETS.map((color) => {
                  const isSelected = ticketOptions.themeColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setTicketOptions((prev) => ({ ...prev, themeColor: color.hex }))}
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
          </>
        )}

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
                  ? `一键保存全部 (${images.length}张) ${mode === 'ticket' ? '票根' : '邮票'}到相册 📬`
                  : `一键批量下载全部 (${images.length}张) ${mode === 'ticket' ? '票根' : '邮票'} 📬`
                : isXhs
                ? `保存高清${mode === 'ticket' ? '旅行票根' : '邮票'}到相册 📬`
                : `保存高清${mode === 'ticket' ? '旅行票根' : '邮票'}图片 📬`}
            </span>
          </button>

          {/* Secondary Action Row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setIsPostNoteModalOpen(true)}
              className="h-8 rounded-xl bg-rose border-2 border-ink shadow-neo-sm btn-neo text-ink font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all"
            >
              <span>{mode === 'ticket' ? '🎫' : '📕'}</span>
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
        mode={mode}
        options={options}
        ticketOptions={ticketOptions}
        onToast={onToast}
      />

      {/* Export & Resolution Settings Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        croppedImageUrl={activeImageUrl}
        mode={mode}
        options={options}
        ticketOptions={ticketOptions}
        originalFileName={currentImage?.name || originalFileName}
        onToast={onToast}
      />
    </div>
  );
};
