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
  return brightness > 165;
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
 * Draw vertical ticket card path (notches on left and right edges)
 */
function drawVerticalTicketCardPath(
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
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);

  // Right edge down to notch
  ctx.lineTo(x + w, notchY - notchRadius);
  ctx.arc(x + w, notchY, notchRadius, -Math.PI / 2, Math.PI / 2, true);

  // Right edge down to bottom right
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);

  // Bottom edge
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);

  // Left edge up to notch
  ctx.lineTo(x, notchY + notchRadius);
  ctx.arc(x, notchY, notchRadius, Math.PI / 2, -Math.PI / 2, true);

  // Left edge up to top left
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Draw horizontal ticket card path based on reference image:
 * - 4 rounded corners
 * - Left edge middle cutout notch
 * - Right edge middle cutout notch
 * - Top and bottom middle tear notches at notchX
 */
function drawHorizontalTicketCardPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  notchX: number,
  notchRadius: number
) {
  const edgeNotchY = y + h / 2;
  const edgeNotchR = notchRadius * 0.95;

  ctx.beginPath();
  // 1. Top left corner
  ctx.moveTo(x + r, y);

  // Top edge to middle tear notch
  ctx.lineTo(notchX - notchRadius, y);
  ctx.arc(notchX, y, notchRadius, Math.PI, 0, true);

  // Top edge to top right corner
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);

  // 2. Right edge with middle notch
  ctx.lineTo(x + w, edgeNotchY - edgeNotchR);
  ctx.arc(x + w, edgeNotchY, edgeNotchR, -Math.PI / 2, Math.PI / 2, true);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);

  // 3. Bottom edge with middle tear notch
  ctx.lineTo(notchX + notchRadius, y + h);
  ctx.arc(notchX, y + h, notchRadius, 0, Math.PI, true);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);

  // 4. Left edge with middle notch
  ctx.lineTo(x, edgeNotchY + edgeNotchR);
  ctx.arc(x, edgeNotchY, edgeNotchR, Math.PI / 2, -Math.PI / 2, true);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Draw vertical barcode on vertical ticket stub
 */
function drawVerticalBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  codeString: string
) {
  ctx.save();
  const cardR = Math.round(width * 0.15);
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, x, y, width, height, cardR);
  ctx.fill();

  const padX = width * 0.16;
  const padY = height * 0.08;
  const barAreaWidth = width - padX * 2;
  const barAreaHeight = height - padY * 2;

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

  // Rotated ticket code text
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
 * Draw authentic reference horizontal ticket barcode (clean direct ink bars)
 */
function drawDirectInkBarcode(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  bottomY: number,
  width: number,
  height: number,
  inkColor: string
) {
  ctx.save();
  const pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 2];
  let totalUnits = 0;
  pattern.forEach((p) => (totalUnits += p));

  const unitWidth = width / totalUnits;
  let currentX = centerX - width / 2;
  const startY = bottomY - height;

  ctx.fillStyle = inkColor;
  for (let i = 0; i < pattern.length; i++) {
    const barW = pattern[i] * unitWidth;
    if (i % 2 === 0) {
      ctx.fillRect(currentX, startY, barW, height);
    }
    currentX += barW;
  }

  ctx.restore();
}

