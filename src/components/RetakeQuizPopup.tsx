import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Award, X, RotateCcw } from 'lucide-react';

interface RetakeQuizPopupProps {
    missionTitle: string;
    previousScore: number;
    totalQuestions: number;
    onStart: () => void;
    onClose: () => void;
}

export const RetakeQuizPopup: React.FC<RetakeQuizPopupProps> = ({ 
    missionTitle, 
    previousScore, 
    totalQuestions, 
    onStart, 
    onClose 
}) => {
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
                className="bg-gray-50 border border-emerald-500/20 rounded-[2rem] p-8 max-w-md w-full relative overflow-hidden shadow-2xl"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
                        <RotateCcw className="w-8 h-8 text-emerald-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                        REPLAY MISSION
                    </h2>
                    <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-6">
                        {missionTitle}
                    </p>
                    
                    {totalQuestions > 0 && (
                        <div className="bg-gray-100/70 border border-gray-200 rounded-2xl p-6 mb-8">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Your Best Performance</span>
                            <div className="flex items-center justify-center gap-3">
                                <Award className="w-5 h-5 text-emerald-500" />
                                <span className="text-3xl font-black text-gray-900">{previousScore} / {totalQuestions}</span>
                            </div>
                        </div>
                    )}

                    <div className={totalQuestions > 0 ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                        <button
                            onClick={onStart}
                            className="py-4 px-6 bg-emerald-500 text-gray-900 font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group w-full"
                        >
                            {totalQuestions > 0 ? "Start Quiz" : "Replay Mission"}
                            {totalQuestions > 0 ? (
                                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            ) : (
                                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="py-4 px-6 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-200 w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
