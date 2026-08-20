import confetti from 'canvas-confetti';
import { StampOptions, ExportSettings } from '../types';
import '../types/jsbridge';
import { renderStamp } from './renderStamp';

/**
 * Check if running inside XHS MiniTool Container
 */
export function isXhsMiniTool(): boolean {
  return typeof window !== 'undefined' && Boolean(window.xhs?.miniTool);
}

/**
 * Generate formatted timestamp filename
 */
export function generateFileName(
  originalName?: string,
  extension = 'png'
): string {
  if (originalName) {
    const base = originalName.replace(/\.[^/.]+$/, '').trim();
    if (base) {
      return `${base}-stamp.${extension}`;
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');

  return `stamp-${year}${month}${day}-${hours}${mins}${secs}.${extension}`;
}

/**
 * High-resolution Stamp Exporter
 * Supports XHS JSBridge saveImageToPhotosAlbum & Web Download Fallback
 */
export async function downloadStamp(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  originalName?: string
): Promise<{ success: boolean; message: string }> {
  const result = await renderStamp(
    imageSource,
    options,
    settings.resolution,
    settings.transparent,
    settings.paperColor
  );

  const dataUrl = result.dataUrl;

  // 1. If in XHS MiniTool container, use JSBridge save to album
  if (isXhsMiniTool() && window.xhs?.miniTool) {
    try {
      const tempFileRes = await window.xhs.miniTool.writeTempFile({
        data: dataUrl,
      });

      await window.xhs.miniTool.saveImageToPhotosAlbum({
        filePath: tempFileRes.filePath || dataUrl,
      });

      triggerConfetti();
      return { success: true, message: '邮票已成功保存到系统相册！' };
    } catch (err: any) {
      console.error('JSBridge saveImageToPhotosAlbum error', err);
      // Try direct dataUrl fallback
      try {
        await window.xhs.miniTool.saveImageToPhotosAlbum({
          filePath: dataUrl,
        });
        triggerConfetti();
        return { success: true, message: '邮票已成功保存到系统相册！' };
      } catch (directErr) {
        console.error('Direct JSBridge save failed', directErr);
        return { success: false, message: '保存相册失败，请检查相册权限' };
      }
    }
  }

  // 2. Web browser fallback download
  const mimeType =
    settings.format === 'jpeg'
      ? 'image/jpeg'
      : settings.format === 'webp'
      ? 'image/webp'
      : 'image/png';

  const ext = settings.format === 'jpeg' ? 'jpg' : settings.format;
  const fileName = generateFileName(originalName, ext);

  return new Promise((resolve) => {
    result.canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve({ success: false, message: '图片生成失败' });
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        triggerConfetti();
        resolve({ success: true, message: '高清邮票已成功导出下载！' });
      },
      mimeType,
      0.95
    );
  });
}

/**
 * Publish Stamp directly to XHS Note via JSBridge
 */
export async function postStampToXhsNote(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  noteData?: { title?: string; content?: string; tags?: string }
): Promise<{ success: boolean; message: string }> {
  if (!isXhsMiniTool() || !window.xhs?.miniTool) {
    return { success: false, message: '当前非小红书容器环境' };
  }

  try {
    const result = await renderStamp(
      imageSource,
      options,
      Math.min(settings.resolution, 2160),
      settings.transparent,
      settings.paperColor
    );

    const title = noteData?.title || 'Stamp Maker 专属复古邮票 💌';
    const content =
      noteData?.content ||
      '用 Stamp Maker 制作的复古齿孔小邮票！氛围感拉满 ✨ #StampMaker #小红书小工具 #手账 #邮票';

    await window.xhs.miniTool.postNote({
      title,
      content,
      tags: noteData?.tags || '#StampMaker',
      pageType: 'photo_publish',
      mediaInfo: {
        image_resources: [{ url: result.dataUrl }],
      },
    });

    triggerConfetti();
    return { success: true, message: '已跳转发布笔记页面！' };
  } catch (err: any) {
    console.error('JSBridge postNote error', err);
    return { success: false, message: err?.errMsg || '发布笔记失败' };
  }
}

/**
 * Copy transparent PNG stamp to user clipboard (for web environment)
 */
export async function copyStampToClipboard(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings
): Promise<{ success: boolean; message: string }> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return {
        success: false,
        message: '当前环境不支持直接复制图片，请点击「保存图片」',
      };
    }

    const result = await renderStamp(
      imageSource,
      options,
      Math.min(settings.resolution, 2160),
      settings.transparent,
      settings.paperColor
    );

    return new Promise((resolve) => {
      result.canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, message: '生成图片数据失败' });
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          triggerConfetti();
          resolve({ success: true, message: '邮票已成功复制到剪贴板！' });
        } catch (err) {
          console.error('Clipboard write error', err);
          resolve({
            success: false,
            message: '剪贴板权限受限，请点击「保存图片」',
          });
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Copy stamp error', error);
    return {
      success: false,
      message: '复制失败，请点击「保存图片」',
    };
  }
}

/**
 * Confetti celebration trigger
 */
export function triggerConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#24221F', '#EBE5D8', '#C57B57', '#F4EBD9'],
      disableForReducedMotion: true,
    });
  } catch (e) {
    // Ignore confetti errors if blocked
  }
}
