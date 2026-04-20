import React from 'react';
import { useGameState } from './GameStateContext';
import { fullPlaybookData, MISSIONS } from '../data/full_playbook';
import { Lock, CheckCircle, Zap, Target, Trophy, PlayCircle, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RetakeQuizPopup } from './RetakeQuizPopup';

interface GamifiedDashboardProps {
    onSelectMission: (chapterId: string) => void;
}

const MISSION_COLORS: Record<number, { bg: string, border: string, text: string, accent: string, badge: string }> = {
    1: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    2: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    3: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', accent: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
};

export const GamifiedDashboard: React.FC<GamifiedDashboardProps> = ({ onSelectMission }) => {
    const { xp, completedMissions, missionScores } = useGameState();
    const [retakeMissionId, setRetakeMissionId] = React.useState<string | null>(null);
    const [expandedMission, setExpandedMission] = React.useState<number | null>(1); // Mission 1 open by default

    const level = Math.floor(xp / 500) + 1;
    const progressXP = xp % 500;
    const progressPercent = Math.min(100, (progressXP / 500) * 100);

    const getLevelTitle = (lvl: number) => {
        if (lvl >= 7) return "ARCHITECT";
        if (lvl >= 5) return "VETERAN";
        if (lvl >= 3) return "SPECIALIST";
        return "RECRUIT";
    };

    // Group sections by mission
    const missionSections = MISSIONS.map(mission => ({
        mission,
        sections: fullPlaybookData.filter(c => c.missionId === mission.id)
    }));

    // Mission completion checks
    const isMissionComplete = (missionId: number) =>
        missionSections.find(m => m.mission.id === missionId)?.sections
            .every(s => completedMissions.includes(s.id)) ?? false;

    // Mission unlock logic: M1 always unlocked, M2 needs M1 done, M3 needs M2 done
    const isMissionUnlocked = (missionId: number) => {
        if (missionId === 1) return true;
        if (missionId === 2) return isMissionComplete(1);
        if (missionId === 3) return isMissionComplete(2);
        return false;
    };

    // Section unlock logic within a mission
    const isSectionUnlocked = (missionId: number, sectionIndex: number) => {
        if (!isMissionUnlocked(missionId)) return false;
        if (sectionIndex === 0) return true;
        const sections = missionSections.find(m => m.mission.id === missionId)?.sections ?? [];
        return completedMissions.includes(sections[sectionIndex - 1].id);
    };

    const getMissionProgress = (missionId: number) => {
        const sections = missionSections.find(m => m.mission.id === missionId)?.sections ?? [];
        const done = sections.filter(s => completedMissions.includes(s.id)).length;
        return { done, total: sections.length };
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Header / Profile Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold tracking-wider border border-emerald-200">
                                LEVEL {level} — {getLevelTitle(level)}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Sales Playbook
                        </h1>
                        <p className="text-gray-500 text-lg">Master the platform. Win every room.</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Experience</span>
                            <span className="text-emerald-600 font-bold text-xl">{xp} <span className="text-sm text-emerald-500/70">XP</span></span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                            />
                        </div>
                        <div className="text-right text-xs text-gray-400 font-medium">
                            {progressXP} / 500 to Level {level + 1}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Missions */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="text-emerald-500 w-6 h-6" /> Your Missions
            </h2>

            <div className="space-y-4 mb-8">
                {missionSections.map(({ mission, sections }, missionIdx) => {
                    const unlocked = isMissionUnlocked(mission.id);
                    const complete = isMissionComplete(mission.id);
                    const { done, total } = getMissionProgress(mission.id);
                    const colors = MISSION_COLORS[mission.id];
                    const isExpanded = expandedMission === mission.id && unlocked;

                    return (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: missionIdx * 0.1 }}
                            className={`rounded-2xl border overflow-hidden ${unlocked ? 'border-gray-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                        >
                            {/* Mission Header */}
                            <button
                                onClick={() => unlocked && setExpandedMission(isExpanded ? null : mission.id)}
                                disabled={!unlocked}
                                className={`w-full p-6 flex items-center justify-between text-left transition-colors ${unlocked ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border ${unlocked ? colors.bg + ' ' + colors.border : 'bg-gray-100 border-gray-200'}`}>
                                        {!unlocked ? <Lock className="w-6 h-6 text-gray-400" /> : complete ? '✅' : mission.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${unlocked ? colors.text : 'text-gray-400'}`}>
                                                {mission.title}
                                            </span>
                                            {!unlocked && (
                                                <span className="text-xs text-gray-400 font-medium">
                                                    — Complete Mission {mission.id - 1} to unlock
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-xl font-bold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {mission.description}
                                        </h3>
                                        {unlocked && (
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <span className="font-semibold text-gray-700">{done} / {total}</span> sections complete
                                                </div>
                                                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${colors.accent} rounded-full transition-all duration-500`}
                                                        style={{ width: `${(done / total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {unlocked && (
                                    isExpanded
                                        ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                                        : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                                {!unlocked && <Lock className="w-5 h-5 text-gray-300 shrink-0" />}
                            </button>

                            {/* Sections inside this mission */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                            {sections.map((section, sectionIdx) => {
                                                const sectionUnlocked = isSectionUnlocked(mission.id, sectionIdx);
                                                const sectionCompleted = completedMissions.includes(section.id);

                                                return (
                                                    <motion.button
                                                        key={section.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: sectionIdx * 0.05 }}
                                                        onClick={() => {
                                                            if (sectionCompleted) {
                                                                setRetakeMissionId(section.id);
                                                            } else if (sectionUnlocked) {
                                                                onSelectMission(section.id);
                                                            }
                                                        }}
                                                        disabled={!sectionUnlocked}
                                                        className={`text-left p-4 rounded-xl border transition-all duration-200 relative group ${sectionUnlocked
                                                                ? 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md cursor-pointer'
                                                                : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sectionCompleted
                                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                                    : sectionUnlocked
                                                                        ? colors.bg + ' ' + colors.text + ' border ' + colors.border
                                                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                                }`}>
                                                                {sectionCompleted
                                                                    ? <CheckCircle className="w-4 h-4" />
                                                                    : sectionUnlocked
                                                                        ? <PlayCircle className="w-4 h-4" />
                                                                        : <Lock className="w-4 h-4" />}
                                                            </div>
                                                            <span className="text-xs font-semibold text-gray-400 shrink-0">S{sectionIdx + 1}</span>
                                                        </div>
                                                        <h4 className={`text-sm font-bold mb-1 ${sectionUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {section.title === `Section ${sectionIdx + 1}` || section.title === 'Introduction' ? section.subtitle : section.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 line-clamp-1">{section.subtitle}</p>
                                                        <div className="flex items-center gap-3 mt-3 text-xs font-semibold">
                                                            <span className={`flex items-center gap-1 ${sectionUnlocked ? 'text-gray-500' : 'text-gray-300'}`}>
                                                                <Zap className="w-3 h-3" /> {section.quiz?.length || 0} Q
                                                            </span>
                                                            <span className={`flex items-center gap-1 ${sectionUnlocked ? 'text-emerald-500' : 'text-gray-300'}`}>
                                                                <Trophy className="w-3 h-3" /> +100 XP
                                                            </span>
                                                            {sectionCompleted && missionScores[section.id] && (
                                                                <span className="text-emerald-600">
                                                                    {missionScores[section.id].score}/{missionScores[section.id].total}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Boss Battle Card */}
            <motion.button
                onClick={() => onSelectMission('boss-battle')}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full text-left p-6 sm:p-8 rounded-2xl border border-red-200 bg-white shadow-sm hover:shadow-lg hover:border-red-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${completedMissions.includes('boss-battle-1') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-500 border border-red-200 animate-pulse'}`}>
                        {completedMissions.includes('boss-battle-1') ? <CheckCircle className="w-7 h-7" /> : <Cpu className="w-7 h-7" />}
                    </div>
                    <div className="text-xs font-bold tracking-widest uppercase text-red-500">FINAL EXAM</div>
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">The Architect</h3>
                    <p className="text-sm md:text-base text-gray-500 line-clamp-2">
                        Face the ultimate test. Prove your mastery in a live simulation against the platform's core AI.
                    </p>
                </div>
                <div className="mt-6 flex items-center gap-6 text-sm font-bold relative z-10">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Zap className="w-4 h-4" />
                        <span>6 Opponents</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                        <Trophy className="w-4 h-4" />
                        <span>+2000 XP</span>
                    </div>
                </div>
            </motion.button>

            {/* Retake popup */}
            <AnimatePresence>
                {retakeMissionId && (
                    <RetakeQuizPopup
                        missionTitle={fullPlaybookData.find(c => c.id === retakeMissionId)?.subtitle || ""}
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
