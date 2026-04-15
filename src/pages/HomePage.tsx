import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, PenLine, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto w-full px-4 md:px-6 flex items-center justify-between py-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight font-serif">CarouselAI</span>
        </div>
        <a
          href="https://www.facebook.com/iamNCD"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all text-sm font-semibold"
        >
          Liên hệ
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-6 flex flex-col items-center justify-center text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6"
        >
          <Sparkles size={16} />
          AI Powered Carousel Creator
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-4 font-serif"
        >
          Carousel Content
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-500 max-w-lg mb-14 text-lg"
        >
          Tạo nội dung carousel chuyên nghiệp chỉ trong vài bước. Chọn cách bạn muốn bắt đầu.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/carousel-ai-content"
              className="group flex flex-col items-start p-8 bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 hover:shadow-emerald-200/60 hover:border-emerald-200 transition-all text-left"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">AI Tạo Trích Dẫn</h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Nhập chủ đề, để AI tự động tạo 5 câu trích dẫn sâu sắc và hình ảnh minh họa.
              </p>
              <span className="mt-5 text-emerald-600 font-bold text-sm group-hover:underline">
                Bắt đầu →
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/carousel-custom-content"
              className="group flex flex-col items-start p-8 bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 hover:shadow-neutral-300/60 hover:border-neutral-300 transition-all text-left"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-600 mb-5 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <PenLine size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">Tự Nhập Nội Dung</h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Tự tải ảnh và nhập text của bạn vào từng slide. Toàn quyền kiểm soát nội dung.
              </p>
              <span className="mt-5 text-neutral-700 font-bold text-sm group-hover:underline">
                Bắt đầu →
              </span>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Floating feedback */}
      <a
        href="https://www.facebook.com/iamNCD"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all font-bold text-sm"
      >
        <MessageSquare size={18} />
        <span className="hidden sm:inline">Góp ý & Yêu cầu</span>
        <span className="sm:hidden">Góp ý</span>
      </a>

      <footer className="py-6 text-center text-neutral-400 text-sm border-t border-neutral-100">
        &copy; 2026 Carousel Content Website Creator • Created by NCD
      </footer>
    </div>
  );
}
