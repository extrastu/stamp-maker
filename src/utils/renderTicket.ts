import { TicketOptions } from '../types';
import { createImage } from './cropImage';

export interface RenderTicketResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dataUrl: string;
}

/**
 * Helper to determine if a color is light or dark
 */
function isColorLight(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
}

/**
 * Helper to draw rounded rectangle path
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

/**
 * Draw ticket card path with 4 rounded corners and 2 side notches
 */
function drawTicketCardPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  notchY: number,
  notchRadius: number
) {
  ctx.beginPath();
  // Top left corner
  ctx.moveTo(x + r, y);
  // Top edge
  ctx.lineTo(x + w - r, y);
  // Top right corner
  ctx.arcTo(x + w, y, x + w, y + r, r);

  // Right edge down to notch
  ctx.lineTo(x + w, notchY - notchRadius);
  // Right side inward semicircular notch
  ctx.arc(x + w, notchY, notchRadius, -Math.PI / 2, Math.PI / 2, true);

  // Right edge down to bottom right
  ctx.lineTo(x + w, y + h - r);
  // Bottom right corner
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);

  // Bottom edge
  ctx.lineTo(x + r, y + h);
  // Bottom left corner
  ctx.arcTo(x, y + h, x, y + h - r, r);

  // Left edge up to notch
  ctx.lineTo(x, notchY + notchRadius);
  // Left side inward semicircular notch
  ctx.arc(x, notchY, notchRadius, Math.PI / 2, -Math.PI / 2, true);

  // Left edge up to top left
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Draw vertical barcode with ticket number on the right stub
 */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  codeString: string
) {
  ctx.save();

  // White backing pill for barcode
  const cardR = Math.round(width * 0.15);
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, x, y, width, height, cardR);
  ctx.fill();

  // Draw barcode stripes horizontally across the box
  const padX = width * 0.16;
  const padY = height * 0.08;
  const barAreaWidth = width - padX * 2;
  const barAreaHeight = height - padY * 2;

  // Generate bar patterns
  const pattern = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2];
  let totalUnits = 0;
  pattern.forEach((p) => (totalUnits += p));

  const unitHeight = barAreaHeight / totalUnits;
  let currentY = y + padY;

  ctx.fillStyle = '#1A1410';
  for (let i = 0; i < pattern.length; i++) {
    const barH = pattern[i] * unitHeight;
    if (i % 2 === 0) {
      ctx.fillRect(x + padX, currentY, barAreaWidth * 0.72, barH);
    }
    currentY += barH;
  }

  // Draw vertical rotated ticket number text
  ctx.save();
  ctx.translate(x + width - padX * 0.5, y + height - padY);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#1A1410';
  ctx.font = `600 ${Math.max(8, Math.round(width * 0.13))}px monospace`;
  ctx.fillText(codeString.slice(0, 16), 0, 0);
  ctx.restore();

  ctx.restore();
}

/**
 * Travel Ticket Stub Canvas Renderer
 */
