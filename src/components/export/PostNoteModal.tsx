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
          '#FAF8F5'
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
        paperColor: '#FAF8F5',
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="text-lg">📕</span>
            <div>
              <h3 className="font-bold text-base text-neutral-900 leading-tight">创建小红书图文笔记</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">直接将邮票带入小红书发布页面</p>
            </div>
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

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Note Photo Preview */}
          <div>
            <div className="text-xs font-medium text-neutral-600 mb-2 flex items-center justify-between">
              <span>笔记配图预览</span>
              <button
                type="button"
                onClick={() => setIncludeBackdrop(!includeBackdrop)}
                className="text-[11px] text-[#7059E8] hover:underline flex items-center gap-1"
              >
                <span>{includeBackdrop ? '切换为透明底' : '切换为衬纸底'}</span>
              </button>
            </div>
            <div className="w-full h-44 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 flex items-center justify-center p-3 relative overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Note Stamp"
                  className="max-h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                />
              ) : (
                <div className="w-5 h-5 border-2 border-[#7059E8] border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-600 mb-1.5">
              <span>笔记标题</span>
              <span className="font-mono text-[10px] text-neutral-400">{title.length}/20</span>
            </div>
            <input
              type="text"
              maxLength={20}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="填写吸引人的标题 (最长20字)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#7059E8] bg-[#F8F7F4] focus:bg-white transition-all font-medium"
            />
            {/* Quick Title Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar">
              {DEFAULT_TITLES.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTitle(t)}
                  className="px-2 py-1 bg-[#F4F1FD] hover:bg-[#EBE5FB] text-[#7059E8] rounded-md text-[10px] whitespace-nowrap transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-600 mb-1.5">
              <span>笔记正文</span>
              <span className="font-mono text-[10px] text-neutral-400">{content.length}/1000</span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享这张邮票背后的故事或拍摄心得..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#7059E8] bg-[#F8F7F4] focus:bg-white transition-all leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-3 border-t border-neutral-100 bg-[#FAF8F5] safe-bottom">
          <button
            type="button"
            onClick={handlePost}
            disabled={isPosting}
            className="w-full h-12 rounded-2xl bg-[#E03A3E] hover:bg-[#C92F33] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-200 active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
            <span>{isPosting ? '正在拉起小红书发布页...' : '发布到小红书笔记'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
