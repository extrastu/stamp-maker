import confetti from 'canvas-confetti';
import { MakerMode, StampOptions, TicketOptions, ExportSettings } from '../types';
import '../types/jsbridge';
import { renderStamp } from './renderStamp';
import { renderTicket } from './renderTicket';

/**
 * Check if running inside XHS MiniTool Container
 */
export function isXhsMiniTool(): boolean {
  if (typeof window === 'undefined') return false;
  if (Boolean(window.xhs?.miniTool)) return true;
  const ua = (navigator.userAgent || '').toLowerCase();
  return ua.includes('xhs') || ua.includes('xiaohongshu');
}

/**
 * Generate formatted timestamp filename
 */
export function generateFileName(
  originalName?: string,
  extension = 'png',
  index?: number,
  prefix = 'stamp'
): string {
  if (originalName) {
    const base = originalName.replace(/\.[^/.]+$/, '').trim();
    if (base) {
      return index !== undefined ? `${base}-${prefix}-${index + 1}.${extension}` : `${base}-${prefix}.${extension}`;
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const suffix = index !== undefined ? `-${index + 1}` : '';
  return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}${suffix}.${extension}`;
}

/**
 * Render single artwork based on MakerMode
 */
export async function renderArtwork(
  imageSource: string | HTMLImageElement,
  mode: MakerMode = 'stamp',
  options: StampOptions,
  ticketOptions?: TicketOptions,
  resolution = 2160,
  transparent = true,
  paperColor = '#FFF4DD'
) {
  if (mode === 'ticket' && ticketOptions) {
    return await renderTicket(
      imageSource,
      ticketOptions,
      resolution,
      transparent,
      paperColor
    );
  }
  return await renderStamp(
    imageSource,
    options,
    resolution,
    transparent,
    paperColor
  );
}

/**
 * High-definition Stamp/Ticket Export Pipeline
 */
export async function downloadStamp(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  originalFileName?: string,
  index?: number,
  mode: MakerMode = 'stamp',
  ticketOptions?: TicketOptions
): Promise<{ success: boolean; message: string }> {
  try {
    const isTransparent = settings.transparent && settings.format === 'png';

    const result = await renderArtwork(
      imageSource,
      mode,
      options,
      ticketOptions,
      settings.resolution,
      isTransparent,
      settings.paperColor
    );

    const prefix = mode === 'ticket' ? 'ticket' : 'stamp';
    const fileName = generateFileName(originalFileName, settings.format, index, prefix);

    // 1. Xiaohongshu Native MiniTool Environment
    if (isXhsMiniTool() && window.xhs?.miniTool) {
      try {
        const tempRes = await window.xhs.miniTool.writeTempFile({
          data: result.dataUrl,
        });

        if (tempRes && tempRes.filePath) {
          await window.xhs.miniTool.saveImageToPhotosAlbum({
            filePath: tempRes.filePath,
          });
          triggerConfetti();
          return {
            success: true,
            message: mode === 'ticket' ? '旅行票根已成功保存至手机相册！' : '邮票已成功保存至手机相册！',
          };
        }
      } catch (err: any) {
        console.warn('XHS JSBridge save failed, falling back to browser download', err);
      }
    }

    // 2. Standard Web Browser Download
    const mimeType =
      settings.format === 'jpeg'
        ? 'image/jpeg'
        : settings.format === 'webp'
        ? 'image/webp'
        : 'image/png';

    return new Promise((resolve) => {
      result.canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ success: false, message: '生成图片数据失败' });
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
          resolve({
            success: true,
            message: mode === 'ticket' ? '高清旅行票根已成功导出下载！' : '高清邮票已成功导出下载！',
          });
        },
        mimeType,
        0.95
      );
    });
  } catch (error) {
    console.error('Download error', error);
    return {
      success: false,
      message: '导出失败，请重试',
    };
  }
}

/**
 * Batch Export Multiple Stamps / Tickets
 */
export async function downloadMultipleStamps(
  imageSources: (string | HTMLImageElement)[],
  options: StampOptions,
  settings: ExportSettings,
  originalFileName?: string,
  mode: MakerMode = 'stamp',
  ticketOptions?: TicketOptions
): Promise<{ success: boolean; message: string }> {
  try {
    let successCount = 0;
    for (let i = 0; i < imageSources.length; i++) {
      const res = await downloadStamp(
        imageSources[i],
        options,
        settings,
        originalFileName,
        i,
        mode,
        ticketOptions
      );
      if (res.success) {
        successCount++;
      }
      if (!isXhsMiniTool() && i < imageSources.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    triggerConfetti();
    return {
      success: true,
      message: mode === 'ticket' ? `已成功保存 ${successCount} 张高清旅行票根！` : `已成功保存 ${successCount} 张高清邮票！`,
    };
  } catch (e) {
    console.error('Batch download failed', e);
    return {
      success: false,
      message: '批量导出失败，请重试',
    };
  }
}

/**
 * Publish Multiple Stamps / Tickets directly to XHS Note via JSBridge postNote
 */
export async function postStampToXhsNote(
  imageSources: (string | HTMLImageElement)[] | string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  noteData?: { title?: string; content?: string; tags?: string },
  mode: MakerMode = 'stamp',
  ticketOptions?: TicketOptions
): Promise<{ success: boolean; message: string }> {
  if (!isXhsMiniTool() || !window.xhs?.miniTool) {
    return { success: false, message: '当前非小红书容器环境' };
  }

  const sources = Array.isArray(imageSources) ? imageSources : [imageSources];

  try {
    const imageResources: { url: string }[] = [];

    for (const src of sources) {
      const result = await renderArtwork(
        src,
        mode,
        options,
        ticketOptions,
        Math.min(settings.resolution, 2160),
        settings.transparent,
        settings.paperColor
      );
      imageResources.push({ url: result.dataUrl });
    }

    const defaultTitle =
      mode === 'ticket'
        ? `我的专属旅行票根 · ${ticketOptions?.stationTitle || 'NEXT STATION'} 🎫`
        : 'Stamp Maker 专属复古邮票 💌';

    const defaultContent =
      mode === 'ticket'
        ? `用 Stamp Maker 制作的专属复古旅行票根！记录每一站的浪漫风景与独家记忆 ✨ #StampMaker #旅行票根 #手账 #小红书图文 #旅行摄影`
        : '用 Stamp Maker 制作的专属复古齿孔小邮票！氛围感拉满 ✨ #StampMaker #小红书小工具 #手账 #邮票';

    const title = noteData?.title || defaultTitle;
    const content = noteData?.content || defaultContent;

    await window.xhs.miniTool.postNote({
      title,
      content,
      tags: noteData?.tags || (mode === 'ticket' ? '#StampMaker #旅行票根' : '#StampMaker'),
      pageType: 'photo_publish',
      mediaInfo: {
        image_resources: imageResources,
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
 * Copy transparent PNG artwork to user clipboard (for web environment)
 */
export async function copyStampToClipboard(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  mode: MakerMode = 'stamp',
  ticketOptions?: TicketOptions
): Promise<{ success: boolean; message: string }> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return {
        success: false,
        message: '当前环境不支持直接复制图片，请点击「保存图片」',
      };
    }

    const result = await renderArtwork(
      imageSource,
      mode,
      options,
      ticketOptions,
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
          resolve({
            success: true,
            message: mode === 'ticket' ? '旅行票根已成功复制到剪贴板！' : '邮票已成功复制到剪贴板！',
          });
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
    console.error('Copy error', error);
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
    // Ignore in non-DOM test env
  }
}