export async function renderTicket(
  imageSource: string | HTMLImageElement,
  options: TicketOptions,
  targetMaxDimension = 1200,
  transparentBackground = true,
  paperColor = '#FFF4DD'
): Promise<RenderTicketResult> {
  const img =
    typeof imageSource === 'string'
      ? await createImage(imageSource)
      : imageSource;

  const originalPhotoWidth = img.naturalWidth || img.width;
  const originalPhotoHeight = img.naturalHeight || img.height;

  // Ticket Aspect Ratio fixed around standard 1 : 1.42
  const baseScale = targetMaxDimension / 1200;
  const cardWidth = Math.round(800 * baseScale);
  const cardHeight = Math.round(1140 * baseScale);

  const cornerRadius = Math.round(36 * baseScale);
  const notchRadius = Math.round(18 * baseScale);
  const cardPadding = Math.round(32 * baseScale);

  // Photo dimensions (fits inside top half with padding)
  const photoContainerWidth = cardWidth - cardPadding * 2;
  const photoContainerHeight = Math.round(photoContainerWidth * 0.96);
  const photoRadius = Math.round((options.photoRadius || 18) * baseScale);

  // Notch & Tear Line Y Position
  const tearLineY = cardPadding + photoContainerHeight + Math.round(28 * baseScale);

  // 1. Create Ticket Canvas
  const ticketCanvas = document.createElement('canvas');
  ticketCanvas.width = cardWidth;
  ticketCanvas.height = cardHeight;
  const ctx = ticketCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get 2d context for ticket canvas');
  }

  // A. Draw Ticket Card Body with Notches
  ctx.save();
  drawTicketCardPath(
    ctx,
    0,
    0,
    cardWidth,
    cardHeight,
    cornerRadius,
    tearLineY,
    notchRadius
  );
  ctx.fillStyle = options.themeColor;
  ctx.fill();

  // B. Draw Top Photo
  ctx.save();
  const photoX = cardPadding;
  const photoY = cardPadding;

  // Clip photo to rounded rectangle
  ctx.beginPath();
  drawRoundedRect(
    ctx,
    photoX,
    photoY,
    photoContainerWidth,
    photoContainerHeight,
    photoRadius
  );
  ctx.clip();

  // Draw image with cover aspect ratio
  const imgAspect = originalPhotoWidth / originalPhotoHeight;
  const containerAspect = photoContainerWidth / photoContainerHeight;
  let drawW = photoContainerWidth;
  let drawH = photoContainerHeight;
  let drawX = photoX;
  let drawY = photoY;

  if (imgAspect > containerAspect) {
    drawW = photoContainerHeight * imgAspect;
    drawX = photoX - (drawW - photoContainerWidth) / 2;
  } else {
    drawH = photoContainerWidth / imgAspect;
    drawY = photoY - (drawH - photoContainerHeight) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();

  // C. Draw Perforated Dotted Tear Line between notches
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([Math.round(4 * baseScale), Math.round(6 * baseScale)]);
  ctx.strokeStyle = isColorLight(options.themeColor) ? 'rgba(38,32,26,0.25)' : 'rgba(255,255,255,0.35)';
  ctx.lineWidth = Math.round(2 * baseScale);
  ctx.moveTo(notchRadius + Math.round(4 * baseScale), tearLineY);
  ctx.lineTo(cardWidth - notchRadius - Math.round(4 * baseScale), tearLineY);
  ctx.stroke();
  ctx.restore();

  // D. Draw Lower Ticket Stub Information
  const isLight = isColorLight(options.themeColor);
  const primaryTextColor = isLight ? '#26201A' : '#FFFFFF';
  const secondaryTextColor = isLight ? 'rgba(38,32,26,0.65)' : 'rgba(255,255,255,0.7)';

  const stubY = tearLineY + Math.round(32 * baseScale);

  // Left Info Column
  const barcodeWidth = Math.round(110 * baseScale);
  const barcodeHeight = Math.round(180 * baseScale);
  const barcodeX = cardWidth - cardPadding - barcodeWidth;
  const barcodeY = stubY;

  ctx.save();
  // 1. Subtitle / Label: "NEXT STATION"
  ctx.fillStyle = secondaryTextColor;
  ctx.font = `700 ${Math.round(14 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.letterSpacing = `${Math.round(2 * baseScale)}px`;
  ctx.fillText((options.subTitle || 'NEXT STATION').toUpperCase(), cardPadding, stubY + Math.round(14 * baseScale));

  // 2. Main Station Title
  ctx.fillStyle = primaryTextColor;
  ctx.letterSpacing = '0px';
  ctx.font = `900 ${Math.round(28 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  const mainTitle = (options.stationTitle || 'GREAT WALL OF CHINA').toUpperCase();
  const words = mainTitle.split(' ');
  let line1 = '';
  let line2 = '';

  for (const word of words) {
    if ((line1 + word).length < 14 && !line2) {
      line1 += (line1 ? ' ' : '') + word;
    } else {
      line2 += (line2 ? ' ' : '') + word;
    }
  }

  const titleY = stubY + Math.round(48 * baseScale);
  ctx.fillText(line1, cardPadding, titleY);
  if (line2) {
    ctx.fillText(line2, cardPadding, titleY + Math.round(32 * baseScale));
  }

  // Optional Chinese Subtitle
  if (options.stationSubtitle) {
    ctx.fillStyle = secondaryTextColor;
    ctx.font = `700 ${Math.round(20 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const subChineseY = line2 ? titleY + Math.round(62 * baseScale) : titleY + Math.round(30 * baseScale);
    ctx.fillText(options.stationSubtitle, cardPadding, subChineseY);
  }

  // 3. Metadata Row (YEAR / DATE)
  const metaY = cardHeight - cardPadding - Math.round(8 * baseScale);

  ctx.font = `600 ${Math.round(11 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = secondaryTextColor;
  ctx.fillText('YEAR', cardPadding, metaY - Math.round(18 * baseScale));
  ctx.fillText('DATE', cardPadding + Math.round(90 * baseScale), metaY - Math.round(18 * baseScale));

  ctx.font = `800 ${Math.round(18 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = primaryTextColor;
  ctx.fillText(options.year || '2026', cardPadding, metaY);
  ctx.fillText(options.date || '08.20', cardPadding + Math.round(90 * baseScale), metaY);

  ctx.restore();

  // Right Info Column: Vertical Barcode
  drawBarcode(
    ctx,
    barcodeX,
    barcodeY,
    barcodeWidth,
    barcodeHeight,
    options.ticketNo || '120458464677987155'
  );

  ctx.restore();

  // Return transparent or paper background
  if (transparentBackground) {
    return {
      canvas: ticketCanvas,
      width: cardWidth,
      height: cardHeight,
      dataUrl: ticketCanvas.toDataURL('image/png'),
    };
  }

  // Render on paper background with soft shadow
  const padding = Math.round(60 * baseScale);
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = cardWidth + padding * 2;
  finalCanvas.height = cardHeight + padding * 2;
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    throw new Error('Failed to get 2d context for final ticket canvas');
  }

  finalCtx.fillStyle = paperColor;
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  finalCtx.save();
  finalCtx.shadowColor = 'rgba(40, 30, 20, 0.18)';
  finalCtx.shadowBlur = Math.round(28 * baseScale);
  finalCtx.shadowOffsetX = 0;
  finalCtx.shadowOffsetY = Math.round(14 * baseScale);
  finalCtx.drawImage(ticketCanvas, padding, padding);
  finalCtx.restore();

  return {
    canvas: finalCanvas,
    width: finalCanvas.width,
    height: finalCanvas.height,
    dataUrl: finalCanvas.toDataURL('image/png'),
  };
}
