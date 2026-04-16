import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare } from "lucide-react";
import AppNav from "./AppNav";
import AppFooter from "./AppFooter";
import { generateQuotes, generateImageFromReference } from "../services/gemini";
import { downloadCarouselImage } from "../utils/canvas";
import { useCarouselSettings } from "../hooks/useCarouselSettings";
import FeedbackModal from "./FeedbackModal";
import Step1Theme from "./steps/Step1Theme";
import Step2Images from "./steps/Step2Images";
import Step3Download from "./steps/Step3Download";
import type { CarouselItem } from "./steps/Step2Images";

export default function CarouselGenerator() {
    const [step, setStep] = useState(1);
    const [theme, setTheme] = useState("");
    const [logo, setLogo] = useState<string | null>(null);
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const settings = useCarouselSettings();
    const {
        textColor,
        highlightColor,
        fontFamily,
        fontSize,
        logoPosition,
        logoSize,
        quotePosition,
    } = settings;

    const handleGenerateQuotes = async () => {
        if (!theme.trim()) return;
        setIsLoading(true);
        try {
            const data = await generateQuotes(theme);
            setItems(
                data.map((d) => ({
                    quote: d.text,
                    keywords: d.keywords,
                    image: null,
                })),
            );
            setStep(2);
        } catch (err) {
            alert(
                `Có lỗi xảy ra khi tạo trích dẫn: ${err instanceof Error ? err.message : "Vui lòng thử lại."}`,
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSingleAI = async (index: number) => {
        const baseImage = items.find((item) => item.image)?.image;
        if (!baseImage) {
            alert("Vui lòng tải lên ít nhất một ảnh gốc để làm mẫu.");
            return;
        }
        setItems(
            items.map((it, i) =>
                i === index ? { ...it, isGenerating: true } : it,
            ),
        );
        try {
            const generated = await generateImageFromReference(
                baseImage,
                `Bối cảnh phù hợp với câu trích dẫn: "${items[index].quote}"`,
            );
            setItems((prev) =>
                prev.map((it, i) =>
                    i === index
                        ? { ...it, image: generated, isGenerating: false }
                        : it,
                ),
            );
        } catch {
            alert("Có lỗi xảy ra khi tạo ảnh bằng AI.");
            setItems((prev) =>
                prev.map((it, i) =>
                    i === index ? { ...it, isGenerating: false } : it,
                ),
            );
        }
    };

    const handleGenerateRestWithAI = async (startIndex: number) => {
        const baseImage = items[startIndex].image;
        if (!baseImage) return;
        setIsLoading(true);
        try {
            for (let i = 0; i < items.length; i++) {
                if (i === startIndex) continue;
                setItems((prev) =>
                    prev.map((it, idx) =>
                        idx === i ? { ...it, isGenerating: true } : it,
                    ),
                );
                setGenerationProgress(
                    Math.round(
                        ((i + (i < startIndex ? 1 : 0)) / (items.length - 1)) *
                            100,
                    ),
                );
                const generated = await generateImageFromReference(
                    baseImage,
                    `Bối cảnh phù hợp với câu trích dẫn: "${items[i].quote}"`,
                );
                setItems((prev) =>
                    prev.map((it, idx) =>
                        idx === i
                            ? { ...it, image: generated, isGenerating: false }
                            : it,
                    ),
                );
            }
            setStep(3);
        } catch {
            alert("Có lỗi xảy ra khi tạo ảnh bằng AI.");
        } finally {
            setIsLoading(false);
            setGenerationProgress(0);
        }
    };

    const downloadImage = (index: number): Promise<void> => {
        const item = items[index];
        if (!item.image) return Promise.resolve();
        return downloadCarouselImage({
            quote: item.quote,
            keywords: item.keywords,
            image: item.image,
            logo,
            textColor,
            highlightColor,
            fontFamily,
            fontSize,
            logoPosition,
            logoSize,
            quotePosition,
            filename: `carousel-item-${index + 1}.png`,
        });
    };

    const downloadAll = async () => {
        for (let i = 0; i < items.length; i++) {
            await downloadImage(i);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
            <AppNav onFeedbackOpen={() => setIsFeedbackOpen(true)} />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />

            {/* Header */}
            <header className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold mb-4"
                >
                    <Sparkles size={16} />
                    AI Powered Carousel Creator
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight mb-4 font-serif dark:text-white">
                    Carousel Content
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
                    Tạo nội dung carousel chuyên nghiệp chỉ trong vài bước với
                    sức mạnh của trí tuệ nhân tạo.
                </p>
            </header>

            {/* Floating Feedback Button */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/50 hover:bg-emerald-700 hover:scale-105 transition-all font-bold group text-sm md:text-base"
            >
                <MessageSquare
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                />
                <span className="hidden sm:inline">Góp ý & Yêu cầu</span>
                <span className="sm:hidden">Góp ý</span>
            </button>

            {/* Step indicator */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-200 dark:bg-neutral-700 -translate-y-1/2 z-0" />
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                            step >= s
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50"
                                : "bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-2 border-neutral-200 dark:border-neutral-700"
                        }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            {/* Steps */}
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <Step1Theme
                            theme={theme}
                            setTheme={setTheme}
                            isLoading={isLoading}
                            onGenerate={handleGenerateQuotes}
                        />
                    )}
                    {step === 2 && (
                        <Step2Images
                            items={items}
                            setItems={setItems}
                            logo={logo}
                            setLogo={setLogo}
                            settings={settings}
                            isLoading={isLoading}
                            generationProgress={generationProgress}
                            onGenerateSingleAI={handleGenerateSingleAI}
                            onGenerateRestWithAI={handleGenerateRestWithAI}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Download
                            items={items}
                            logo={logo}
                            settings={settings}
                            onDownloadOne={downloadImage}
                            onDownloadAll={downloadAll}
                            onBack={() => setStep(2)}
                        />
                    )}
                </AnimatePresence>
            </main>

            <AppFooter />
        </div>
    );
}
