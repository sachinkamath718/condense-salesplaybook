import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GameState {
    xp: number;
    completedMissions: string[];
    correctAnswers: number;
    totalQuestions: number;
    unlockedMissionsCount: number;
    missionScores: Record<string, { score: number, total: number }>;
    chatTranscripts: Record<string, { timestamp: any, messages: { role: string, content: string }[], status: 'won' | 'lost' }>;

    addXP: (amount: number) => void;
    completeMission: (chapterId: string, score?: number, total?: number) => void;
    saveChatTranscript: (personaId: string, messages: { role: string, content: string }[], status: 'won' | 'lost') => void;
    recordAnswer: (isCorrect: boolean) => void;
    resetGame: () => void;
    isFirebaseConfigured: boolean; // kept for compatibility, always true with Supabase
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode, userId?: string }> = ({ children, userId }) => {
    const [xp, setXp] = useState(0);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [missionScores, setMissionScores] = useState<Record<string, { score: number, total: number }>>({});
    const [chatTranscripts, setChatTranscripts] = useState<Record<string, { timestamp: any, messages: { role: string, content: string }[], status: 'won' | 'lost' }>>({});
    const [isStateLoaded, setIsStateLoaded] = useState(false);
    const [loadedUserId, setLoadedUserId] = useState<string | undefined>(undefined);

    const resetGame = () => {
        setXp(0);
        setCompletedMissions([]);
        setCorrectAnswers(0);
        setTotalQuestions(0);
        setMissionScores({});
        setChatTranscripts({});
    };

    // Load state from localStorage + Supabase
    useEffect(() => {
        const fetchState = async () => {
            setIsStateLoaded(false);
            if (!userId) {
                resetGame();
                setIsStateLoaded(true);
                return;
            }

            let hasOptimisticLoad = false;

            // 1. Optimistic local load
            try {
                const savedStateStr = localStorage.getItem(`condense_state_${userId}`);
                if (savedStateStr) {
                    const state = JSON.parse(savedStateStr);
                    if (state && typeof state === 'object') {
                        setXp(state.xp || 0);
                        setCompletedMissions(state.completedMissions || []);
                        setCorrectAnswers(state.correctAnswers || 0);
                        setTotalQuestions(state.totalQuestions || 0);
                        setMissionScores(state.missionScores || {});
                        setChatTranscripts(state.chatTranscripts || {});
                        hasOptimisticLoad = true;
                        setLoadedUserId(userId);
                        setIsStateLoaded(true);
                    }
                }
            } catch (e) {
                console.error('Optimistic load failed:', e);
            }

            // 2. Background Supabase sync
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('xp, completed_missions, correct_answers, total_questions, quiz_results, chat_transcripts')
                    .eq('username', userId)
                    .single();

                if (data && !error) {
                    setXp(prev => Math.max(prev, data.xp || 0));
                    setCompletedMissions(prev => {
                        const merged = new Set([...prev, ...(data.completed_missions || [])]);
                        return Array.from(merged);
                    });
                    setCorrectAnswers(prev => Math.max(prev, data.correct_answers || 0));
                    setTotalQuestions(prev => Math.max(prev, data.total_questions || 0));
                    setMissionScores(prev => ({ ...(data.quiz_results || {}), ...prev }));
                    setChatTranscripts(prev => ({ ...(data.chat_transcripts || {}), ...prev }));
                } else if (!hasOptimisticLoad) {
                    resetGame();
                }
            } catch (err) {
                console.warn('Silent cloud fetch failed:', err);
                if (!hasOptimisticLoad) resetGame();
            } finally {
                if (!hasOptimisticLoad) {
                    setLoadedUserId(userId);
                    setIsStateLoaded(true);
                }
            }
        };

        fetchState();
    }, [userId]);

    // Save state to localStorage + sync to Supabase
    useEffect(() => {
        if (!userId || !isStateLoaded || loadedUserId !== userId) return;

        const MAX_POSSIBLE_XP = 3100;
        if (xp > MAX_POSSIBLE_XP) setXp(MAX_POSSIBLE_XP);

        const stateToSave = {
            xp: Math.min(xp, MAX_POSSIBLE_XP),
            completedMissions,
            correctAnswers,
            totalQuestions,
            missionScores,
            chatTranscripts
        };
        localStorage.setItem(`condense_state_${userId}`, JSON.stringify(stateToSave));

        const syncToSupabase = async () => {
            try {
                await supabase.from('users').update({
                    xp: Math.min(xp, MAX_POSSIBLE_XP),
                    accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
                    correct_answers: correctAnswers,
                    total_questions: totalQuestions,
                    completed_missions: completedMissions,
                    modules_completed: completedMissions.length,
                    last_active: new Date().toISOString(),
                    quiz_results: missionScores,
                    chat_transcripts: chatTranscripts,
                }).eq('username', userId);
            } catch (err) {
                console.warn('Supabase sync skipped:', err);
            }
        };

        syncToSupabase();
    }, [userId, isStateLoaded, xp, completedMissions, correctAnswers, totalQuestions, missionScores, chatTranscripts]);

    const unlockedMissionsCount = completedMissions.length + 1;
    const addXP = (amount: number) => setXp(prev => prev + amount);

    const completeMission = (chapterId: string, score?: number, total?: number) => {
        if (score !== undefined && total !== undefined) {
            setMissionScores(prev => ({
                ...prev,
                [chapterId]: { score: Math.max(prev[chapterId]?.score || 0, score), total }
            }));
        }
        setCompletedMissions(prev => prev.includes(chapterId) ? prev : [...prev, chapterId]);
    };

    const saveChatTranscript = (personaId: string, messages: { role: string, content: string }[], status: 'won' | 'lost') => {
        setChatTranscripts(prev => ({
            ...prev,
            [personaId]: { timestamp: new Date().toISOString(), messages, status }
        }));
    };

    const recordAnswer = (isCorrect: boolean) => {
        setTotalQuestions(prev => prev + 1);
        if (isCorrect) setCorrectAnswers(prev => prev + 1);
    };

    return (
        <GameContext.Provider value={{
            xp, completedMissions, correctAnswers, totalQuestions,
            unlockedMissionsCount, missionScores, chatTranscripts,
            addXP, completeMission, saveChatTranscript, recordAnswer, resetGame,
            isFirebaseConfigured: true // always true — Supabase is always configured
        }}>
            {children}
        </GameContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGameState must be used within a GameProvider');
    return context;
};
