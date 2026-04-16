import React from 'react';
import { motion } from 'motion/react';
import { Download, ChevronLeft } from 'lucide-react';
import HighlightedQuote from '../HighlightedQuote';
import type { CarouselItem } from './Step2Images';
import type { CarouselSettings } from '../../hooks/useCarouselSettings';
import type { LogoPosition, QuotePosition, AspectRatio } from '../../utils/canvas';

const ASPECT_PREVIEW_CLASS: Record<AspectRatio, string> = {
  '1:1':  'aspect-square',
  '4:3':  'aspect-[4/3]',
  '3:4':  'aspect-[3/4]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

interface Props {
  items: CarouselItem[];
  logo: string | null;
  settings: CarouselSettings;
  onDownloadOne: (index: number) => void;
  onDownloadAll: () => void;
  onBack: () => void;
  stepNumber?: number;
}

const logoPositionClass: Record<LogoPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

const quoteAlignClass: Record<QuotePosition, string> = {
  top: 'justify-start pt-12',
  center: 'justify-center',
  bottom: 'justify-end pb-12',
};

export default function Step3Download({ items, logo, settings, onDownloadOne, onDownloadAll, onBack, stepNumber = 3 }: Props) {
  const { textColor, highlightColor, fontFamily, fontSize, logoPosition, logoSize, quotePosition, quoteBgColor, quoteBgOpacity, aspectRatio, textAlign } = settings;

  const filledItems = items.map((item, originalIndex) => ({ item, originalIndex })).filter(({ item }) => item.image && item.quote.trim());

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 border border-neutral-100 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
            <Download className="text-emerald-600" />
            Bước {stepNumber}: Hoàn tất & Tải về
          </h2>
          <button onClick={onBack} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filledItems.map(({ item, originalIndex }) => (
            <div key={originalIndex} className={`group relative ${ASPECT_PREVIEW_CLASS[aspectRatio]} rounded-2xl overflow-hidden shadow-md border border-neutral-100 dark:border-neutral-700`}>
              <img src={item.image!} alt="Final" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-black/40 p-8 flex flex-col text-center ${quoteAlignClass[quotePosition]}`}>
                {logo && (
                  <div className={`absolute p-4 pointer-events-none ${logoPositionClass[logoPosition]}`}>
                    <img src={logo} alt="Logo" style={{ width: `${logoSize / 4}px` }} className="object-contain" />
                  </div>
                )}
                <HighlightedQuote
                  quote={item.quote}
                  keywords={item.keywords}
                  selectedIndices={item.selectedIndices}
                  textColor={textColor}
                  highlightColor={highlightColor}
                  fontFamily={fontFamily}
                  fontSize={fontSize / 4.5}
                  quoteBgColor={quoteBgColor}
                  quoteBgOpacity={quoteBgOpacity}
                  textAlign={textAlign}
                />
              </div>
              <button
                onClick={() => onDownloadOne(originalIndex)}
                className="absolute bottom-4 right-4 p-3 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onDownloadAll}
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xl shadow-xl shadow-emerald-200 dark:shadow-emerald-900/30 transition-all flex items-center justify-center gap-3"
        >
          <Download size={24} />
          Tải xuống tất cả ({filledItems.length} ảnh)
        </button>
      </div>
    </motion.div>
  );
}
