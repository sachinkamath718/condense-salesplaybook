import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, TrendingUp, X } from 'lucide-react';

interface XPSummaryPopupProps {
    totalXp: number;
    maxXp: number;
    onClose: () => void;
}

export const XPSummaryPopup: React.FC<XPSummaryPopupProps> = ({ totalXp, maxXp, onClose }) => {
    const percentage = Math.min(100, Math.round((totalXp / maxXp) * 100));
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gray-50 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 sm:p-12 max-w-lg w-full relative overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)]"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <Trophy className="w-10 h-10 text-emerald-400" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        MILESTONE REACHED
                    </h2>
                    
                    <p className="text-gray-500 text-lg mb-10">
                        You've completed all fundamental modules. Here's your performance analysis before the final Architect battle.
                    </p>

                    <div className="bg-gray-100/70 border border-gray-200 rounded-2xl p-6 mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <div className="text-left">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Total XP Earned</span>
                                <span className="text-3xl font-black text-gray-900">{totalXp.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Max Potential</span>
                                <span className="text-xl font-bold text-gray-500">{maxXp.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-emerald-500">{percentage}% Mastery</span>
                            <span className="text-gray-400">{totalXp} / {maxXp} XP</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-gray-100/30 border border-gray-200/50 rounded-xl p-4 flex flex-col items-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                            <span className="text-[10px] text-gray-400 uppercase font-black mb-1">Accuracy</span>
                            <span className="text-xl font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="bg-gray-100/30 border border-gray-200/50 rounded-xl p-4 flex flex-col items-center">
                            <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
                            <span className="text-[10px] text-gray-400 uppercase font-black mb-1">Status</span>
                            <span className="text-xl font-bold text-gray-900">Elite</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-emerald-500 text-gray-900 font-black rounded-2xl hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-lg uppercase tracking-wider"
                    >
                        Continue to Architect
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
