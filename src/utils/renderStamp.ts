import { StampOptions } from '../types';
import { createImage } from './cropImage';

export interface RenderStampResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dataUrl: string;
}

/**
 * Core Stamp Rendering Engine
 * Accurately creates perforated stamp edges using HTML5 Canvas composite operations.
 */
export async function renderStamp(
  imageSource: string | HTMLImageElement,
  options: StampOptions,
  targetMaxDimension = 1200,
  transparentBackground = true,
  paperColor = '#F5F1E8'
): Promise<RenderStampResult> {
  const img =
    typeof imageSource === 'string'
      ? await createImage(imageSource)
      : imageSource;

  const originalPhotoWidth = img.naturalWidth || img.width;
  const originalPhotoHeight = img.naturalHeight || img.height;

  // Scale factor based on requested target dimension
  // The base design units are defined around ~1000px base
  const baseScale = targetMaxDimension / 1000;

  // Scaled dimensions for options
  const scaledMargin = Math.max(0, Math.round(options.margin * baseScale));
  const scaledHoleRadius = Math.max(2, Math.round(options.holeRadius * baseScale));
  const scaledHoleGap = Math.max(scaledHoleRadius * 2 + 2, Math.round(options.holeGap * baseScale));
  const scaledPhotoRadius = Math.max(0, Math.round(options.photoRadius * baseScale));

  // Determine photo render dimensions
  const photoAspectRatio = originalPhotoWidth / originalPhotoHeight;
  let renderPhotoWidth: number;
  let renderPhotoHeight: number;

  if (photoAspectRatio >= 1) {
    renderPhotoWidth = targetMaxDimension - scaledMargin * 2;
    renderPhotoHeight = Math.round(renderPhotoWidth / photoAspectRatio);
  } else {
    renderPhotoHeight = targetMaxDimension - scaledMargin * 2;
    renderPhotoWidth = Math.round(renderPhotoHeight * photoAspectRatio);
  }

  // Stamp paper outer size
  const stampWidth = renderPhotoWidth + scaledMargin * 2;
  const stampHeight = renderPhotoHeight + scaledMargin * 2;

  // 1. Create Stamp Canvas
  const stampCanvas = document.createElement('canvas');
  stampCanvas.width = stampWidth;
  stampCanvas.height = stampHeight;
  const stampCtx = stampCanvas.getContext('2d', { willReadFrequently: true });

  if (!stampCtx) {
    throw new Error('Failed to get 2d context for stamp canvas');
  }

  // A. Fill stamp solid background
  stampCtx.fillStyle = options.backgroundColor;
  stampCtx.fillRect(0, 0, stampWidth, stampHeight);

  // B. Draw photo inside margin (with optional rounded corners)
  stampCtx.save();
  const photoX = scaledMargin;
  const photoY = scaledMargin;

  if (scaledPhotoRadius > 0) {
    stampCtx.beginPath();
    drawRoundedRect(
      stampCtx,
      photoX,
      photoY,
      renderPhotoWidth,
      renderPhotoHeight,
      scaledPhotoRadius
    );
    stampCtx.clip();
  }

  stampCtx.drawImage(
    img,
    photoX,
    photoY,
    renderPhotoWidth,
    renderPhotoHeight
  );
  stampCtx.restore();

  // C. Punch perforation holes along 4 borders using 'destination-out'
  stampCtx.save();
  stampCtx.globalCompositeOperation = 'destination-out';
  stampCtx.fillStyle = '#000000';

  // Horizontal top and bottom perforations
  // Distribute holes evenly so corner teeth remain intact
  const countX = Math.max(3, Math.round(stampWidth / scaledHoleGap));
  const actualGapX = stampWidth / countX;

  for (let i = 0; i < countX; i++) {
    const x = (i + 0.5) * actualGapX;
    // Top hole
    stampCtx.beginPath();
    stampCtx.arc(x, 0, scaledHoleRadius, 0, Math.PI * 2);
    stampCtx.fill();

    // Bottom hole
    stampCtx.beginPath();
    stampCtx.arc(x, stampHeight, scaledHoleRadius, 0, Math.PI * 2);
    stampCtx.fill();
  }

  // Vertical left and right perforations
  const countY = Math.max(3, Math.round(stampHeight / scaledHoleGap));
  const actualGapY = stampHeight / countY;

  for (let j = 0; j < countY; j++) {
    const y = (j + 0.5) * actualGapY;
    // Left hole
    stampCtx.beginPath();
    stampCtx.arc(0, y, scaledHoleRadius, 0, Math.PI * 2);
    stampCtx.fill();

    // Right hole
    stampCtx.beginPath();
    stampCtx.arc(stampWidth, y, scaledHoleRadius, 0, Math.PI * 2);
    stampCtx.fill();
  }

  stampCtx.restore();

  const shouldRenderBackdrop =
    (options.backdropEnabled && options.backdropColor && options.backdropColor !== 'transparent') ||
    !transparentBackground;

  // If no backdrop requested, return transparent cutout stampCanvas directly
  if (!shouldRenderBackdrop) {
    return {
      canvas: stampCanvas,
      width: stampWidth,
      height: stampHeight,
      dataUrl: stampCanvas.toDataURL('image/png'),
    };
  }

  // Otherwise, render on background card with padding and authentic soft drop shadow
  const padding = Math.round(56 * baseScale);
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = stampWidth + padding * 2;
  finalCanvas.height = stampHeight + padding * 2;
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    throw new Error('Failed to get 2d context for final canvas');
  }

  // Fill backdrop background color
  const bgCardColor = (options.backdropEnabled && options.backdropColor) ? options.backdropColor : paperColor;
  finalCtx.fillStyle = bgCardColor;
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Draw stamp in center with authentic realistic physical drop shadow
  finalCtx.save();
  finalCtx.shadowColor = 'rgba(40, 30, 20, 0.22)';
  finalCtx.shadowBlur = Math.round(26 * baseScale);
  finalCtx.shadowOffsetX = 0;
  finalCtx.shadowOffsetY = Math.round(14 * baseScale);
  finalCtx.drawImage(stampCanvas, padding, padding);
  finalCtx.restore();

  return {
    canvas: finalCanvas,
    width: finalCanvas.width,
    height: finalCanvas.height,
    dataUrl: finalCanvas.toDataURL('image/png'),
  };
}

/**
 * Helper to draw a rounded rectangle path
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
