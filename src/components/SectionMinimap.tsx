import React from 'react';
import type { Chapter } from '../data/full_playbook';
import { motion } from 'framer-motion';

interface MinimapProps {
    chapters: Chapter[];
    activeChapterId: string;
}

export const SectionMinimap: React.FC<MinimapProps> = ({ chapters, activeChapterId }) => {

    return (
        <div className="hidden lg:block fixed right-8 top-1/2 -tranzinc-y-1/2 z-40">
            <div className="flex flex-col gap-6">
                {chapters.map((ch) => {
                    const isActive = ch.id === activeChapterId;
                    return (
                        <div key={ch.id} className="relative flex items-center group">
                            <span
                                className={`absolute right-full mr-4 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${isActive
                                    ? 'opacity-100 tranzinc-x-0 tracking-widest text-[#a855f7]'
                                    : 'opacity-0 tranzinc-x-2 text-gray-900/40 group-hover:opacity-100 group-hover:tranzinc-x-0'
                                    }`}
                            // using hex #a855f7 or tailwind accent if inline
                            >
                                {ch.title}
                            </span>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: isActive ? 32 : 8,
                                    backgroundColor: isActive ? '#a855f7' : 'rgba(255,255,255,0.2)'
                                }}
                                className="w-1.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
