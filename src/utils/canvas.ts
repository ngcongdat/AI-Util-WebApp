import { isKeyword } from './keywords';

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type QuotePosition = 'top' | 'center' | 'bottom';
export type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

const CANVAS_SIZES: Record<AspectRatio, { width: number; height: number }> = {
  '1:1':  { width: 1080, height: 1080 },
  '4:3':  { width: 1440, height: 1080 },
  '3:4':  { width: 1080, height: 1440 },
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
};

export interface DownloadOptions {
  quote: string;
  keywords: string[];
  selectedIndices?: number[];
  image: string;
  logo: string | null;
  textColor: string;
  highlightColor: string;
  fontFamily: string;
  fontSize: number;
  logoPosition: LogoPosition;
  logoSize: number;
  quotePosition: QuotePosition;
  filename: string;
  quoteBgColor?: string | null;
  quoteBgOpacity?: number;
  aspectRatio?: AspectRatio;
  textAlign?: TextAlign;
}

export function downloadCarouselImage(opts: DownloadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
  const {
    quote, keywords, selectedIndices, image, logo,
    textColor, highlightColor, fontFamily, fontSize,
    logoPosition, logoSize, quotePosition, filename,
    quoteBgColor, quoteBgOpacity,
    aspectRatio = '1:1',
    textAlign = 'center',
  } = opts;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { resolve(); return; }

  const { width: canvasW, height: canvasH } = CANVAS_SIZES[aspectRatio];
  canvas.width = canvasW;
  canvas.height = canvasH;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onerror = reject;
  img.onload = () => {
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const finish = () => {
      drawText(ctx, quote, keywords, selectedIndices, textColor, highlightColor, fontFamily, fontSize, quotePosition, canvas.width, canvas.height, quoteBgColor, quoteBgOpacity, textAlign);
      triggerDownload(canvas, filename);
      resolve();
    };

    if (logo) {
      const logoImg = new Image();
      logoImg.onerror = reject;
      logoImg.onload = () => {
        drawLogo(ctx, logoImg, logoPosition, logoSize, canvas.width, canvas.height);
        finish();
      };
      logoImg.src = logo;
    } else {
      finish();
    }
  };
  img.src = image;
  }); // close Promise
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  position: LogoPosition,
  logoSize: number,
  canvasW: number,
  canvasH: number,
) {
  const padding = Math.round(canvasW * 0.055);
  const scale = Math.min(logoSize / logoImg.width, logoSize / logoImg.height);
  const lw = logoImg.width * scale;
  const lh = logoImg.height * scale;

  let lx = padding;
  let ly = padding;
  if (position === 'top-right') lx = canvasW - lw - padding;
  else if (position === 'bottom-left') ly = canvasH - lh - padding;
  else if (position === 'bottom-right') { lx = canvasW - lw - padding; ly = canvasH - lh - padding; }

  ctx.drawImage(logoImg, lx, ly, lw, lh);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  quote: string,
  keywords: string[],
  selectedIndices: number[] | undefined,
  textColor: string,
  highlightColor: string,
  fontFamily: string,
  fontSize: number,
  quotePosition: QuotePosition,
  canvasW: number,
  canvasH: number,
  quoteBgColor?: string | null,
  quoteBgOpacity?: number,
  textAlign: TextAlign = 'center',
) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px "${fontFamily}"`;

  const lineHeight = fontSize * 1.4;
  const maxWidth = Math.round(canvasW * 0.79);
  const leftEdge = (canvasW - maxWidth) / 2;
  const rightEdge = (canvasW + maxWidth) / 2;
  const lines: string[][] = [];
  const lineStartIndices: number[] = [];
  const linesLastInParagraph: boolean[] = [];
  let absoluteWordCount = 0;

  quote.split('\n').forEach(paragraph => {
    const paraWords = paragraph.split(' ').filter(w => w.length > 0);

    if (paraWords.length === 0) {
      lineStartIndices.push(absoluteWordCount);
      lines.push([]);
      linesLastInParagraph.push(true);
      return;
    }

    let currentLine: string[] = [];
    paraWords.forEach(word => {
      const testLine = [...currentLine, word].join(' ');
      if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
        lineStartIndices.push(absoluteWordCount);
        absoluteWordCount += currentLine.length;
        lines.push(currentLine);
        linesLastInParagraph.push(false);
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });
    lineStartIndices.push(absoluteWordCount);
    absoluteWordCount += currentLine.length;
    lines.push(currentLine);
    linesLastInParagraph.push(true);
  });

  const totalHeight = lines.length * lineHeight;
  let startY = (canvasH - totalHeight) / 2 + lineHeight / 2;
  if (quotePosition === 'top') startY = 200 + lineHeight / 2;
  else if (quotePosition === 'bottom') startY = canvasH - 200 - totalHeight + lineHeight / 2;

  if (quoteBgColor) {
    const padX = 48;
    const padY = 24;
    const bgW = maxWidth + padX * 2;
    const bgX = (canvasW - bgW) / 2;
    const bgY = startY - lineHeight / 2 - padY;
    const bgH = totalHeight + padY * 2;
    const radius = 16;
    ctx.fillStyle = hexToRgba(quoteBgColor, quoteBgOpacity ?? 70);
    ctx.beginPath();
    ctx.moveTo(bgX + radius, bgY);
    ctx.lineTo(bgX + bgW - radius, bgY);
    ctx.arcTo(bgX + bgW, bgY, bgX + bgW, bgY + radius, radius);
    ctx.lineTo(bgX + bgW, bgY + bgH - radius);
    ctx.arcTo(bgX + bgW, bgY + bgH, bgX + bgW - radius, bgY + bgH, radius);
    ctx.lineTo(bgX + radius, bgY + bgH);
    ctx.arcTo(bgX, bgY + bgH, bgX, bgY + bgH - radius, radius);
    ctx.lineTo(bgX, bgY + radius);
    ctx.arcTo(bgX, bgY, bgX + radius, bgY, radius);
    ctx.closePath();
    ctx.fill();
  }

  const spaceWidth = ctx.measureText(' ').width;

  lines.forEach((lineWords, lineIdx) => {
    if (lineWords.length === 0) {
      startY += lineHeight;
      return;
    }

    const isLastInParagraph = linesLastInParagraph[lineIdx];
    const wordWidths = lineWords.map(w => ctx.measureText(w).width);
    const totalWordWidth = wordWidths.reduce((a, b) => a + b, 0);
    const lineWidth = totalWordWidth + spaceWidth * (lineWords.length - 1);

    let currentX: number;
    let wordSpacing: number;

    if (textAlign === 'right') {
      currentX = rightEdge - lineWidth;
      wordSpacing = spaceWidth;
    } else if (textAlign === 'justify' && !isLastInParagraph && lineWords.length > 1) {
      currentX = leftEdge;
      wordSpacing = (maxWidth - totalWordWidth) / (lineWords.length - 1);
    } else if (textAlign === 'left' || (textAlign === 'justify' && (isLastInParagraph || lineWords.length <= 1))) {
      currentX = leftEdge;
      wordSpacing = spaceWidth;
    } else {
      // center (default)
      currentX = (canvasW - lineWidth) / 2;
      wordSpacing = spaceWidth;
    }

    const lineStartIdx = lineStartIndices[lineIdx];
    lineWords.forEach((word, wordIdx) => {
      const absoluteIdx = lineStartIdx + wordIdx;
      const highlighted = selectedIndices !== undefined
        ? selectedIndices.includes(absoluteIdx)
        : isKeyword(word, keywords);

      const ww = wordWidths[wordIdx];
      if (highlighted) {
        ctx.fillStyle = highlightColor;
        ctx.fillRect(currentX - 5, startY - lineHeight / 2 + 10, ww + 10, lineHeight - 20);
      }
      ctx.fillStyle = textColor;
      ctx.fillText(word, currentX, startY);
      currentX += ww + (wordIdx < lineWords.length - 1 ? wordSpacing : 0);
    });

    startY += lineHeight;
  });
}

function triggerDownload(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
