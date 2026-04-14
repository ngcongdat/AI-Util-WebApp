import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: Props) {
  const [feedbackText, setFeedbackText] = useState('');

  const handleSend = () => {
    if (!feedbackText.trim()) return;
    const subject = encodeURIComponent('Feedback & Yêu cầu tính năng - CarouselAI');
    const body = encodeURIComponent(feedbackText);
    window.location.href = `mailto:phannho123@gmail.com?subject=${subject}&body=${body}`;
    onClose();
    setFeedbackText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="text-emerald-600" />
                Gửi góp ý & Yêu cầu
              </h3>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
                <Plus className="rotate-45" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              Ý kiến của bạn giúp chúng tôi hoàn thiện ứng dụng hơn. Vui lòng nhập góp ý hoặc yêu cầu tính năng mới bên dưới.
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập nội dung tại đây..."
              className="w-full h-32 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!feedbackText.trim()}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:bg-neutral-200 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Gửi qua Email
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
