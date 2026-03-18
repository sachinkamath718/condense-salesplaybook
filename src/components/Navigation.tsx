import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Hexagon, Zap, CheckCircle, Target, Trophy } from 'lucide-react';
import { useGameState } from './GameStateContext';
import { fullPlaybookData } from '../data/full_playbook';

interface NavigationProps {
    user: { name: string; company: string };
    onLogout: () => void;
    onAdmin?: () => void;
    onDashboard?: () => void;
    isAdminView?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, onAdmin, onDashboard, isAdminView }) => {
    const { xp, completedMissions, correctAnswers, totalQuestions } = useGameState();
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-6"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                        <Hexagon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold tracking-widest uppercase text-sm">Condense</div>
                        <div className="text-white/50 text-xs font-medium tracking-wide">Playbook Engine</div>
                    </div>
                </div>

                {/* Global Stats Area */}
                <div className="flex items-center gap-4 sm:gap-6 bg-white/5 backdrop-blur-md border border-white/10 px-4 sm:px-6 py-2.5 rounded-2xl shadow-inner overflow-x-auto no-scrollbar max-w-[calc(100vw-12rem)] md:max-w-none">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{xp} <span className="hidden xs:inline text-white/50 font-medium faces">XP</span></span>
                    </div>
                    <div className="w-px h-4 bg-white/10 flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{completedMissions.length}/{fullPlaybookData.length} <span className="hidden xs:inline text-white/50 font-medium">Modules</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <div className="w-px h-4 bg-white/10 mr-4" />
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm tracking-wide">{accuracy}% <span className="text-white/50 font-medium">Accuracy</span></span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                        <div className="w-px h-4 bg-white/10 mr-4" />
                        <Trophy className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm tracking-wide">{Math.floor(completedMissions.length / 3)}/4 <span className="text-white/50 font-medium">Badges</span></span>
                    </div>
                </div>

                {/* User & Logout */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3">
                        {onAdmin && onDashboard && (
                            isAdminView ? (
                                <button
                                    onClick={onDashboard}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/10 flex items-center gap-2"
                                >
                                    <Hexagon className="w-4 h-4" />
                                    Return
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onAdmin?.();
                                    }}
                                    className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-2"
                                >
                                    <Target className="w-4 h-4" />
                                    Admin
                                </button>
                            )
                        )}
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white tracking-wide">{user.name}</div>
                        <div className="text-xs font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">
                            {user.company} AUTHENTICATED
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Disconnect"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </motion.nav>
    );
};

export default Navigation;
