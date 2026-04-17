import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullPlaybookData } from '../data/full_playbook';
import { useGameState } from './GameStateContext';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Cpu } from 'lucide-react';

interface QuizEngineProps {
    chapterId: string;
    onComplete: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ chapterId, onComplete }) => {
    const chapter = fullPlaybookData.find(c => c.id === chapterId);
    const quiz = chapter?.quiz;

    const { addXP, recordAnswer, completeMission, completedMissions } = useGameState();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showBossUnlock, setShowBossUnlock] = useState(false);
    const [sessionScore, setSessionScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [shuffledOptions, setShuffledOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);

    useEffect(() => {
        if (!quiz || quiz.length === 0) return;

        const currentQuestion = quiz[currentQuestionIndex];
        const optionsWithMeta = currentQuestion.options.map((opt, idx) => ({
            text: opt,
            isCorrect: idx === currentQuestion.correctAnswerIndex
        }));

        const shuffled = [...optionsWithMeta];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Use timeout to avoid synchronous setState in effect
        const timer = setTimeout(() => {
            setShuffledOptions(shuffled);
        }, 0);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex, quiz]);

    if (!quiz || quiz.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Mission Complete</h2>
                <p className="text-gray-500 mb-8">No quiz available for this mission yet.</p>
                <button
                    onClick={() => {
                        completeMission(chapterId);
                        onComplete();
                    }}
                    className="px-8 py-4 bg-emerald-500 text-gray-900 font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const currentQuestion = quiz[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.length - 1;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOptionIndex(index);
        setIsAnswered(true);

        const isCorrect = shuffledOptions[index].isCorrect;
        recordAnswer(isCorrect); // Record global stats

        if (isCorrect) {
            setSessionScore(prev => prev + 1);
            // Defer XP reward to mission completion
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOptionIndex(null);
            setIsAnswered(false);
        }
    };

    const handleFinishMission = () => {
        // Only grant bonus XP if this mission hasn't been completed before
        if (!completedMissions.includes(chapterId)) {
            addXP(100);
        }
        completeMission(chapterId, sessionScore, quiz.length);

        // Every 4 missions, show boss unlock reminder
        const willShowReminder = (completedMissions.length + 1) % 4 === 0;
        if (willShowReminder) {
            setShowBossUnlock(true);
        } else {
            onComplete();
        }
    };

    const handleRetryMission = () => {
        setCurrentQuestionIndex(0);
        setSelectedOptionIndex(null);
        setIsAnswered(false);
        setSessionScore(0);
        setShowResult(false);
    };

    const optionLetters = ['A', 'B', 'C', 'D'];

    if (showBossUnlock) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-50 border-2 border-red-500/50 p-8 sm:p-16 rounded-[2.5rem] shadow-[0_0_100px_rgba(239,68,68,0.15)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-red-500/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50"
                        >
                            <Cpu className="w-12 h-12" />
                        </motion.div>

                        <motion.h2
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        >
                            INCOMING MESSAGE
                        </motion.h2>

                        <motion.h3
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl sm:text-2xl font-bold text-red-400 mb-6 uppercase tracking-widest"
                        >
                            The Architect is waiting.
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
                        >
                            You have proven your skills. Do you have what it takes to pass the final exam? The Boss Battle simulation is available on your dashboard whenever you are ready.
                        </motion.p>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={onComplete}
                            className="px-10 py-5 bg-red-600/90 text-gray-900 font-bold rounded-2xl hover:bg-red-500 transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] text-lg w-full sm:w-auto uppercase tracking-wider relative overflow-hidden group border border-red-500/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -tranzinc-x-full group-hover:animate-shimmer" />
                            Acknowledge & Return
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }
    if (showResult) {
        const passingThreshold = 0.65;
        const miniCorrectNeeded = Math.ceil(quiz!.length * passingThreshold);
        const isPassed = sessionScore >= miniCorrectNeeded;
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center relative z-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bg-gray-50 border-2 ${isPassed ? 'border-emerald-500/50 shadow-[0_0_100px_rgba(16,185,129,0.15)]' : 'border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.15)]'} p-8 sm:p-16 rounded-[2.5rem] relative overflow-hidden`}
                >
                    <div className={`absolute inset-0 ${isPassed ? 'bg-emerald-500/5' : 'bg-red-500/5'} bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isPassed ? 'from-emerald-900/40' : 'from-red-900/40'} via-transparent to-transparent pointer-events-none`} />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center shadow-2xl ${isPassed ? 'bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50' : 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50'}`}
                        >
                            {isPassed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                        </motion.div>

                        <h2 className={`text-4xl font-black mb-4 ${isPassed ? 'text-gray-900' : 'text-red-500'}`}>
                            {isPassed ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
                        </h2>

                        <p className="text-xl text-gray-700 mb-8">
                            You scored <span className={`font-bold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>{sessionScore}</span> out of {quiz!.length} questions correctly.
                            {!isPassed && ` (Requires ${miniCorrectNeeded} correct answers to pass - 65%)`}
                        </p>

                        {isPassed && (
                            <div className="flex justify-center items-center gap-3 text-emerald-400 font-bold text-2xl mb-10 bg-emerald-500/10 py-4 px-8 rounded-2xl w-max mx-auto border border-emerald-500/20">
                                <Trophy className="w-6 h-6" /> +{sessionScore * 100} XP
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            {isPassed ? (
                                <button
                                    onClick={handleFinishMission}
                                    className="px-10 py-4 bg-emerald-500 text-gray-900 font-bold rounded-2xl hover:bg-emerald-400 transition-all text-lg flex items-center gap-3"
                                >
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleRetryMission}
                                    className="px-10 py-4 bg-red-600/90 text-gray-900 font-bold rounded-2xl hover:bg-red-500 transition-all text-lg flex items-center gap-3 border border-red-500/50"
                                >
                                    Retry Mission
                                </button>
                            )}
                            {(!isPassed) && (
                                <button
                                    onClick={onComplete}
                                    className="px-8 py-4 bg-gray-200 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 hover:text-gray-900 transition-all text-lg"
                                >
                                    Abort
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Header progress */}
            <div className="mb-12 flex items-center justify-between bg-gray-100 border border-gray-200 p-4 rounded-2xl">
                <div className="text-gray-500 font-bold tracking-widest uppercase text-sm">
                    Question {currentQuestionIndex + 1} of {quiz!.length}
                </div>
                <div className="flex gap-2">
                    {quiz!.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx === currentQuestionIndex ? 'bg-emerald-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]' :
                                idx < currentQuestionIndex ? 'bg-emerald-500/40' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-100 border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-12 relative z-10">
                    {currentQuestion.question}
                </h2>

                <div className="space-y-4 relative z-10">
                    {shuffledOptions.map((option, idx) => {
                        const isSelected = selectedOptionIndex === idx;
                        const isCorrectAnswer = option.isCorrect;

                        let buttonStateClass = "bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-500/50 hover:bg-gray-200";
                        let icon = null;

                        if (isAnswered) {
                            if (isCorrectAnswer) {
                                buttonStateClass = "bg-green-500/10 border-green-500/50 text-gray-900 shadow-[0_0_20px_rgba(34,197,94,0.15)]";
                                icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
                            } else if (isSelected && !isCorrectAnswer) {
                                buttonStateClass = "bg-red-500/10 border-red-500/50 text-gray-900";
                                icon = <XCircle className="w-6 h-6 text-red-500" />;
                            } else {
                                buttonStateClass = "bg-gray-50 border-gray-200/50 text-gray-400 opacity-50";
                            }
                        } else if (isSelected) {
                            // Should not stay here long since isAnswered becomes true immediately, but for safety
                            buttonStateClass = "bg-emerald-500/20 border-emerald-500 text-gray-900";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                                className={`w-full text-left p-6 sm:px-8 sm:py-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${buttonStateClass} ${!isAnswered && 'hover:-tranzinc-y-1'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${isAnswered && isCorrectAnswer ? 'bg-green-500/20 text-green-400' :
                                        isAnswered && isSelected && !isCorrectAnswer ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-100 border border-gray-200 text-gray-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30'
                                        }`}>
                                        {optionLetters[idx]}
                                    </div>
                                    <span className="text-lg sm:text-xl font-medium">{option.text}</span>
                                </div>
                                {icon && <div className="shrink-0 ml-4">{icon}</div>}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                            className="overflow-hidden"
                        >
                            <div className={`p-6 rounded-2xl border ${selectedOptionIndex !== null && shuffledOptions[selectedOptionIndex as number].isCorrect
                                ? 'bg-green-500/5 border-green-500/20'
                                : 'bg-red-500/5 border-red-500/20'
                                }`}>
                                <h4 className={`font-bold mb-2 ${selectedOptionIndex !== null && shuffledOptions[selectedOptionIndex as number].isCorrect
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                    }`}>
                                    {selectedOptionIndex !== null && shuffledOptions[selectedOptionIndex as number].isCorrect ? 'Correct!' : 'Incorrect'}
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                    {currentQuestion.explanation}
                                </p>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 text-lg"
                                >
                                    {isLastQuestion ? (
                                        <>Finish Mission <Trophy className="w-5 h-5" /></>
                                    ) : (
                                        <>Next Question <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};
