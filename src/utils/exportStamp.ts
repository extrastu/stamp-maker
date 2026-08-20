import confetti from 'canvas-confetti';
import { StampOptions, ExportSettings } from '../types';
import { renderStamp } from './renderStamp';

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
 */
export async function downloadStamp(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  settings: ExportSettings,
  originalName?: string
): Promise<void> {
  const result = await renderStamp(
    imageSource,
    options,
    settings.resolution,
    settings.transparent,
    settings.paperColor
  );

  const mimeType =
    settings.format === 'jpeg'
      ? 'image/jpeg'
      : settings.format === 'webp'
      ? 'image/webp'
      : 'image/png';

  const ext = settings.format === 'jpeg' ? 'jpg' : settings.format;
  const fileName = generateFileName(originalName, ext);

  // Convert to blob and download
  result.canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Trigger celebratory confetti
      triggerConfetti();
    },
    mimeType,
    0.95
  );
}

/**
 * Copy transparent PNG stamp directly to user's clipboard
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
        message: '当前浏览器不支持直接复制图片到剪贴板，请点击保存下载',
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
          resolve({ success: true, message: '邮票已成功复制到剪贴板！可以直接在其他应用中粘贴' });
        } catch (err) {
          console.error('Clipboard write error', err);
          resolve({
            success: false,
            message: '剪贴板权限受限，建议直接点击「保存图片」下载',
          });
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Copy stamp error', error);
    return {
      success: false,
      message: '复制失败，请点击「保存图片」进行下载',
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
