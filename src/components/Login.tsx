import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { supabase } from '../lib/supabase';

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
            await new Promise(resolve => setTimeout(resolve, 800));

            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (isSignUp) {
                if (!company.trim()) { setLoading(false); return; }

                if (existingUser && !fetchError) {
                    setError('Identity already registered. Please authenticate.');
                    setLoading(false);
                    return;
                }

                const { error: insertError } = await supabase.from('users').insert({
                    username,
                    passcode: passcode.trim(),
                    company_code: company.trim(),
                    xp: 0,
                    accuracy: 0,
                    modules_completed: 0,
                    quiz_results: {},
                    completed_missions: [],
                    last_active: new Date().toISOString(),
                });

                if (insertError) throw insertError;

                localStorage.setItem('condense_active_session', username);
                localStorage.setItem('condense_active_company', company.trim());
                onStart(username, company.trim(), false);

            } else {
                if (!existingUser || fetchError) {
                    setError('Identity not found. Please initialize access.');
                    setLoading(false);
                    return;
                }

                if (existingUser.passcode !== passcode.trim()) {
                    setError('Invalid Secure Passcode.');
                    setLoading(false);
                    return;
                }

                await supabase.from('users')
                    .update({ last_active: new Date().toISOString() })
                    .eq('username', username);

                localStorage.setItem('condense_active_session', username);
                localStorage.setItem('condense_active_company', existingUser.company_code);
                onStart(username, existingUser.company_code, true);
            }
        } catch (err) {
            console.error('Login Error', err);
            setError('Connection error. Please check your internet and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle light background blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-100/40 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-100/40 blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-[480px] relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 mb-8 border border-blue-200 shadow-md">
                        <Cpu className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-3">
                        Condense<span className="text-blue-600">.</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium tracking-widest uppercase">
                        Enterprise Playbook
                    </p>
                </motion.div>

                <Card
                    delay={0.2}
                    className="p-8 md:p-10 bg-white border border-gray-200 shadow-xl relative overflow-hidden rounded-[2.5rem]"
                >
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2 transition-colors group-focus-within:text-blue-600">
                                <ShieldCheck className="w-3.5 h-3.5" /> Full Identity
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-lg"
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
                                    <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2 mt-2">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Division Code
                                    </label>
                                    <input
                                        id="company"
                                        type="text"
                                        required={isSignUp}
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-lg"
                                        placeholder="Enter access code..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2 group">
                            <label htmlFor="passcode" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2 mt-2 transition-colors group-focus-within:text-blue-600">
                                <Key className="w-3.5 h-3.5" /> Secure Passcode
                            </label>
                            <input
                                id="passcode"
                                type="password"
                                required
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-lg tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !name.trim() || !passcode.trim() || (isSignUp && !company.trim())}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                            {loading ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>{isSignUp ? 'Initialize Access' : 'Authenticate'}</span>
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </motion.button>

                        <div className="pt-4 text-center border-t border-gray-200 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors tracking-wide"
                            >
                                {isSignUp
                                    ? 'Already registered? Authenticate here.'
                                    : 'Need access? Initialize an identity.'}
                            </button>
                        </div>

                        <p className="text-center text-xs font-medium tracking-widest uppercase text-gray-400 pt-2">
                            Secure Data Terminal • E2E Encrypted
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};
