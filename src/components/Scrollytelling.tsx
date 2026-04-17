import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import type { Chapter, ContentBlock } from '../data/full_playbook';
import { fullPlaybookData } from '../data/full_playbook';
import { InlineTextWithTooltips } from './InlineTooltip';
import { SectionMinimap } from './SectionMinimap';

export const ScrollytellingEngine: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentVibeColor, setCurrentVibeColor] = useState('#0f172a');
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    const activeChapter = fullPlaybookData[activeChapterIndex];

    useEffect(() => {
        if (activeChapter) {
            // Use timeout to avoid synchronous setState in effect
            const timer = setTimeout(() => {
                setCurrentVibeColor(activeChapter.vibeColor);
            }, 0);
            // Scroll to top when changing chapters
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return () => clearTimeout(timer);
        }
    }, [activeChapter]);

    const handleNext = () => {
        if (activeChapterIndex < fullPlaybookData.length - 1) {
            setActiveChapterIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (activeChapterIndex > 0) {
            setActiveChapterIndex(prev => prev - 1);
        }
    };

    return (
        <div
            className="relative transition-colors duration-1000 ease-in-out min-h-screen"
            style={{ backgroundColor: currentVibeColor }}
        >
            {/* Dynamic Background Fog based on the vibe color */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px] mix-blend-screen opacity-30 bg-white" />
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full blur-[150px] mix-blend-screen opacity-20 bg-primary" />
                {/* subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] repeat" />
            </div>

            <div className="relative z-10 mx-auto max-w-[700px] px-6 py-32" ref={containerRef}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeChapter.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ChapterSection chapter={activeChapter} />
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Controls */}
                <div className="mt-24 pt-12 border-t border-gray-200 flex items-center justify-between pb-32">
                    <button
                        onClick={handlePrev}
                        disabled={activeChapterIndex === 0}
                        className="px-6 py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 text-gray-900/70 hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        ← Previous
                    </button>
                    <div className="text-gray-900/40 font-mono text-sm tracking-widest">
                        {activeChapterIndex + 1} / {fullPlaybookData.length}
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={activeChapterIndex === fullPlaybookData.length - 1}
                        className="px-6 py-3 rounded-xl font-medium bg-white text-black hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                    >
                        Next Section →
                    </button>
                </div>
            </div>

            {/* Minimap injected here to track active paginated index */}
            <SectionMinimap chapters={fullPlaybookData} activeChapterId={activeChapter?.id || ''} />
        </div>
    );
};

const ChapterSection = ({ chapter }: { chapter: Chapter }) => {

    return (
        <section
            className="chapter-section space-y-12"
            data-chapter-id={chapter.id}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                className="space-y-4 mb-20"
            >
                <div className="text-accent font-bold tracking-widest uppercase text-sm">{chapter.title}</div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] drop-shadow-lg">
                    {chapter.subtitle}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-6" />
            </motion.div>

            <div className="space-y-8">
                {chapter.content.map((block, idx) => {
                    if (block.type === 'paragraph') {
                        return (
                            <motion.p
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="text-[1.15rem] leading-[1.8] text-gray-900/80 font-medium tracking-wide"
                            >
                                <InlineTextWithTooltips text={block.content as string} />
                            </motion.p>
                        );
                    }
                    if (block.type === 'quote') {
                        return (
                            <motion.blockquote
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="my-16 px-8 py-10 border-l-4 border-primary bg-white/5 rounded-r-2xl backdrop-blur-md shadow-xl"
                            >
                                <p className="text-2xl text-gray-900 font-semibold leading-relaxed italic">
                                    "<InlineTextWithTooltips text={block.content as string} />"
                                </p>
                            </motion.blockquote>
                        );
                    }
                    if (block.type === 'list') {
                        return (
                            <motion.ul
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="space-y-4 my-8 pl-4"
                            >
                                {(block.content as string[]).map((li, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0 shadow-[0_0_10px_rgba(var(--accent),0.8)]" />
                                        <span className="text-lg text-gray-900/80 leading-relaxed">
                                            <InlineTextWithTooltips text={li} />
                                        </span>
                                    </li>
                                ))}
                            </motion.ul>
                        );
                    }
                    if (block.type === 'image') {
                        return (
                            <motion.figure
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="my-16 flex flex-col items-center group cursor-pointer"
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:border-gray-200">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                    <img
                                        src={block.content as string}
                                        alt={block.caption || "Illustration"}
                                        className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                {block.caption && (
                                    <figcaption className="mt-6 text-center text-sm font-medium tracking-wide text-gray-900/50 w-3/4">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </motion.figure>
                        );
                    }
                    if (block.type === 'action-block') {
                        return <ActionBlock key={idx} block={block} />;
                    }
                    if (block.type === 'deep-dive') {
                        return <DeepDiveBlock key={idx} block={block} />;
                    }
                })}
            </div>
        </section>
    );
};

const ActionBlock = ({ block }: { block: ContentBlock }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="my-16 bg-gradient-to-r from-blue-50/30 to-background/60 border-l-4 border-accent/70 p-8 md:p-12 rounded-r-2xl shadow-lg relative overflow-hidden group backdrop-blur-sm"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent/10 transition-colors duration-700" />
            <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-xs tracking-widest uppercase mb-6 border border-accent/20">
                    <Zap className="w-3.5 h-3.5" />
                    {block.title || "Critical Insight"}
                </div>
                <p className="text-xl md:text-2xl font-semibold text-gray-900/90 leading-relaxed">
                    <InlineTextWithTooltips text={block.content as string} />
                </p>
            </div>
        </motion.div>
    );
};

const DeepDiveBlock = ({ block }: { block: ContentBlock }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="my-12"
        >
            <button
                onClick={handleToggle}
                className="w-full group relative flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-gray-200 hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden text-left"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-wide">
                        Deep Dive: {block.title}
                    </span>
                </div>
                <div className="relative z-10 w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/10 text-gray-900/70 group-hover:bg-white/20 group-hover:text-gray-900 transition-colors">
                    <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pb-10 rounded-2xl bg-black/40 border border-t-primary/50 border-gray-100 backdrop-blur-xl shadow-inner">
                            {Array.isArray(block.content) ? (
                                <div className="space-y-6">
                                    {block.content.map((p, i) => (
                                        <p key={i} className="text-lg text-gray-900/80 leading-relaxed font-light">
                                            <InlineTextWithTooltips text={p} />
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-lg text-gray-900/80 leading-relaxed font-light">
                                    <InlineTextWithTooltips text={block.content as string} />
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
