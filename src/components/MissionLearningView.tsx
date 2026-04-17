import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentBlock } from '../data/full_playbook';
import { fullPlaybookData } from '../data/full_playbook';
import { InlineTextWithTooltips } from './InlineTooltip';
import { ArrowLeft, PlayCircle, Zap, Target } from 'lucide-react';

interface MissionLearningViewProps {
    chapterId: string;
    onBack: () => void;
    onStartQuiz: () => void;
}

export const MissionLearningView: React.FC<MissionLearningViewProps> = ({ chapterId, onBack, onStartQuiz }) => {
    const chapter = fullPlaybookData.find(c => c.id === chapterId);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    if (!chapter) return null;

    const pages = chapter.pages || [chapter.content]; // Fallback if pages not defined
    const currentPage = pages[currentPageIndex];
    const isLastPage = currentPageIndex === pages.length - 1;

    const handleNextPage = () => {
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-tranzinc-x-1 transition-transform" />
                    <span>Back to Missions</span>
                </button>
                <div className="flex items-center gap-2 font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                    <Zap className="w-4 h-4" />
                    + 100 XP
                </div>
            </div>

            {/* Reading Content Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${chapterId}-page-${currentPageIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-100 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[500px]"
                >
                    {/* Subtle Background Glow */}
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 space-y-4 mb-12 border-b border-gray-200 pb-8">
                        <div className="flex justify-between items-center">
                            <div className="text-emerald-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                {chapter.title}
                            </div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-200/60 px-3 py-1 rounded-full border border-gray-200">
                                Page {currentPageIndex + 1} of {pages.length}
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                            {chapter.subtitle}
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-8">
                        {currentPage.map((block, idx) => {
                            if (block.type === 'paragraph') {
                                return (
                                    <div key={idx} className="space-y-2">
                                        {block.title && <h3 className="text-xl font-bold text-emerald-400">{block.title}</h3>}
                                        <p className="text-lg leading-relaxed text-gray-700 font-medium tracking-wide">
                                            <InlineTextWithTooltips text={block.content as string} />
                                        </p>
                                    </div>
                                );
                            }
                            if (block.type === 'quote') {
                                return (
                                    <blockquote key={idx} className="my-10 px-8 py-8 border-l-4 border-emerald-500 bg-emerald-500/5 rounded-r-2xl border-y border-r border-gray-200">
                                        <p className="text-xl text-gray-900 font-semibold leading-relaxed italic">
                                            "<InlineTextWithTooltips text={block.content as string} />"
                                        </p>
                                    </blockquote>
                                );
                            }
                            if (block.type === 'list') {
                                return (
                                    <div key={idx} className="my-8">
                                        {block.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{block.title}</h3>}
                                        <ul className="space-y-4 pl-4">
                                            {(block.content as string[]).map((li, i) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                                                    <span className="text-lg text-gray-700 leading-relaxed">
                                                        <InlineTextWithTooltips text={li} />
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            }

                            if (block.type === 'image') {
                                return (
                                    <figure key={idx} className="my-12 flex flex-col items-center">
                                        <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                                            <img
                                                src={block.content as string}
                                                alt={block.caption || "Illustration"}
                                                className="w-full h-auto object-cover max-h-[500px]"
                                            />
                                        </div>
                                        {block.caption && (
                                            <figcaption className="mt-4 text-center text-sm font-medium text-gray-400">
                                                {block.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }
                            if (block.type === 'action-block') {
                                return <ActionBlock key={idx} block={block} />;
                            }
                            if (block.type === 'deep-dive') {
                                return <DeepDiveBlock key={idx} block={block} />;
                            }

                            return null;
                        })}
                    </div>

                    {/* Navigation Buttons inside the card */}
                    <div className="relative z-10 mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPageIndex === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentPageIndex === 0
                                    ? 'text-gray-400 bg-gray-200/60 cursor-not-allowed opacity-50'
                                    : 'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-900'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {pages.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPageIndex ? 'bg-emerald-500 w-8' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {!isLastPage && (
                            <button
                                onClick={handleNextPage}
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-gray-900 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                Continue
                                <PlayCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Quiz CTA - Only on last page */}
            <AnimatePresence>
                {isLastPage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12 bg-gray-100 border border-gray-200 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                            <Target className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to test your knowledge?</h3>
                        <p className="text-gray-500 mb-8">Answer questions correctly to earn up to <span className="text-emerald-400 font-bold">100 XP</span>.</p>
                        <button
                            onClick={onStartQuiz}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-gray-900 font-bold rounded-xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] min-w-[200px] justify-center text-lg"
                        >
                            <PlayCircle className="w-5 h-5" />
                            Start Quiz
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

const ActionBlock = ({ block }: { block: ContentBlock }) => {
    return (
        <div className="my-12 bg-gray-50 border-l-4 border-emerald-500 p-8 rounded-r-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-12 -mt-12" />
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-widest uppercase mb-4">
                    <Zap className="w-4 h-4" />
                    {block.title || "Critical Insight"}
                </div>
                <p className="text-xl md:text-2xl font-semibold text-gray-900/90 leading-relaxed">
                    <InlineTextWithTooltips text={block.content as string} />
                </p>
            </div>
        </div>
    );
};

const DeepDiveBlock = ({ block }: { block: ContentBlock }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="my-8">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full group flex items-center justify-between p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-200 transition-all duration-300 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gray-100 border border-gray-200 text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                        Deep Dive: {block.title}
                    </span>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-gray-500 group-hover:bg-gray-200 transition-colors">
                    <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 mt-4 rounded-2xl bg-gray-50 border border-gray-200/50 shadow-inner">
                            {Array.isArray(block.content) ? (
                                <div className="space-y-4">
                                    {block.content.map((p, i) => (
                                        <p key={i} className="text-gray-500 leading-relaxed font-medium">
                                            <InlineTextWithTooltips text={p} />
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    <InlineTextWithTooltips text={block.content as string} />
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