/**
 * Travel Ticket Stub Canvas Renderer (Vertical & Horizontal)
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
  const isHorizontal = options.orientation === 'horizontal';

  const baseScale = targetMaxDimension / 1200;

  // Set card dimensions according to orientation
  // Horizontal ticket reference: 1000 x 580 (approx 1.72:1)
  const cardWidth = isHorizontal ? Math.round(1000 * baseScale) : Math.round(800 * baseScale);
  const cardHeight = isHorizontal ? Math.round(580 * baseScale) : Math.round(1140 * baseScale);

  const cornerRadius = isHorizontal ? Math.round(22 * baseScale) : Math.round(34 * baseScale);
  const notchRadius = isHorizontal ? Math.round(15 * baseScale) : Math.round(18 * baseScale);
  const cardPadding = isHorizontal ? Math.round(22 * baseScale) : Math.round(28 * baseScale);

  // 1. Create Ticket Canvas
  const ticketCanvas = document.createElement('canvas');
  ticketCanvas.width = cardWidth;
  ticketCanvas.height = cardHeight;
  const ctx = ticketCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get 2d context for ticket canvas');
  }

  const isLight = isColorLight(options.themeColor);
  const primaryTextColor = isLight ? '#2B2520' : '#FFFFFF';
  const secondaryTextColor = isLight ? 'rgba(43,37,32,0.72)' : 'rgba(255,255,255,0.78)';
  const photoRadius = Math.round((options.photoRadius || 18) * baseScale);

  if (isHorizontal) {
    /* ================= HORIZONTAL / LANDSCAPE TICKET ================= */
    const photoContainerWidth = Math.round(cardWidth * 0.55);
    const photoContainerHeight = cardHeight - cardPadding * 2;
    const tearLineX = cardPadding + photoContainerWidth + Math.round(18 * baseScale);

    // A. Draw Card Body with Outer Notches and Middle Tear Notches
    ctx.save();
    drawHorizontalTicketCardPath(
      ctx,
      0,
      0,
      cardWidth,
      cardHeight,
      cornerRadius,
      tearLineX,
      notchRadius
    );
    ctx.fillStyle = options.themeColor;
    ctx.fill();

    // B. Draw Left Photo
    ctx.save();
    const photoX = cardPadding;
    const photoY = cardPadding;

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

    // C. Draw Subtle Vertical Dotted Tear Crease Line
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([Math.round(3 * baseScale), Math.round(5 * baseScale)]);
    ctx.strokeStyle = isLight ? 'rgba(43,37,32,0.22)' : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = Math.round(1.5 * baseScale);
    ctx.moveTo(tearLineX, notchRadius + Math.round(3 * baseScale));
    ctx.lineTo(tearLineX, cardHeight - notchRadius - Math.round(3 * baseScale));
    ctx.stroke();
    ctx.restore();

    // D. Draw Right Ticket Stub Info (Centered Aesthetic from Reference Image)
    const stubCenterX = tearLineX + (cardWidth - tearLineX) / 2;

    ctx.save();
    ctx.textAlign = 'center';

    // 1. Top Activity / Station Title (Bold Vintage Display / Serif)
    ctx.fillStyle = primaryTextColor;
    ctx.font = `900 ${Math.round(25 * baseScale)}px "Georgia", "Times New Roman", -apple-system, serif`;
    ctx.letterSpacing = `${Math.round(2 * baseScale)}px`;
    const mainTitle = (options.stationTitle || 'EXPLORE').toUpperCase();
    ctx.fillText(mainTitle, stubCenterX, cardPadding + Math.round(48 * baseScale));

    // Optional Chinese subtitle right below
    if (options.stationSubtitle) {
      ctx.fillStyle = secondaryTextColor;
      ctx.font = `700 ${Math.round(14 * baseScale)}px -apple-system, sans-serif`;
      ctx.letterSpacing = '1px';
      ctx.fillText(options.stationSubtitle, stubCenterX, cardPadding + Math.round(76 * baseScale));
    }

    // 2. Middle Metadata Stack (e.g. 2026-7 / NO.2026 / XIAOHONGSHU)
    const midY = cardPadding + Math.round(150 * baseScale);

    // Date / Year
    ctx.font = `800 ${Math.round(17 * baseScale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = primaryTextColor;
    ctx.letterSpacing = '0.5px';
    const dateStr = options.date ? `${options.year || '2026'}-${options.date}` : options.year || '2026';
    ctx.fillText(dateStr, stubCenterX, midY);

    // Serial No.
    ctx.font = `700 ${Math.round(11 * baseScale)}px monospace`;
    ctx.fillStyle = secondaryTextColor;
    ctx.letterSpacing = '1px';
    const serialNo = options.ticketNo ? `NO.${options.ticketNo.slice(-6)}` : 'NO.2026';
    ctx.fillText(serialNo, stubCenterX, midY + Math.round(20 * baseScale));

    // Sub-label (e.g. XIAOHONGSHU / STAMP MAKER)
    ctx.font = `800 ${Math.round(10.5 * baseScale)}px monospace`;
    ctx.fillStyle = secondaryTextColor;
    ctx.letterSpacing = '1.5px';
    ctx.fillText((options.subTitle || 'XIAOHONGSHU').toUpperCase(), stubCenterX, midY + Math.round(38 * baseScale));

    // 3. Bottom Direct-Ink Barcode
    const barcodeWidth = Math.round(140 * baseScale);
    const barcodeHeight = Math.round(38 * baseScale);
    const barcodeBottomY = cardHeight - cardPadding - Math.round(14 * baseScale);

    drawDirectInkBarcode(
      ctx,
      stubCenterX,
      barcodeBottomY,
      barcodeWidth,
      barcodeHeight,
      primaryTextColor
    );

    ctx.restore();
  } else {
    /* ================= VERTICAL TICKET ================= */
    const photoContainerWidth = cardWidth - cardPadding * 2;
    const photoContainerHeight = Math.round(photoContainerWidth * 0.96);
    const tearLineY = cardPadding + photoContainerHeight + Math.round(28 * baseScale);

    // A. Draw Card Body with Left and Right Notches
    ctx.save();
    drawVerticalTicketCardPath(
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

    // C. Draw Horizontal Dotted Tear Line
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([Math.round(4 * baseScale), Math.round(6 * baseScale)]);
    ctx.strokeStyle = isLight ? 'rgba(38,32,26,0.25)' : 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.round(2 * baseScale);
    ctx.moveTo(notchRadius + Math.round(4 * baseScale), tearLineY);
    ctx.lineTo(cardWidth - notchRadius - Math.round(4 * baseScale), tearLineY);
    ctx.stroke();
    ctx.restore();

    // D. Draw Lower Ticket Stub Info
    const stubY = tearLineY + Math.round(32 * baseScale);
    const barcodeWidth = Math.round(110 * baseScale);
    const barcodeHeight = Math.round(180 * baseScale);
    const barcodeX = cardWidth - cardPadding - barcodeWidth;
    const barcodeY = stubY;

    ctx.save();
    // 1. Subtitle: NEXT STATION
    ctx.fillStyle = secondaryTextColor;
    ctx.font = `700 ${Math.round(14 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.letterSpacing = `${Math.round(2 * baseScale)}px`;
    ctx.fillText((options.subTitle || 'NEXT STATION').toUpperCase(), cardPadding, stubY + Math.round(14 * baseScale));

    // 2. Station Title
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

    if (options.stationSubtitle) {
      ctx.fillStyle = secondaryTextColor;
      ctx.font = `700 ${Math.round(20 * baseScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const subChineseY = line2 ? titleY + Math.round(62 * baseScale) : titleY + Math.round(30 * baseScale);
      ctx.fillText(options.stationSubtitle, cardPadding, subChineseY);
    }

    // 3. Metadata Row
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
    drawVerticalBarcode(
      ctx,
      barcodeX,
      barcodeY,
      barcodeWidth,
      barcodeHeight,
      options.ticketNo || '120458464677987155'
    );
  }

  const shouldRenderBackdrop =
    (options.backdropEnabled && options.backdropColor && options.backdropColor !== 'transparent') ||
    !transparentBackground;

  // Return transparent or paper background
  if (!shouldRenderBackdrop) {
    return {
      canvas: ticketCanvas,
      width: cardWidth,
      height: cardHeight,
      dataUrl: ticketCanvas.toDataURL('image/png'),
    };
  }

  // Render on paper/backdrop card background with soft shadow
  const padding = Math.round(56 * baseScale);
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = cardWidth + padding * 2;
  finalCanvas.height = cardHeight + padding * 2;
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    throw new Error('Failed to get 2d context for final ticket canvas');
  }

  const bgCardColor = (options.backdropEnabled && options.backdropColor) ? options.backdropColor : paperColor;
  finalCtx.fillStyle = bgCardColor;
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  finalCtx.save();
  finalCtx.shadowColor = 'rgba(40, 30, 20, 0.22)';
  finalCtx.shadowBlur = Math.round(26 * baseScale);
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
