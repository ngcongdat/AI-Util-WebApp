import React, { useState, useRef } from 'react';
import AppNav from '../components/AppNav';
import AppFooter from '../components/AppFooter';
import FeedbackModal from '../components/FeedbackModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  icon: string;
  label: string;
  desc: string;
  context: string;
}

interface Script {
  title: string;
  hook: string;
  body: string;
  cta: string;
}

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string | object[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOPICS: Topic[] = [
  {
    id: 'noi-dau',
    icon: '😰',
    label: 'Nỗi Đau chủ quán',
    desc: 'Những vấn đề khiến chủ quán mất ngủ',
    context:
      'nỗi đau, lo lắng, khó khăn thực tế của chủ quán F&B: mất khách, cạnh tranh, chi phí cao, không ai nhớ tên quán, doanh thu giảm, khách không quay lại',
  },
  {
    id: 'casestudy',
    icon: '📈',
    label: 'Case Study thành công',
    desc: 'Câu chuyện quán nhỏ lên đời',
    context:
      'câu chuyện thành công thực tế hoặc lấy cảm hứng từ thực tế của các quán F&B nhỏ tại Việt Nam: từ không ai biết đến xây dựng được thương hiệu, tăng doanh thu nhờ thay đổi nhận diện, bao bì',
  },
  {
    id: 'sai-lam',
    icon: '⚠️',
    label: 'Sai lầm phổ biến',
    desc: 'Những lỗi chủ quán thường mắc phải',
    context:
      'sai lầm phổ biến của chủ quán F&B mới: dùng ly trắng trơn, không xây brand, chạy giảm giá liên tục, copy đối thủ, bỏ qua bao bì và nhận diện thương hiệu',
  },
  {
    id: 'xu-huong',
    icon: '📊',
    label: 'Xu hướng F&B',
    desc: 'Trend mới nhất trong ngành đồ uống',
    context:
      'xu hướng mới nhất ngành F&B Việt Nam và thế giới: Gen Z, eco-friendly, unboxing experience, social media, personalization, micro-brand, video marketing',
  },
  {
    id: 'tam-ly',
    icon: '🧠',
    label: 'Tâm lý khách hàng',
    desc: 'Hiểu khách để bán hàng tốt hơn',
    context:
      'tâm lý học ứng dụng trong F&B: tại sao khách chụp ảnh ly, hiệu ứng hào quang, color psychology, FOMO, quyết định mua hàng bằng cảm xúc, brand loyalty',
  },
  {
    id: 'chi-phi',
    icon: '💰',
    label: 'Tối ưu chi phí',
    desc: 'Tiết kiệm thông minh cho quán nhỏ',
    context:
      'bài toán chi phí và ROI cho quán F&B nhỏ: so sánh chi phí quảng cáo vs in logo lên ly, đầu tư thông minh, marketing chi phí thấp, tối ưu ngân sách',
  },
  {
    id: 'branding',
    icon: '🎨',
    label: 'Xây dựng thương hiệu',
    desc: 'Từ quán nhỏ thành brand mạnh',
    context:
      'xây dựng thương hiệu F&B từ con số 0: nhận diện thương hiệu, brand identity, thiết kế logo, màu sắc thương hiệu, brand story, sự nhất quán trong branding',
  },
  {
    id: 'mang-xa-hoi',
    icon: '📱',
    label: 'Marketing mạng xã hội',
    desc: 'Viral trên TikTok, Instagram, Facebook',
    context:
      'marketing mạng xã hội cho quán F&B: tạo content viral trên TikTok, Instagram story, UGC (user-generated content), khách tự chụp ảnh ly đẹp đăng mạng, social proof',
  },
];

const SYSTEM_PROMPT = `Bạn là một chuyên gia viết script video ngắn cho ngành in ấn ly nhựa, ly trà sữa, ly giấy phục vụ ngành F&B.

NHIỆM VỤ: Viết 1 script video 35-50 giây, gồm 3 phần rõ ràng.

QUY TẮC BẮT BUỘC:
1. HOOK (5 giây, KHOẢNG 100 KÝ TỰ): Câu mở đầu gây sốc, tạo tò mò, khiến người xem dừng lướt. Đánh trúng nỗi đau hoặc sự tò mò. Viết như đang nói chuyện trực tiếp với chủ quán F&B. BẮT BUỘC khoảng 100 ký tự.

2. THÂN (30-40 giây, KHOẢNG 900 KÝ TỰ): Kể chuyện cuốn hút theo dạng storytelling. Đưa ra insight, số liệu, ví dụ thực tế. Ở CUỐI phần thân phải lồng ghép tự nhiên dịch vụ IN ẤN LOGO LÊN LY (ly nhựa, ly trà sữa, ly giấy) như một giải pháp — KHÔNG quảng cáo lộ liễu, phải tự nhiên như lời khuyên chân thành. BẮT BUỘC khoảng 900 ký tự.

3. KẾT (5 giây): Kêu gọi hành động ngắn gọn, mạnh mẽ (inbox, comment, liên hệ).

YÊU CẦU PHONG CÁCH:
- Giọng văn tự nhiên, gần gũi, như đang trò chuyện với chủ quán
- Dùng ngôn ngữ đời thường, dễ hiểu, có cảm xúc
- Nội dung phải MỚI, SÁNG TẠO, không lặp lại các khuôn mẫu cũ
- Có thể đề cập đến các thương hiệu F&B nổi tiếng tại Việt Nam làm ví dụ
- Nếu có thông tin từ web search, hãy lồng ghép data/trend thực tế vào script

FORMAT TRẢ VỀ (JSON thuần, không markdown):
{
  "title": "Tiêu đề ngắn gọn",
  "hook": "Nội dung hook khoảng 100 ký tự",
  "body": "Nội dung thân khoảng 900 ký tự (xuống dòng bằng \\n\\n)",
  "cta": "Nội dung kết 5 giây"
}

CHỈ trả về 1 JSON object duy nhất, KHÔNG có markdown backticks, KHÔNG có text giải thích.`;

// ─── API ──────────────────────────────────────────────────────────────────────

async function callAPI(messages: ApiMessage[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${errBody.slice(0, 200)}`);
  }
  return response.json();
}

function extractScript(data: { content: { type: string; text?: string }[] }): Script | null {
  const textParts = data.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text ?? '')
    .join('\n');
  const clean = textParts.replace(/```json|```/g, '').trim();

  const objMatch = clean.match(/\{[\s\S]*?\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed.hook && parsed.body && parsed.cta) return parsed as Script;
    } catch {}
  }

  const arrMatch = clean.match(/\[[\s\S]*?\]/);
  if (arrMatch) {
    try {
      const parsed = JSON.parse(arrMatch[0]);
      if (Array.isArray(parsed) && parsed[0]?.hook) return parsed[0] as Script;
    } catch {}
  }
  return null;
}

async function generateWithAI(topic: Topic): Promise<Script> {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const randomSeed = Math.random().toString(36).substring(2, 10);

  const userPrompt = `Hôm nay là ${today}. Seed: ${randomSeed}.

Chủ đề: "${topic.label}" — ${topic.context}

Hãy tìm kiếm thông tin mới nhất về ngành F&B Việt Nam, xu hướng đồ uống, câu chuyện kinh doanh quán cafe/trà sữa để lấy cảm hứng. Sau đó viết 1 script video hoàn toàn mới, sáng tạo.

Script phải có góc nhìn độc đáo và lồng ghép dịch vụ in ấn logo lên ly một cách tự nhiên. Hook khoảng 100 ký tự, thân khoảng 900 ký tự.`;

  const messages: ApiMessage[] = [{ role: 'user', content: userPrompt }];
  let data = await callAPI(messages);
  let rounds = 0;

  while (data.stop_reason === 'tool_use' && rounds < 5) {
    rounds++;
    messages.push({ role: 'assistant', content: data.content });
    const toolResults = data.content
      .filter((block: { type: string }) => block.type === 'tool_use')
      .map((block: { id: string }) => ({
        type: 'tool_result',
        tool_use_id: block.id,
        content: 'Search completed. Now write the 1 script as JSON object.',
      }));
    messages.push({ role: 'user', content: toolResults });
    data = await callAPI(messages);
  }

  const script = extractScript(data);
  if (script) return script;

  const allText =
    data.content?.filter((i: { type: string }) => i.type === 'text').map((i: { text: string }) => i.text).join('') || '';
  throw new Error('Parse failed: ' + allText.slice(0, 300));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="w-11 h-11 rounded-full border-[3px] border-amber-400/10 border-t-amber-400 animate-spin" />
      <div className="text-center">
        <p className="text-sm text-neutral-600 dark:text-white/65 font-medium mb-1">AI đang sáng tạo script...</p>
        <p className="text-[11px] text-neutral-400 dark:text-white/25">Tìm kiếm trend mới nhất & viết nội dung</p>
      </div>
    </div>
  );
}

interface ScriptCardProps {
  script: Script;
  copied: boolean;
  onCopy: (text: string) => void;
}

function ScriptCard({ script, copied, onCopy }: ScriptCardProps) {
  const fullText = `${script.title}\n\nHOOK (5s):\n${script.hook}\n\nTHÂN (30-40s):\n${script.body}\n\nKẾT (5s):\n${script.cta}`;

  return (
    <div className="relative bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-5 mb-3.5 overflow-hidden shadow-sm dark:shadow-none">
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 to-orange-500" />

      <div className="flex justify-between items-start gap-3 mb-4">
        <p className="text-sm font-semibold text-neutral-800 dark:text-white/88 leading-snug">{script.title}</p>
        <button
          onClick={() => onCopy(fullText)}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all border ${
            copied
              ? 'bg-green-400/12 border-green-400/25 text-green-600 dark:text-green-400'
              : 'bg-neutral-100 dark:bg-white/[0.04] border-neutral-200 dark:border-white/[0.08] text-neutral-500 dark:text-white/45 hover:text-neutral-700 dark:hover:text-white/70'
          }`}
        >
          {copied ? '✓ Done' : '⎘ Copy'}
        </button>
      </div>

      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">⏱ Hook · 5s</span>
        <span className="text-[9px] text-neutral-400 dark:text-white/20">{script.hook?.length ?? 0} ký tự</span>
      </div>
      <p className="text-[13.5px] text-amber-800 dark:text-amber-100 leading-relaxed italic pl-3 border-l-2 border-amber-400/30 mb-4">
        {script.hook}
      </p>

      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">📖 Thân · 30-40s</span>
        <span className="text-[9px] text-neutral-400 dark:text-white/20">{script.body?.length ?? 0} ký tự</span>
      </div>
      <p className="text-[13px] text-neutral-700 dark:text-white/72 leading-[1.75] whitespace-pre-line mb-4">
        {script.body}
      </p>

      <div className="mb-1.5">
        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 tracking-widest uppercase">🎯 Kết · 5s</span>
      </div>
      <p className="text-[13.5px] text-green-800 dark:text-green-200 leading-relaxed font-medium pl-3 border-l-2 border-green-400/30">
        {script.cta}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FnbShortScriptPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDate, setGeneratedDate] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setScript(null);
    setCopied(false);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedTopic || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setCopied(false);
    setScript(null);

    try {
      const result = await generateWithAI(selectedTopic);
      setScript(result);
      setGeneratedDate(
        new Date().toLocaleDateString('vi-VN', {
          weekday: 'long', day: 'numeric', month: 'numeric',
          year: 'numeric', hour: '2-digit', minute: '2-digit',
        })
      );
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError('Không thể tạo script: ' + msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#09090b] text-neutral-900 dark:text-white flex flex-col">
      {/* Nav */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <AppNav onFeedbackOpen={() => setIsFeedbackOpen(true)} />
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Hero header */}
      <div className="bg-gradient-to-b from-amber-500/5 to-transparent border-b border-neutral-200 dark:border-white/[0.04] py-7 px-5 text-center">
        <p className="text-[10.5px] text-amber-600 dark:text-amber-400/65 tracking-[2.5px] uppercase font-semibold mb-2">
          AI Script Generator
        </p>
        <h1 className="text-[22px] font-bold leading-snug bg-gradient-to-br from-neutral-900 via-neutral-700 to-amber-700 dark:from-white dark:via-white dark:to-amber-400 bg-clip-text text-transparent">
          Tạo Script Video F&B
        </h1>
        <p className="text-[12.5px] text-neutral-500 dark:text-white/30 mt-1">In ấn ly nhựa · Ly trà sữa · Ly giấy</p>
        <div className="inline-flex items-center gap-1.5 mt-3 bg-green-50 dark:bg-green-400/[0.07] border border-green-200 dark:border-green-400/[0.12] px-2.5 py-1 rounded-full text-[10px] text-green-600 dark:text-green-400/65">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          AI + Web Search · Nội dung mới mỗi lần
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-5 max-w-xl mx-auto w-full">

        <p className="text-[10.5px] text-neutral-500 dark:text-white/25 tracking-[1.8px] uppercase font-semibold mb-2.5">Chọn chủ đề</p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className={`rounded-xl p-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/[0.06] border border-amber-300 dark:border-amber-400/30'
                    : 'bg-white dark:bg-white/[0.015] border border-neutral-200 dark:border-white/5 hover:border-amber-300 dark:hover:border-amber-400/20'
                }`}
              >
                <div className="text-xl mb-1">{topic.icon}</div>
                <div className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-700 dark:text-white/75'}`}>
                  {topic.label}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-white/25">{topic.desc}</div>
              </button>
            );
          })}
        </div>

        {selectedTopic && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm mb-6 transition-all ${
              isGenerating
                ? 'bg-amber-100 dark:bg-amber-500/[0.07] text-amber-400 dark:text-amber-400/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90 cursor-pointer'
            }`}
          >
            {isGenerating ? '⏳ Đang tạo...' : `✨ Tạo Script · ${selectedTopic.label}`}
          </button>
        )}

        {isGenerating && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 dark:bg-red-500/[0.08] border border-red-200 dark:border-red-500/[0.18] rounded-xl p-4 mb-5 text-center">
            <p className="text-[12.5px] text-red-600 dark:text-red-300">{error}</p>
            <button
              onClick={handleGenerate}
              className="mt-3 px-3.5 py-1.5 bg-red-100 dark:bg-red-500/12 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-300 rounded-lg text-[11px] cursor-pointer hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
            >
              🔄 Thử lại
            </button>
          </div>
        )}

        {script && (
          <div ref={resultsRef} className="animate-[fadeUp_0.4s_ease-out]">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-[10.5px] text-neutral-500 dark:text-white/25 tracking-[1.8px] uppercase font-semibold">Script của bạn</p>
                {generatedDate && <p className="text-[9.5px] text-neutral-400 dark:text-white/15 mt-0.5">{generatedDate}</p>}
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.07] text-neutral-600 dark:text-white/40 rounded-lg text-[10.5px] cursor-pointer hover:text-neutral-800 dark:hover:text-white/60 transition-colors disabled:opacity-50"
              >
                🔁 Tạo mới
              </button>
            </div>

            <ScriptCard script={script} copied={copied} onCopy={handleCopy} />

            <p className="text-center py-4 text-[10px] text-neutral-400 dark:text-white/12 leading-relaxed">
              Mỗi lần bấm "Tạo mới" → AI viết script hoàn toàn mới
              <br />Có web search cập nhật trend thực tế
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-neutral-900">
        <AppFooter />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
