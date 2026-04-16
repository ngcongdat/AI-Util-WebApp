import React, { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  RefreshCw,
  Trash2,
  Loader2,
  Plus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react';
import HighlightedQuote from '../HighlightedQuote';
import type { CarouselSettings } from '../../hooks/useCarouselSettings';
import type { LogoPosition, QuotePosition, AspectRatio, TextAlign } from '../../utils/canvas';

const ASPECT_PREVIEW_CLASS: Record<AspectRatio, string> = {
  '1:1':  'aspect-square',
  '4:3':  'aspect-[4/3]',
  '3:4':  'aspect-[3/4]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

export interface CarouselItem {
  quote: string;
  keywords: string[];
  selectedIndices?: number[];
  image: string | null;
  isGenerating?: boolean;
}

const FONTS = [
  { name: 'Inter (Sans)', value: 'Inter' },
  { name: 'Playfair (Serif)', value: 'Playfair Display' },
  { name: 'System Mono', value: 'monospace' },
];

interface Props {
  items: CarouselItem[];
  setItems: (items: CarouselItem[]) => void;
  logo: string | null;
  setLogo: (v: string | null) => void;
  settings: CarouselSettings;
  isLoading: boolean;
  generationProgress: number;
  onGenerateSingleAI: (index: number) => void;
  onGenerateRestWithAI: (startIndex: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Images({
  items, setItems, logo, setLogo,
  settings, isLoading, generationProgress,
  onGenerateSingleAI, onGenerateRestWithAI, onBack, onNext,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    textColor, setTextColor,
    highlightColor, setHighlightColor,
    fontFamily, setFontFamily,
    logoPosition, setLogoPosition,
    logoSize, setLogoSize,
    quotePosition, setQuotePosition,
    fontSize, setFontSize,
    quoteBgColor, setQuoteBgColor,
    quoteBgOpacity, setQuoteBgOpacity,
    aspectRatio, setAspectRatio,
    textAlign, setTextAlign,
  } = settings;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (index !== undefined) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const next = [...items];
        next[index].image = event.target?.result as string;
        setItems(next);
      };
      reader.readAsDataURL(files[0]);
    } else {
      Array.from<File>(files).slice(0, 5).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setItems(
            items.map((item, i) =>
              i === idx ? { ...item, image: event.target?.result as string } : item
            )
          );
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogo(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const logoPositionClass: Record<LogoPosition, string> = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  const quoteAlignClass: Record<QuotePosition, string> = {
    top: 'justify-start pt-4',
    center: 'justify-center',
    bottom: 'justify-end pb-4',
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 border border-neutral-100 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
            <ImageIcon className="text-emerald-600" />
            Bước 2: Hình ảnh minh họa
          </h2>
          <button onClick={onBack} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Quay lại
          </button>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className={`${ASPECT_PREVIEW_CLASS[aspectRatio]} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
                item.image ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-400'
              }`}>
                {item.isGenerating ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">AI Generating</span>
                  </div>
                ) : item.image ? (
                  <>
                    <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                    {logo && (
                      <div className={`absolute p-2 pointer-events-none ${logoPositionClass[logoPosition]}`}>
                        <img src={logo} alt="Logo" style={{ width: `${logoSize / 10}px` }} className="object-contain" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-black/30 p-4 flex flex-col text-center pointer-events-none ${quoteAlignClass[quotePosition]}`}>
                      <HighlightedQuote
                        quote={item.quote}
                        keywords={item.keywords}
                        textColor={textColor}
                        highlightColor={highlightColor}
                        fontFamily={fontFamily}
                        fontSize={fontSize / 6.4}
                        quoteBgColor={quoteBgColor}
                        quoteBgOpacity={quoteBgOpacity}
                        textAlign={textAlign}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => onGenerateSingleAI(index)} title="Tạo lại ảnh bằng AI" className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-emerald-500 transition-colors">
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => setItems(items.map((it, i) => i === index ? { ...it, image: null } : it))}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 p-4 text-center">
                    <Upload size={20} className="text-neutral-400 dark:text-neutral-500" />
                    <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">Tải ảnh {index + 1}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic">"{item.quote}"</p>
            </div>
          ))}
        </div>

        {/* Settings panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700">
          <div className="space-y-2 md:col-span-3 lg:col-span-4">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Tỷ lệ khung hình</label>
            <div className="flex gap-2">
              {(['1:1', '4:3', '3:4', '16:9', '9:16'] as AspectRatio[]).map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
                    aspectRatio === ratio
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 dark:shadow-emerald-900/30'
                      : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600 hover:border-emerald-400'
                  }`}
                >
                  <span className={`inline-block border-2 rounded-sm ${aspectRatio === ratio ? 'border-white' : 'border-neutral-400 dark:border-neutral-500'}`}
                    style={{
                      width: ratio === '1:1' ? 14 : ratio === '3:4' ? 12 : ratio === '9:16' ? 10 : ratio === '4:3' ? 18 : 22,
                      height: ratio === '1:1' ? 14 : ratio === '3:4' ? 16 : ratio === '9:16' ? 18 : ratio === '4:3' ? 13 : 12,
                    }}
                  />
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Màu chữ</label>
            <div className="flex items-center gap-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-none" />
              <span className="text-sm font-mono dark:text-neutral-300">{textColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Màu nổi bật</label>
            <div className="flex items-center gap-2">
              <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-none" />
              <span className="text-sm font-mono dark:text-neutral-300">{highlightColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-2">
              Nền trích dẫn
              <input
                type="checkbox"
                checked={!!quoteBgColor}
                onChange={(e) => setQuoteBgColor(e.target.checked ? '#000000' : null)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={quoteBgColor ?? '#000000'}
                onChange={(e) => setQuoteBgColor(e.target.value)}
                disabled={!quoteBgColor}
                className="w-10 h-10 rounded-lg cursor-pointer border-none disabled:opacity-30"
              />
              <span className="text-sm font-mono dark:text-neutral-300">{quoteBgColor ?? 'tắt'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">
              Độ mờ nền: {quoteBgOpacity}%
            </label>
            <input
              type="range" min="10" max="100" value={quoteBgOpacity}
              onChange={(e) => setQuoteBgOpacity(parseInt(e.target.value))}
              disabled={!quoteBgColor}
              className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Font chữ</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Căn chỉnh chữ</label>
            <div className="flex gap-1">
              {([
                { value: 'left',    Icon: AlignLeft },
                { value: 'center',  Icon: AlignCenter },
                { value: 'right',   Icon: AlignRight },
                { value: 'justify', Icon: AlignJustify },
              ] as { value: TextAlign; Icon: React.ElementType }[]).map(({ value, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTextAlign(value)}
                  className={`flex-1 flex items-center justify-center py-2 rounded-lg border-2 transition-all ${
                    textAlign === value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-600 hover:border-emerald-400'
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Vị trí trích dẫn</label>
            <select value={quotePosition} onChange={(e) => setQuotePosition(e.target.value as QuotePosition)} className="w-full p-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="top">Góc trên</option>
              <option value="center">Ở giữa</option>
              <option value="bottom">Góc dưới</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Vị trí Logo</label>
            <select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value as LogoPosition)} className="w-full p-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="top-left">Trên - Trái</option>
              <option value="top-right">Trên - Phải</option>
              <option value="bottom-left">Dưới - Trái</option>
              <option value="bottom-right">Dưới - Phải</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Kích thước Logo: {logoSize}px</label>
            <input type="range" min="40" max="300" value={logoSize} onChange={(e) => setLogoSize(parseInt(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Kích thước chữ: {fontSize}px</label>
            <input type="range" min="30" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>
        </div>

        {/* Logo upload */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Logo thương hiệu (Tùy chọn)</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => logoInputRef.current?.click()}
                className={`flex-1 py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${
                  logo ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-neutral-200 dark:border-neutral-600 hover:border-emerald-300 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {logo ? <ImageIcon size={18} /> : <Plus size={18} />}
                {logo ? 'Đã tải logo' : 'Tải Logo'}
                <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </button>
              {logo && (
                <button onClick={() => setLogo(null)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            Tải lên 5 ảnh khác nhau
            <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
          </button>
          <button
            disabled={!items[0]?.image || isLoading}
            onClick={() => onGenerateRestWithAI(0)}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
            Dùng AI tạo 4 ảnh còn lại
          </button>
        </div>

        {isLoading && generationProgress > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-emerald-600 mb-2 uppercase tracking-widest">
              <span>Đang tạo ảnh bằng AI...</span>
              <span>{generationProgress}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={!items.some(i => i.image)}
          onClick={onNext}
          className="px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-all"
        >
          Tiếp tục <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
