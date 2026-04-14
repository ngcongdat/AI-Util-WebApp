import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  theme: string;
  setTheme: (v: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export default function Step1Theme({ theme, setTheme, isLoading, onGenerate }: Props) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-emerald-600" />
          Bước 1: Chọn chủ đề
        </h2>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700">Chủ đề của bạn là gì?</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && theme.trim() && onGenerate()}
            placeholder="Ví dụ: Động lực làm việc, Sống tối giản, Kỹ năng lãnh đạo..."
            className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg"
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !theme.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Tạo 5 câu trích dẫn
          </button>
        </div>
      </div>

      {/* Sample Section */}
      <div className="bg-neutral-100/50 p-8 rounded-3xl border border-dashed border-neutral-200">
        <h3 className="text-lg font-bold mb-4 text-neutral-600 flex items-center gap-2">
          <ImageIcon size={18} /> Kết quả mẫu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://picsum.photos/seed/business/1080/1080"
              alt="Sample 1"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8 text-center">
              <p className="text-white font-bold text-lg leading-relaxed">
                Kỷ luật là <span className="bg-emerald-500 px-1">cầu nối</span> giữa mục tiêu và thành tựu.
              </p>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white text-[10px] font-bold">LOGO</div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://picsum.photos/seed/nature/1080/1080"
              alt="Sample 2"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8 text-center">
              <p className="text-white font-bold text-lg leading-relaxed">
                Sự tĩnh lặng là nơi <span className="bg-emerald-500 px-1">trí tuệ</span> bắt đầu nảy nở.
              </p>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white text-[10px] font-bold">LOGO</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-neutral-500 italic text-center">
          * Ảnh tải về sẽ bao gồm Logo của bạn và các từ khóa quan trọng được làm nổi bật tự động.
        </p>
      </div>
    </motion.div>
  );
}
