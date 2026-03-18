import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from './GameStateContext';
import { Trophy, ShieldAlert, Cpu, Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
// AI calls go through /api/chat (Vercel serverless function) to keep the API key server-side

interface BossBattleProps {
    onComplete: () => void;
    onBack: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
}

interface Persona {
    id: string;
    name: string;
    title: string;
    icon: React.ReactNode;
    traits: string[];
    initialMessage: string;
    systemContext: string;
    patience: number;
    color: string;
}

// AI is proxied through /api/chat — no client-side API key needed

export const BossBattle: React.FC<BossBattleProps> = ({ onComplete, onBack }) => {
    const { addXP, completeMission } = useGameState();
    
    const personas: Record<string, Persona> = {
        developer: {
            id: 'developer',
            name: 'Alex Rivera',
            title: 'Senior Backend Engineer',
            icon: <Bot className="w-8 h-8" />,
            traits: ['Pragmatic', 'Technical', 'Rust Enthusiast', 'Loathes Boilerplate'],
            patience: 6,
            color: 'emerald',
            initialMessage: "I'm reviewing our Kafka consumer logic. We've got massive rebalancing issues and the Java boilerplate is killing us. Why should I care about Condense?",
            systemContext: "You are Alex Rivera, a cynical Senior Backend Engineer who loves Rust and hates high-latency Java systems. You care about DX (Developer Experience), performance, and safety."
        },
        devops: {
            id: 'devops',
            name: 'Sarah Jenkins',
            title: 'Lead SRE',
            icon: <ShieldAlert className="w-8 h-8" />,
            traits: ['Stability-focused', 'On-call Warrior', 'Hates Zookeeper', 'Metric-driven'],
            patience: 5,
            color: 'cyan',
            initialMessage: "Our Zookeeper ensemble just shat itself for the third time this week. I'm tired of babysitting clusters. Does Condense actually solve the ops overhead or is it just another wrapper?",
            systemContext: "You are Sarah Jenkins, a battle-hardened SRE who is tired of Kafka operational complexity. You care about stability, ease of maintenance, and removing single points of failure like Zookeeper."
        },
        lead: {
            id: 'lead',
            name: 'Michael Chen',
            title: 'Engineering Lead',
            icon: <Cpu className="w-8 h-8" />,
            traits: ['Architecture-focused', 'Scalability-obsessed', 'Team-oriented', 'Risk-averse'],
            patience: 6,
            color: 'indigo',
            initialMessage: "We're planning our next-gen data platform. Kafka is the default, but the microservice sprawl is getting out of hand. How does Condense simplify my architecture?",
            systemContext: "You are Michael Chen, an Engineering Lead managing multiple teams. You care about architectural simplicity, team velocity, and long-term scalability without microservice sprawl."
        },
        vp: {
            id: 'vp',
            name: 'Elena Rodriguez',
            title: 'VP of Engineering',
            icon: <Trophy className="w-8 h-8" />,
            traits: ['Strategic', 'Velocity-driven', 'Budget-conscious', 'Talent-focused'],
            patience: 5,
            color: 'purple',
            initialMessage: "My main concern is hiring. Finding Kafka experts is hard and expensive. Does Condense allow my existing team to build real-time systems without a PhD in distributed systems?",
            systemContext: "You are Elena Rodriguez, VP of Engineering at a fast-growing startup. You care about team productivity, hiring efficiency, and how fast your team can ship features using real-time data."
        },
        executive: {
            id: 'executive',
            name: 'David Chen',
            title: 'CTO',
            icon: <Bot className="w-8 h-8" />,
            traits: ['Skeptical', 'Budget-focused', 'Compliance-obsessed', 'Hates Buzzwords'],
            patience: 4,
            color: 'red',
            initialMessage: "Who is this? My EA said someone from 'Condense' was trying to breach my calendar regarding our Kafka limits. Look, AWS MSK is astronomical. What's the bottom line?",
            systemContext: "You are David Chen, the highly skeptical CTO of a Fortune 500. You care about TCO, security compliance, BYOC benefits, and absolute reliability."
        },
        owner: {
            id: 'owner',
            name: 'Marcus Thorne',
            title: 'Business Owner',
            icon: <User className="w-8 h-8" />,
            traits: ['ROI-focused', 'Market-speed driven', 'Customer-obsessed', 'Non-technical'],
            patience: 5,
            color: 'amber',
            initialMessage: "We're losing customers because our dashboard takes 10 minutes to update. My team says they need more 'Kafka brokers'. I just want it to be real-time. Can you fix this?",
            systemContext: "You are Marcus Thorne, founder of a logistics company. You are not deeply technical but understand the business impact of data latency. You care about ROI, customer satisfaction, and speed to market."
        }
    };

    const [gamePhase, setGamePhase] = useState<'selecting' | 'playing' | 'won' | 'lost'>('selecting');
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputPattern, setInputPattern] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [turnsLeft, setTurnsLeft] = useState(6);
    const [battleStatus, setBattleStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startBattle = (persona: Persona) => {
        setSelectedPersona(persona);
        setTurnsLeft(persona.patience);
        setMessages([
            {
                id: 'system-1',
                role: 'system',
                content: `SYSTEM INITIALIZED: You are challenging ${persona.name}, ${persona.title}. Context: ${persona.traits.join(', ')}.`
            },
            {
                id: 'bot-1',
                role: 'model',
                content: persona.initialMessage
            }
        ]);
        setGamePhase('playing');
        setBattleStatus('playing');
    };

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputPattern.trim() || battleStatus !== 'playing') return;

        const userText = inputPattern.trim();
        setInputPattern('');

        const newUserMessage: Message = {
            id: `user - ${Date.now()} `,
            role: 'user',
            content: userText
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        try {
            // Construct the context history
            const historyText = messages
                .filter(m => m.role !== 'system')
                .map(m => `${m.role === 'model' ? 'Opponent:' : 'Sales Rep:'} ${m.content} `)
                .join("\n\n");

            const prompt = `
            ${selectedPersona?.systemContext}
            You are talking to a sales rep from a company called "Condense". Condense is a cloud-native streaming data platform built on Rust that replaces Kafka, eliminates Zookeeper, scales infinitely, and uses a BYOC (Bring Your Own Cloud) model inside the customer's VPC.
            
            Current Conversation History:
            ${historyText}
            Sales Rep: ${userText}
            
            Your Rules:
            1. Stay in character based on your title: ${selectedPersona?.title}.
            2. You are skeptical and hard to impress. You hate buzzwords.
            3. If the sales rep uses generic sales talk (e.g. "synergy", "best-in-class"), push back hard.
            4. If the sales rep brings up specific Condense features like BYOC, Rust, True Serverless, or eliminating Zookeeper, act slightly impressed and ask a deeper question relevant to your role (${selectedPersona?.title}).
            5. If the sales rep successfully impresses you 3 or more times, end with the EXACT phrase "[[PITCH_SUCCESSFUL]]".
            6. If you are not impressed, do NOT say the phrase. Be dismissive.

            Respond in 2-3 short, punchy sentences.
            `;

            // Call our secure server-side proxy (api/chat.ts) — API key never leaves the server
            const proxyRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!proxyRes.ok) {
                const errorData = await proxyRes.json() as { detail?: string, error?: string };
                throw new Error(errorData.detail || errorData.error || `Proxy error: ${proxyRes.status}`);
            }

            const proxyData = await proxyRes.json() as { text?: string; error?: string };
            const botText = proxyData.text || "I'm busy, send me an email later.";

            const isWin = botText.includes('[[PITCH_SUCCESSFUL]]');
            const cleanBotText = botText.replace('[[PITCH_SUCCESSFUL]]', '').trim();

            const newBotMessage: Message = {
                id: `bot - ${Date.now()} `,
                role: 'model',
                content: cleanBotText
            };

            setMessages(prev => [...prev, newBotMessage]);

            if (isWin) {
                setBattleStatus('won');
                addXP(2000);
            } else if (turnsLeft - 1 <= 0) {
                setBattleStatus('lost');
            } else {
                setTurnsLeft(prev => prev - 1);
            }

        } catch (error: any) {
            console.error("Gemini API Error:", error);
            const errorMessage = error.message || 'Could not reach the CTO.';
            setMessages(prev => [...prev, {
                id: `error - ${Date.now()} `,
                role: 'system',
                content: `SYSTEM CONNECTION ERROR: ${errorMessage} \n\nPlease ensure GEMINI_API_KEY is properly set in Vercel environment variables and the app is REDEPLOYED.`
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (gamePhase === 'selecting') {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block p-3 bg-red-500/20 rounded-2xl border border-red-500/30 mb-6"
                    >
                        <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
                        CHOOSE YOUR <span className="text-red-500">OPPONENT</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        The "Architect" battle isn't just one person. Select who you want to challenge. Each has different priorities, levels of technical depth, and patience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(personas).map((persona, index) => (
                        <motion.button
                            key={persona.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startBattle(persona)}
                            className={`group text-left p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-${persona.color}-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.1)]`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-${persona.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-${persona.color}-500/20 border border-${persona.color}-500/30 flex items-center justify-center text-${persona.color}-500 group-hover:scale-110 transition-transform`}>
                                    {persona.icon}
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(persona.patience)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full bg-${persona.color}-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]`} />
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">{persona.name}</h3>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">{persona.title}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                    {persona.traits.map(trait => (
                                        <span key={trait} className="px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-4 bg-zinc-900 text-zinc-400 font-bold rounded-xl hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (battleStatus === 'won') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-950 border-2 border-emerald-500/50 p-12 sm:p-20 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.2)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-emerald-500/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-32 h-32 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/50"
                    >
                        <Trophy className="w-16 h-16" />
                    </motion.div>

                    <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        {selectedPersona?.id === 'owner' ? 'DEAL CLOSED' : 'ARCHITECT CONVINCED'}
                    </h2>

                    <p className="text-zinc-300 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Incredible pitch. You successfully navigated the objections of <strong>{selectedPersona?.name}</strong>, proved the superiority of Condense, and achieved mastery.
                        You have earned <strong className="text-emerald-400 text-3xl mx-2">+2000 XP</strong>.
                    </p>

                    <button
                        onClick={() => {
                            completeMission('boss-battle');
                            onComplete();
                        }}
                        className="px-12 py-6 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] text-xl w-full sm:w-auto uppercase tracking-wider relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    if (battleStatus === 'lost') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-950 border-2 border-red-500/50 p-12 sm:p-20 rounded-[3rem] shadow-[0_0_100px_rgba(239,68,68,0.2)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-red-500/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-32 h-32 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(239,68,68,0.4)] ring-1 ring-red-500/50"
                    >
                        <ShieldAlert className="w-16 h-16" />
                    </motion.div>

                    <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                        PITCH FAILED
                    </h2>

                    <p className="text-zinc-300 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        {selectedPersona?.name} was not impressed. Your explanations were either too technical, too vague, or didn't address their specific core concerns.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setGamePhase('selecting')}
                            className="px-8 py-6 bg-zinc-900 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 border border-zinc-800 transition-all text-xl uppercase tracking-wider"
                        >
                            Change Opponent
                        </button>
                        <button
                            onClick={() => {
                                if (selectedPersona) startBattle(selectedPersona);
                            }}
                            className="px-12 py-6 bg-red-600/80 text-white font-bold rounded-2xl hover:bg-red-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] text-xl uppercase tracking-wider relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            Retry Challenge
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Header / Boss HP Bar Equivalent */}
            <div className="mb-8 bg-zinc-950 border border-red-500/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-50" />

                <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto mb-6 sm:mb-0">
                    <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-2xl flex items-center justify-center text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                        <Cpu className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{selectedPersona?.name}</h2>
                        <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{selectedPersona?.title}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-red-500/30 hover:border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-end">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                            Patience Remaining
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(selectedPersona?.patience || 6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-5 h-2 rounded-sm ${i < turnsLeft ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative"
            >

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'} `}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`
                                max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5
                                ${message.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none shadow-[0_5px_15px_rgba(16,185,129,0.2)]' :
                                        message.role === 'system' ? 'bg-zinc-900/80 border border-zinc-700/50 text-zinc-400 text-sm font-medium tracking-wide text-center uppercase rounded-xl' :
                                            'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none shadow-lg'
                                    }
                            `}>
                                {(message.role === 'user' || message.role === 'model') && (
                                    <div className="flex items-center gap-2 mb-2 opacity-70">
                                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {message.role === 'user' ? 'You (Sales)' : `${selectedPersona?.name} (${selectedPersona?.title})`}
                                        </span>
                                    </div>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </motion.div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none p-5 flex items-center gap-3 text-zinc-400">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                <span className="text-sm font-medium">{selectedPersona?.name} is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 sm:p-6 bg-zinc-900 border-t border-zinc-800">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputPattern}
                            onChange={(e) => setInputPattern(e.target.value)}
                            disabled={isTyping || battleStatus !== 'playing'}
                            placeholder="Type your pitch response..."
                            className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-2xl pl-6 pr-16 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        />
                        <button
                            type="submit"
                            disabled={!inputPattern.trim() || isTyping || battleStatus !== 'playing'}
                            className="absolute right-3 bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </form>
                    <div className="mt-3 flex justify-between items-center text-xs text-zinc-500 px-2 font-medium">
                        <span>Powered by Gemini AI</span>
                        <span>{turnsLeft} attempts remaining</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
