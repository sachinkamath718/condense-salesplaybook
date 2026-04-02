import React from 'react';
import { useGameState } from './GameStateContext';
import { fullPlaybookData } from '../data/full_playbook';
import { Lock, CheckCircle, Zap, Target, Trophy, PlayCircle, Cpu, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RetakeQuizPopup } from './RetakeQuizPopup';

interface GamifiedDashboardProps {
    onSelectMission: (chapterId: string) => void;
}

export const GamifiedDashboard: React.FC<GamifiedDashboardProps> = ({ onSelectMission }) => {
    const { xp, completedMissions, unlockedMissionsCount, missionScores, isFirebaseConfigured } = useGameState();
    const [retakeMissionId, setRetakeMissionId] = React.useState<string | null>(null);

    const level = Math.floor(xp / 500) + 1;
    const progressXP = xp % 500;
    const progressPercent = Math.min(100, (progressXP / 500) * 100);

    const getLevelTitle = (lvl: number) => {
        if (lvl >= 7) return "ARCHITECT";
        if (lvl >= 5) return "VETERAN";
        if (lvl >= 3) return "SPECIALIST";
        return "RECRUIT";
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            
            {/* Connection Warning */}
            {!isFirebaseConfigured && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 text-amber-400"
                >
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Database Not Connected</p>
                        <p className="text-xs opacity-80">Progress is only being saved locally. Please add your Firebase environment variables to Vercel and Redeploy to enable cloud sync.</p>
                    </div>
                </motion.div>
            )}

            {/* Header / Profile Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wider border border-emerald-500/30">
                                LEVEL {level} {getLevelTitle(level)}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isFirebaseConfigured ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'}`}>
                                {isFirebaseConfigured ? 'DATABASE: CLOUD SYNC' : 'DATABASE: LOCAL ONLY'}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                            Sales Playbook
                        </h1>
                        <p className="text-zinc-400 text-lg">Master the architecture. Crush your quota.</p>
                    </div>

                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Experience</span>
                            <span className="text-emerald-400 font-bold text-xl">{xp} <span className="text-sm text-emerald-400/70">XP</span></span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                            />
                        </div>
                        <div className="text-right text-xs text-zinc-500 font-medium">
                            {progressXP} / 500 to Level {level + 1}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Missions Grid */}
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="text-emerald-500 w-6 h-6" /> Assigned Missions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {fullPlaybookData.map((chapter, index) => {
                    const isUnlocked = index < unlockedMissionsCount;
                    const isCompleted = completedMissions.includes(chapter.id);

                    return (
                        <motion.button
                            key={chapter.id}
                            onClick={() => {
                                if (isCompleted) {
                                    setRetakeMissionId(chapter.id);
                                } else if (isUnlocked) {
                                    onSelectMission(chapter.id);
                                }
                            }}
                            disabled={!isUnlocked}
                            whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
                            whileTap={isUnlocked ? { scale: 0.98 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isUnlocked
                                ? 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] cursor-pointer'
                                : 'bg-zinc-900/50 border-zinc-800/50 opacity-60 cursor-not-allowed grayscale-[0.5]'
                                }`}
                        >
                            {/* Hover Glow */}
                            {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    isUnlocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                        'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                    }`}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> :
                                        isUnlocked ? <PlayCircle className="w-6 h-6 ml-0.5" /> :
                                            <Lock className="w-6 h-6" />}
                                </div>
                                <div className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                                    Mission {index + 1}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-zinc-400'}`}>
                                    {chapter.title}
                                </h3>
                                <p className={`text-sm line-clamp-2 ${isUnlocked ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {chapter.subtitle}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-4 text-xs font-semibold relative z-10">
                                <div className={`flex items-center gap-1.5 ${isUnlocked ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>{chapter.quiz?.length || 0} Questions</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${isUnlocked ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                    <Trophy className="w-3.5 h-3.5" />
                                    <span>+100 XP</span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}

                {/* Boss Battle Card */}
                <motion.button
                    onClick={() => onSelectMission('boss-battle')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: fullPlaybookData.length * 0.1 }}
                    className={`md:col-span-2 text-left p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden group bg-zinc-950 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:shadow-[0_0_50px_rgba(239,68,68,0.3)] cursor-pointer`}
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${completedMissions.includes('boss-battle-1') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse'
                            }`}>
                            {completedMissions.includes('boss-battle-1') ? <CheckCircle className="w-7 h-7" /> : <Cpu className="w-7 h-7" />}
                        </div>
                        <div className="text-xs font-bold tracking-widest uppercase text-red-500">
                            FINAL EXAM
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            The Architect
                        </h3>
                        <p className="text-sm md:text-base line-clamp-2 text-zinc-300">
                            Face the ultimate test. Prove your architectural mastery in a live simulation against the platform's core AI.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-sm font-bold relative z-10">
                        <div className="flex items-center gap-2 text-zinc-200">
                            <Zap className="w-4 h-4" />
                            <span>6 Opponents</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-400">
                            <Trophy className="w-4 h-4" />
                            <span>+2000 XP</span>
                        </div>
                    </div>
                </motion.button>
            </div>

            <AnimatePresence>
                {retakeMissionId && (
                    <RetakeQuizPopup
                        missionTitle={fullPlaybookData.find(c => c.id === retakeMissionId)?.title || ""}
                        previousScore={missionScores[retakeMissionId]?.score || 0}
                        totalQuestions={missionScores[retakeMissionId]?.total ?? fullPlaybookData.find(c => c.id === retakeMissionId)?.quiz?.length ?? 0}
                        onStart={() => {
                            onSelectMission(retakeMissionId);
                            setRetakeMissionId(null);
                        }}
                        onClose={() => setRetakeMissionId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
