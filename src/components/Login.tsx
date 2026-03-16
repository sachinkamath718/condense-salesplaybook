import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface LoginProps {
    onStart: (name: string, company: string, isReturning: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onStart }) => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Clear error when switching modes
        setError('');
        setPasscode('');
    }, [isSignUp]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const username = name.trim().toLowerCase();
        if (!username || !passcode.trim()) return;

        setLoading(true);

        try {
            // Fake loading delay to look cool
            await new Promise(resolve => setTimeout(resolve, 800));

            const userRef = doc(db, 'users', username);
            const userSnap = await getDoc(userRef);

            if (isSignUp) {
                if (!company.trim()) {
                    setLoading(false);
                    return;
                }

                if (userSnap.exists()) {
                    setError('Identity already registered. Please authenticate.');
                    setLoading(false);
                    return;
                }

                // Create new user in Firestore
                const userData = {
                    username: username,
                    companyCode: company.trim(),
                    passcode: passcode.trim(), // In a real app, this should be hashed
                    lastActive: serverTimestamp(),
                    xp: 0,
                    accuracy: 0,
                    modulesCompleted: 0,
                    quizResults: {}
                };

                await setDoc(userRef, userData);
                
                localStorage.setItem('condense_active_session', username);
                onStart(username, company.trim(), false);
            } else {
                // Log In
                if (!userSnap.exists()) {
                    setError('Identity not found. Please initialize access.');
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data();
                if (userData.passcode !== passcode.trim()) {
                    setError('Invalid Secure Passcode.');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('condense_active_session', username);
                
                // Update last active
                await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });

                onStart(username, userData.companyCode, true);
            }
        } catch (err) {
            console.error("Login Error", err);
            setError('System error connecting to secure vault.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* The animated dynamic background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-emerald-900/20 blur-[150px] mix-blend-screen animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-900/20 blur-[120px] mix-blend-screen" />

                {/* Micro-grid overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-10" />
            </div>

            <div
                className="z-10 w-full max-w-[480px] relative"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-zinc-950 text-emerald-400 mb-8 border border-zinc-700/50 shadow-[0_0_30px_rgba(52,211,153,0.15)] ring-1 ring-white/10">
                        <Cpu className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-3 drop-shadow-2xl">
                        Condense<span className="text-emerald-400">.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium tracking-widest uppercase">
                        Enterprise Playbook
                    </p>
                </motion.div>

                <Card
                    delay={0.2}
                    className="p-8 md:p-10 bg-[#0b1120]/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-[2.5rem]"
                >
                    {/* Interior gradient shine */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2 transition-colors group-focus-within:text-emerald-400">
                                <ShieldCheck className="w-3.5 h-3.5" /> Full Identity
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium text-lg shadow-inner"
                                placeholder="E.g. John Doe"
                            />
                        </div>

                        <AnimatePresence mode="popLayout">
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2 mt-2 group-focus-within:text-emerald-400">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Division Code
                                    </label>
                                    <input
                                        id="company"
                                        type="text"
                                        required={isSignUp}
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium text-lg shadow-inner"
                                        placeholder="Enter access code..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2 group">
                            <label htmlFor="passcode" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2 mt-2 transition-colors group-focus-within:text-emerald-400">
                                <Key className="w-3.5 h-3.5" /> Secure Passcode
                            </label>
                            <input
                                id="passcode"
                                type="password"
                                required
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium text-lg tracking-widest shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !name.trim() || !passcode.trim() || (isSignUp && !company.trim())}
                            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-500 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -tranzinc-x-full group-hover:animate-shimmer" />
                            {loading ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>{isSignUp ? 'Initialize Access' : 'Authenticate'}</span>
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </motion.button>

                        <div className="pt-4 text-center border-t border-zinc-800/80 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors tracking-wide"
                            >
                                {isSignUp
                                    ? "Already registered? Authenticate here."
                                    : "Need access? Initialize an identity."}
                            </button>
                        </div>

                        <p className="text-center text-xs font-medium tracking-widest uppercase text-zinc-600 pt-2">
                            Secure Data Terminal • E2E Encrypted
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};
