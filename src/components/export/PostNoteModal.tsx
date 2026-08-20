import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { StampOptions, ExportSettings } from '../../types';
import { renderStamp } from '../../utils/renderStamp';
import { postStampToXhsNote, isXhsMiniTool } from '../../utils/exportStamp';

interface PostNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  croppedImageUrl: string;
  options: StampOptions;
  onToast: (type: 'success' | 'error', message: string) => void;
}

const DEFAULT_TITLES = [
  'Stamp Maker 专属复古邮票 💌',
  '定格浪漫：我的复古小邮票 💌',
  '一张照片变成邮票有多绝 ✨',
  '今日份手账邮票分享 ☕',
];

const DEFAULT_CONTENT = `用 Stamp Maker 制作的专属复古齿孔小邮票！\n\n氛围感直接拉满，不管是做手账素材还是小红书配图都超级好看 ✨ 推荐大家也来试试～\n\n#StampMaker #小红书小工具 #手账 #邮票 #日常摄影 #小红书图文`;

export const PostNoteModal: React.FC<PostNoteModalProps> = ({
  isOpen,
  onClose,
  croppedImageUrl,
  options,
  onToast,
}) => {
  const [title, setTitle] = useState(DEFAULT_TITLES[0]);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);
  const [includeBackdrop, setIncludeBackdrop] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const preparePreview = async () => {
      try {
        const res = await renderStamp(
          croppedImageUrl,
          options,
          1080,
          !includeBackdrop,
          '#FFF4DD'
        );
        setPreviewUrl(res.dataUrl);
      } catch (e) {
        console.error('Failed to prepare note image preview', e);
      }
    };

    preparePreview();
  }, [isOpen, croppedImageUrl, options, includeBackdrop]);

  if (!isOpen) return null;

  const handlePost = async () => {
    if (!title.trim()) {
      onToast('error', '请输入笔记标题');
      return;
    }

    try {
      setIsPosting(true);

      const exportSettings: ExportSettings = {
        format: 'png',
        resolution: 2160,
        transparent: !includeBackdrop,
        paperColor: '#FFF4DD',
      };

      if (isXhsMiniTool()) {
        const res = await postStampToXhsNote(
          croppedImageUrl,
          options,
          exportSettings,
          {
            title: title.trim(),
            content: content.trim(),
            tags: '#StampMaker',
          }
        );
        onToast(res.success ? 'success' : 'error', res.message);
        if (res.success) onClose();
      } else {
        // Fallback simulation in browser
        onToast('success', '已生成小红书图文笔记（当前处于浏览器模拟环境）');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error('Post note error', err);
      onToast('error', err?.errMsg || '发布笔记失败');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-neo-xl border-2 border-ink overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-ink flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-rose border-2 border-ink shadow-neo-sm text-sm">
              📕
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] text-ink leading-tight">创建小红书图文</h3>
              <p className="text-[11px] text-ink-2 mt-0.5 font-medium">将邮票一键带入小红书发布页</p>
            </div>
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

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Note Photo Preview */}
          <div>
            <div className="text-xs font-extrabold text-ink mb-2 flex items-center justify-between px-0.5">
              <span>封面配图预览</span>
              <button
                type="button"
                onClick={() => setIncludeBackdrop(!includeBackdrop)}
                className="text-[11px] text-accent hover:underline font-extrabold"
              >
                {includeBackdrop ? '切换为透明底' : '切换为衬纸底'}
              </button>
            </div>
            <div className="w-full h-40 rounded-2xl bg-card border-2 border-ink flex items-center justify-center p-3 relative overflow-hidden shadow-neo-sm">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Note Stamp"
                  className="max-h-full object-contain drop-shadow-[0_8px_18px_rgba(40,30,20,0.15)]"
                />
              ) : (
                <div className="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold text-ink mb-1.5 px-0.5">
              <span>笔记标题</span>
              <span className="font-mono text-[10.5px] font-bold text-ink-3 tabular-nums">{title.length}/20</span>
            </div>
            <input
              type="text"
              maxLength={20}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="填写吸引人的标题..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-ink text-xs font-bold text-ink focus:outline-none focus:bg-sun-tint bg-card transition-all"
            />
            {/* Quick Title Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar">
              {DEFAULT_TITLES.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTitle(t)}
                  className="h-6 rounded-lg bg-card border-2 border-ink shadow-neo-sm btn-neo px-2.5 text-[10.5px] font-bold text-ink whitespace-nowrap transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold text-ink mb-1.5 px-0.5">
              <span>正文与标签</span>
              <span className="font-mono text-[10.5px] font-bold text-ink-3 tabular-nums">{content.length}/1000</span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享这张邮票背后的故事..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-ink text-xs font-medium text-ink focus:outline-none focus:bg-sun-tint bg-card transition-all leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-3 border-t-2 border-ink bg-card safe-bottom">
          <button
            type="button"
            onClick={handlePost}
            disabled={isPosting}
            className="w-full h-11 rounded-2xl bg-accent hover:bg-accent-hover text-white font-extrabold text-sm flex items-center justify-center gap-2 border-2 border-ink shadow-neo-lg btn-neo transition-all disabled:opacity-50"
          >
            <Send className="size-4 stroke-[2.5]" />
            <span>{isPosting ? '拉起小红书中...' : '发布到小红书笔记 🚀'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
