import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Target, BookOpen, AlertCircle, RefreshCw, Bot, Cpu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface UserData {
    id: string;
    username: string;
    companyCode: string;
    xp: number;
    accuracy: number;
    modulesCompleted: number;
    lastActive: Date;
    quizResults?: Record<string, unknown>;
    chatTranscripts?: Record<string, { timestamp: string, messages: { role: string, content: string }[], status: 'won' | 'lost' }>;
}

export const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<'xp' | 'accuracy' | 'modulesCompleted'>('xp');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "users"), orderBy(sortField, "desc"));
            const querySnapshot = await getDocs(q);

            const fetchedUsers: UserData[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedUsers.push({
                    id: doc.id,
                    username: data.username || 'Unknown',
                    companyCode: data.companyCode || '-',
                    xp: data.xp || 0,
                    accuracy: data.accuracy || 0,
                    modulesCompleted: data.modulesCompleted || 0,
                    lastActive: data.lastActive ? data.lastActive.toDate() : new Date(),
                    quizResults: data.quizResults || {},
                    chatTranscripts: data.chatTranscripts || {}
                });
            });

            setUsers(fetchedUsers);
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching admin data:", err);
            // We don't want to crash if Firebase isn't set up yet, we'll just show empty state
            setError("Telemetry Fetch Error: If you see 'Permission Denied' in console, please update your Firestore Rules to allow 'list' on the users collection. Also verify VERCEL environment keys.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortField]);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <span className="text-sky-400">Condense</span> Telemetry Admin
                        </h1>
                        <p className="text-slate-400">Global performance tracking across all active deployed agents.</p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </header>

                {error ? (
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-amber-500 mb-2">Connection Required</h3>
                        <p className="text-slate-300">
                            {error}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex bg-[#1e293b] p-4 gap-4 border-b border-slate-800 text-sm font-medium">
                            <button
                                onClick={() => setSortField('xp')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${sortField === 'xp' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                <Trophy className="w-4 h-4" /> Sort by Experience
                            </button>
                            <button
                                onClick={() => setSortField('accuracy')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${sortField === 'accuracy' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                <Target className="w-4 h-4" /> Sort by Accuracy
                            </button>
                            <button
                                onClick={() => setSortField('modulesCompleted')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${sortField === 'modulesCompleted' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                <BookOpen className="w-4 h-4" /> Sort by Progress
                            </button>
                        </div>

                        <div className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0b1120] border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Rep Identity</th>
                                        <th className="p-4 font-semibold">Division</th>
                                        <th className="p-4 font-semibold text-right">Total XP</th>
                                        <th className="p-4 font-semibold text-center">Accuracy</th>
                                        <th className="p-4 font-semibold text-center">Modules</th>
                                        <th className="p-4 font-semibold text-center">Chat Logs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-500">
                                                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
                                                Syncing telemetry...
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-500">
                                                No telemetry data found. Users must log in and interact with the modules.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={user.id}
                                                className="border-b border-slate-800/50 hover:bg-[#1e293b]/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 font-bold text-xs ring-1 ring-slate-700">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-slate-200">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800/50 text-slate-300 text-xs border border-slate-700/50">
                                                        {user.companyCode}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-mono text-sky-400 font-bold">{user.xp}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${user.accuracy >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            user.accuracy >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                        {Math.round(user.accuracy)}%
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-slate-300 font-medium">{user.modulesCompleted}</span>
                                                        <span className="text-slate-600 text-xs">/ 13</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                                        className={`p-2 rounded-lg transition-colors ${expandedUser === user.id ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                        title="View Chat History"
                                                    >
                                                        <Trophy className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {expandedUser && users.find(u => u.id === expandedUser) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        >
                            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl max-h-[80vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
                                <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            Chat History: <span className="text-sky-400">{users.find(u => u.id === expandedUser)?.username}</span>
                                        </h2>
                                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">AI Simulation Transcripts</p>
                                    </div>
                                    <button
                                        onClick={() => setExpandedUser(null)}
                                        className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                                    >
                                        <AlertCircle className="w-6 h-6 rotate-45" />
                                    </button>
                                </header>
                                
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-950/30">
                                    {Object.entries(users.find(u => u.id === expandedUser)?.chatTranscripts || {}).length === 0 ? (
                                        <div className="text-center py-20 text-slate-500">
                                            <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p>No chat transcripts found for this user.</p>
                                        </div>
                                    ) : (
                                        Object.entries(users.find(u => u.id === expandedUser)?.chatTranscripts || {}).map(([personaId, transcript]) => (
                                            <div key={personaId} className="space-y-4">
                                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                                    <h3 className="font-bold text-white capitalize flex items-center gap-2">
                                                        <Cpu className="w-4 h-4 text-sky-400" />
                                                        vs {personaId}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-slate-500 font-mono">{new Date(transcript.timestamp).toLocaleString()}</span>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${transcript.status === 'won' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                                                            {transcript.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4 px-4 border-l-2 border-slate-800 ml-2">
                                                    {transcript.messages.map((msg, i) => (
                                                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                                                                    {msg.role === 'user' ? 'Rep' : 'Persona'}
                                                                </span>
                                                            </div>
                                                            <div className={`p-3 rounded-xl text-sm max-w-[90%] ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 'bg-sky-900/40 text-sky-100 rounded-tr-none border border-sky-500/20'}`}>
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
