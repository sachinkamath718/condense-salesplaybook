import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAYBOOK_KEYWORDS } from '../data/full_playbook';

const sortedKeywords = [...PLAYBOOK_KEYWORDS].sort((a, b) => b.term.length - a.term.length);
const patternString = `\\b(${sortedKeywords.map(k => k.term).join('|')})\\b`;

interface InlineTooltipProps {
    text: string;
}

// Optimized Keyword Extractor
export const InlineTextWithTooltips: React.FC<InlineTooltipProps> = ({ text }) => {
    if (!text) return null;

    const regexPattern = new RegExp(patternString, 'gi');

    const tokens = [];
    let lastIndex = 0;
    let match;

    // Manually exec the regex to prevent nested replacement issues
    while ((match = regexPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            tokens.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
        }

        const matchedTerm = match[0];
        const kwDef = sortedKeywords.find(k => k.term.toLowerCase() === matchedTerm.toLowerCase());

        if (kwDef) {
            tokens.push(<TooltipWrapper key={`kw-${match.index}`} term={matchedTerm} definition={kwDef.definition} />);
        } else {
            // fallback if bug
            tokens.push(<span key={`fallback-${match.index}`}>{matchedTerm}</span>);
        }

        lastIndex = regexPattern.lastIndex;
    }

    if (lastIndex < text.length) {
        tokens.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return <>{tokens}</>;
};

const TooltipWrapper: React.FC<{ term: string; definition: string }> = ({ term, definition }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className="relative inline-block cursor-help group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="text-accent font-semibold border-b border-accent/40 rounded-sm hover:border-accent hover:bg-accent/10 transition-colors px-0.5">
                {term}
            </span>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 bottom-full left-1/2 -tranzinc-x-1/2 mb-3 w-64 p-4 rounded-xl bg-black/90 border border-white/20 shadow-2xl backdrop-blur-xl pointer-events-none"
                    >
                        <div className="text-sm font-bold text-accent mb-1.5 tracking-wide">{term}</div>
                        <div className="text-sm text-gray-700 leading-relaxed font-normal">{definition}</div>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -tranzinc-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-white/20" />
                        <div className="absolute top-full left-1/2 -tranzinc-x-1/2 -mt-[2px] border-[6px] border-transparent border-t-black/90" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};
