import { isKeyword } from './keywords';

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type QuotePosition = 'top' | 'center' | 'bottom';

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
}

export function downloadCarouselImage(opts: DownloadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
  const {
    quote, keywords, selectedIndices, image, logo,
    textColor, highlightColor, fontFamily, fontSize,
    logoPosition, logoSize, quotePosition, filename,
  } = opts;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { resolve(); return; }

  canvas.width = 1080;
  canvas.height = 1080;

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
      drawText(ctx, quote, keywords, selectedIndices, textColor, highlightColor, fontFamily, fontSize, quotePosition, canvas.width, canvas.height);
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

function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  position: LogoPosition,
  logoSize: number,
  canvasW: number,
  canvasH: number,
) {
  const padding = 60;
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
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px "${fontFamily}"`;

  const lineHeight = fontSize * 1.4;
  const maxWidth = 850;
  const words = quote.split(' ');
  const lines: string[][] = [];
  const lineStartIndices: number[] = [];
  let currentLine: string[] = [];

  words.forEach(word => {
    const testLine = [...currentLine, word].join(' ');
    if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
      lineStartIndices.push(lines.reduce((acc, l) => acc + l.length, 0));
      lines.push(currentLine);
      currentLine = [word];
    } else {
      currentLine.push(word);
    }
  });
  lineStartIndices.push(lines.reduce((acc, l) => acc + l.length, 0));
  lines.push(currentLine);

  const totalHeight = lines.length * lineHeight;
  let startY = (canvasH - totalHeight) / 2 + lineHeight / 2;
  if (quotePosition === 'top') startY = 200 + lineHeight / 2;
  else if (quotePosition === 'bottom') startY = canvasH - 200 - totalHeight + lineHeight / 2;

  lines.forEach((lineWords, lineIdx) => {
    const lineText = lineWords.join(' ');
    const lineWidth = ctx.measureText(lineText).width;
    let startX = (canvasW - lineWidth) / 2;
    const lineStartIdx = lineStartIndices[lineIdx];

    lineWords.forEach((word, wordIdx) => {
      const absoluteIdx = lineStartIdx + wordIdx;
      const highlighted = selectedIndices !== undefined
        ? selectedIndices.includes(absoluteIdx)
        : isKeyword(word, keywords);

      ctx.font = `bold ${fontSize}px "${fontFamily}"`;
      const wordWidth = ctx.measureText(word + ' ').width;

      if (highlighted) {
        ctx.fillStyle = highlightColor;
        ctx.fillRect(startX - 5, startY - lineHeight / 2 + 10, wordWidth, lineHeight - 20);
        ctx.fillStyle = textColor;
      } else {
        ctx.fillStyle = textColor;
      }

      ctx.fillText(word, startX + wordWidth / 2 - ctx.measureText(' ').width / 2, startY);
      startX += wordWidth;
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
