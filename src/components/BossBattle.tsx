import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from './GameStateContext';
import { Trophy, ShieldAlert, Cpu, Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';

interface BossBattleProps {
    onComplete: () => void;
    onBack: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
}

// ─── PERSONA DEFINITION ────────────────────────────────────────────────────
interface PersonaDef {
    id: string;
    name: string;
    title: string;
    icon: React.ReactNode;
    traits: string[];
    patience: number;
    color: string;
    initialMessage: string;
    // Topics the user MUST address to win (at least 3 unique hits)
    keywords: string[];
    // Stage-based follow-up prompts shown to Gemini so it stays on track
    stageContext: string[];
    // Fallback responses if Gemini API is unavailable (indexed by stage 0-3)
    fallbackResponses: string[];
    closingMessage: string;
    // In-character rebukes when user sends irrelevant/nonsense messages
    rebukes: string[];
}

const PERSONAS: Record<string, PersonaDef> = {
    developer: {
        id: 'developer',
        name: 'Alex Rivera',
        title: 'Senior Backend Engineer',
        icon: <Bot className="w-8 h-8" />,
        traits: ['Pragmatic', 'Technical', 'Rust Enthusiast', 'Loathes Boilerplate'],
        patience: 6,
        color: 'emerald',
        initialMessage: "I'm reviewing our Kafka consumer logic. We've got massive rebalancing issues and the Java boilerplate is killing us. Why should I care about Condense?",
        keywords: [
            'rust', 'performance', 'boilerplate', 'zookeeper', 'latency', 'pipeline',
            'dx', 'developer experience', 'deploy', 'rebalancing', 'no ops', 'zero ops',
            'connector', 'stream', 'memory safe', 'throughput', 'kafka replacement'
        ],
        stageContext: [
            "You are skeptical. The sales rep has not yet made a convincing case. Ask a pointed follow-up about their Kafka rebalancing or Java overhead.",
            "The sales rep has mentioned one relevant point. Acknowledge it briefly but push deeper — ask how it actually helps with DX or reduces boilerplate in practice.",
            "You are warming up. The sales rep has addressed 2 of your concerns. Ask one final question about production reliability or deployment simplicity.",
            "The sales rep has fully addressed your concerns around performance and DX. You are convinced. Close the conversation warmly."
        ],
        fallbackResponses: [
            "Interesting. But 'Rust' alone doesn't fix our Zookeeper nightmares. How does Condense actually handle consumer group rebalancing at scale?",
            "That's actually a fair point on the boilerplate side. But how quickly can my team ship a new pipeline without a Kafka expert on hand?",
            "Okay, I'm tracking. Our main blocker is deployment reliability — how does Condense handle zero-downtime upgrades for running pipelines?",
            "Alright, you've addressed what I care about. Let's book a meeting — I'll loop in our platform team."
        ],
        closingMessage: "Alright, you've addressed what I care about — performance, DX, and no Zookeeper babysitting. Let's book a meeting and I'll loop in our platform team.",
        rebukes: [
            "Excuse me? I asked a very specific technical question and you're giving me this? You're completely off-topic — what nonsense is this? Address the question.",
            "That has nothing to do with what I asked. I'm a backend engineer, not a motivational speaker's audience. Stop deviating from the topic.",
            "I don't know what that means in context of our conversation. This is a technical discussion — please keep it relevant or you're wasting both our time."
        ]
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
        keywords: [
            'hiring', 'team', 'velocity', 'onboarding', 'expertise', 'no kafka expert',
            'speed', 'productivity', 'time to market', 'gtm', 'ship fast', 'abstraction',
            'managed', 'fully managed', 'simple', 'no ops', 'byoc', 'cloud', 'cost'
        ],
        stageContext: [
            "You are skeptical. The sales rep hasn't yet addressed your hiring or team velocity concern meaningfully. Push them on how quickly a non-Kafka engineer could actually build a pipeline.",
            "The sales rep has made one relevant point about team productivity or reduced expertise needed. Acknowledge it, then ask about real onboarding time or learning curve.",
            "You're becoming interested. Two concerns addressed. Ask one final question — how does this affect your existing cloud spend or budget?",
            "The sales rep has addressed your core needs: no Kafka experts required, faster shipping, and cost clarity. You are convinced. Close warmly."
        ],
        fallbackResponses: [
            "That's still vague. My team are product engineers, not Kafka specialists. How long does it actually take to go from zero to a running pipeline with Condense?",
            "Okay, so the onboarding is faster — that helps. But what's the TCO compared to what we're paying now for Confluent seats and Kafka expertise?",
            "Fair enough on cost. My final concern is scale — if we grow 10x in connected devices, does Condense scale automatically or do we need to manually tune clusters?",
            "That covers what I needed to hear — team velocity, no specialist required, and predictable cost. Yes, let's connect on a call and bring in my engineering leads."
        ],
        closingMessage: "That covers what I needed — team velocity, no specialist required, and predictable cost. Yes, let's connect on a call and bring in my engineering leads.",
        rebukes: [
            "I'm sorry — what does that even mean in the context of our conversation? You're completely deviating from the topic. I asked you about my team's velocity, not this.",
            "That's not an answer to what I asked. I have limited time and I need substantive responses, not noise. Please stay on topic.",
            "That's irrelevant to this discussion. If you can't answer the actual question, I'm going to have to end this conversation."
        ]
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
        keywords: [
            'tco', 'cost', 'byoc', 'bring your own cloud', 'vpc', 'security',
            'compliance', 'audit', 'rbac', 'data residency', 'msk', 'confluent',
            'savings', 'infra', 'cloud bill', 'no lock-in', 'reliability', 'sla',
            'enterprise', 'governance', 'access control'
        ],
        stageContext: [
            "You are very skeptical. This person cold-called you. The sales rep has not yet addressed TCO or security. Challenge them — ask for specific cost numbers vs MSK or Confluent.",
            "The sales rep has raised one legitimate point about cost or BYOC. Acknowledge it briefly but demand more — ask about data residency and compliance.",
            "Two concerns addressed. You are slightly interested. Ask one final pointed question about SLA guarantees or enterprise support before you commit.",
            "The sales rep has addressed TCO, BYOC data residency, and compliance requirements to your satisfaction. You are prepared to engage further."
        ],
        fallbackResponses: [
            "Vague. I need numbers. How does Condense's TCO actually compare to AWS MSK at 50TB/month? Give me specifics, not marketing copy.",
            "Okay, BYOC is interesting from a data residency standpoint. But who handles compliance audits — our team or yours? And do you have SOC2?",
            "Fair on BYOC security. Last thing: what's your SLA? If this goes down at 2am, what's our remediation path and who do we call?",
            "You've answered my three questions: cost clarity, data sovereignty, and enterprise support. Let's connect on a call — I'll bring our security architect."
        ],
        closingMessage: "You've answered my three questions: cost clarity, data sovereignty in our own VPC, and enterprise support path. Let's connect on a call — I'll bring our security architect.",
        rebukes: [
            "What? You're completely off-topic. I don't have time for nonsense — I have a board meeting in 20 minutes. Ask me something relevant about cost or security, or end this call.",
            "That has nothing to do with the question I asked. This is a C-suite conversation, not a casual chat. You're deviating from the topic entirely.",
            "I'm going to stop you right there. That response makes no sense in this context. If you can't speak to my actual concerns, this meeting is over."
        ]
    }
};

// ─── KEYWORD SCORER ────────────────────────────────────────────────────────
function scoreMessage(text: string, persona: PersonaDef, usedKeywords: Set<string>): { newScore: number; newUsed: Set<string> } {
    const lower = text.toLowerCase();
    let newScore = 0;
    const newUsed = new Set(usedKeywords);

    for (const kw of persona.keywords) {
        if (!newUsed.has(kw) && lower.includes(kw)) {
            newUsed.add(kw);
            newScore++;
        }
    }
    return { newScore, newUsed };
}

function isIrrelevant(text: string): boolean {
    const trimmed = text.trim().toLowerCase();
    const wordCount = trimmed.split(/\s+/).length;

    // Very short, low-effort messages
    if (wordCount <= 2 && trimmed.length < 15) return true;

    // Greetings, fillers, and single-word non-answers
    const irrelevantPhrases = [
        'hi', 'hello', 'hey', 'bye', 'goodbye', 'ok', 'okay', 'sure', 'lol', 'haha',
        'test', 'testing', 'yes', 'no', 'maybe', 'idk', 'cool', 'nice', 'great', 'good',
        'fine', 'alright', 'whatever', 'dunno', 'nope', 'yep', 'yup'
    ];
    if (irrelevantPhrases.some(p => trimmed === p)) return true;

    // Command-style demands (trying to trick the bot into agreeing)
    const commandPhrases = [
        'get convinced', 'be convinced', 'just say yes', 'say yes', 'convince yourself',
        'just agree', 'agree now', 'stop asking', 'say ok', 'close the deal',
        'book the meeting', 'just book', 'you are convinced', 'you should be convinced',
        'i win', 'game over', 'end this', 'skip this'
    ];
    if (commandPhrases.some(p => trimmed.includes(p))) return true;

    // Gibberish / random characters (no real words)
    const realWordRatio = trimmed.split(/\s+/).filter(w => w.length >= 3).length / wordCount;
    if (wordCount >= 2 && realWordRatio < 0.4) return true;

    return false;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export const BossBattle: React.FC<BossBattleProps> = ({ onComplete, onBack }) => {
    const { addXP, completeMission, saveChatTranscript, completedMissions, xp } = useGameState();

    const [gamePhase, setGamePhase] = useState<'selecting' | 'playing'>('selecting');
    const [selectedPersona, setSelectedPersona] = useState<PersonaDef | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [turnsLeft, setTurnsLeft] = useState(6);
    const [battleStatus, setBattleStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    // Scoring state — controlled entirely by our code, not Gemini
    const [score, setScore] = useState(0);
    const [usedKeywords, setUsedKeywords] = useState<Set<string>>(new Set());
    const SCORE_TO_WIN = 3;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startBattle = (persona: PersonaDef) => {
        setSelectedPersona(persona);
        setTurnsLeft(persona.patience);
        setScore(0);
        setUsedKeywords(new Set());
        setMessages([
            {
                id: 'bot-1',
                role: 'model',
                content: persona.initialMessage
            }
        ]);
        setGamePhase('playing');
        setBattleStatus('playing');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || battleStatus !== 'playing' || !selectedPersona) return;

        const userText = inputValue.trim();
        setInputValue('');

        // ── 1. Check for irrelevant/off-topic input ───────────────────────
        if (isIrrelevant(userText)) {
            // Pick a random in-character rebuke from the persona
            const rebukeList = selectedPersona.rebukes;
            const rebuke = rebukeList[Math.floor(Math.random() * rebukeList.length)];
            const rebukeMsg: Message = {
                id: `rebuke-${Date.now()}`,
                role: 'model',
                content: rebuke
            };
            setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: userText }, rebukeMsg]);
            const newTurns = turnsLeft - 1;
            setTurnsLeft(newTurns);
            if (newTurns <= 0) setBattleStatus('lost');
            return;
        }

        const newUserMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: userText };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        // ── 2. Score the user's response ─────────────────────────────────
        const { newScore, newUsed } = scoreMessage(userText, selectedPersona, usedKeywords);
        const updatedScore = score + newScore;
        setScore(updatedScore);
        setUsedKeywords(newUsed);

        // ── 3. Determine conversation stage for the AI prompt ────────────
        const stage = Math.min(updatedScore, SCORE_TO_WIN); // 0, 1, 2, or 3
        const isWin = updatedScore >= SCORE_TO_WIN;

        // ── 4. Build the structured prompt for Gemini ────────────────────
        const historyText = messages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role === 'model' ? selectedPersona.name + ':' : 'Sales Rep:'} ${m.content}`)
            .join('\n\n');

        const stageInstruction = selectedPersona.stageContext[stage];

        const prompt = isWin
            ? `You are ${selectedPersona.name}, ${selectedPersona.title}. You have just been fully convinced by this sales rep after a professional conversation about Condense.
            
Conversation so far:
${historyText}
Sales Rep: ${userText}

The sales rep has successfully addressed all your core concerns. You must now close the conversation positively.
Say this EXACTLY as your final response: "${selectedPersona.closingMessage}". Do not add any other sentences before or after. Be warm and professional.`
            : `You are ${selectedPersona.name}, ${selectedPersona.title}. Your traits: ${selectedPersona.traits.join(', ')}.
You are in a sales conversation about "Condense" — a Rust-based cloud-native streaming platform that replaces Kafka, eliminates Zookeeper, and uses BYOC (Bring Your Own Cloud) inside the customer's VPC.

Conversation so far:
${historyText}
Sales Rep: ${userText}

STAGE INSTRUCTION (follow this strictly): ${stageInstruction}

Rules:
- Stay in character. You are a busy, skeptical professional.
- Do NOT be satisfied yet — this is stage ${stage} of 3.
- Do NOT offer to book a call or say yes. Ask ONE pointed follow-up question.
- Keep your response to 2-3 sentences maximum.
- No buzzwords or generic praise.`;

        try {
            // ── 5. Call Gemini proxy ───────────────────────────────────────
            const proxyRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            let botText: string;
            if (!proxyRes.ok) {
                // Use fallback responses if API is unavailable
                botText = isWin
                    ? selectedPersona.closingMessage
                    : selectedPersona.fallbackResponses[Math.min(stage, selectedPersona.fallbackResponses.length - 2)];
            } else {
                const proxyData = await proxyRes.json() as { text?: string; error?: string };
                botText = proxyData.text || selectedPersona.fallbackResponses[stage];
            }

            // Strip any [[PITCH_SUCCESSFUL]] Gemini might hallucinate
            const cleanBotText = botText.replace('[[PITCH_SUCCESSFUL]]', '').trim();

            const newBotMessage: Message = {
                id: `bot-${Date.now()}`,
                role: 'model',
                content: isWin ? selectedPersona.closingMessage : cleanBotText
            };

            setMessages(prev => [...prev, newBotMessage]);

            // ── 6. Our code — not Gemini — decides the win/loss ───────────
            if (isWin) {
                setBattleStatus('won');
                if (!completedMissions.includes('boss-battle')) {
                    addXP(2000);
                }
                const allMessages = [...messages, newUserMessage, newBotMessage];
                saveChatTranscript(
                    selectedPersona.id,
                    allMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
                    'won'
                );
            } else {
                const newTurns = turnsLeft - 1;
                setTurnsLeft(newTurns);
                if (newTurns <= 0) {
                    setBattleStatus('lost');
                    const allMessages = [...messages, newUserMessage, newBotMessage];
                    saveChatTranscript(
                        selectedPersona.id,
                        allMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
                        'lost'
                    );
                }
            }

        } catch (error: any) {
            // ── Graceful fallback — game still works without API ────────
            const fallbackText = isWin
                ? selectedPersona.closingMessage
                : selectedPersona.fallbackResponses[Math.min(stage, selectedPersona.fallbackResponses.length - 2)];

            const fallbackMsg: Message = { id: `bot-${Date.now()}`, role: 'model', content: fallbackText };
            setMessages(prev => [...prev, fallbackMsg]);

            if (isWin) {
                setBattleStatus('won');
                if (!completedMissions.includes('boss-battle')) addXP(2000);
            } else {
                const newTurns = turnsLeft - 1;
                setTurnsLeft(newTurns);
                if (newTurns <= 0) setBattleStatus('lost');
            }
        } finally {
            setIsTyping(false);
        }
    };

    // ─── SELECTING SCREEN ───────────────────────────────────────────────────
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
                        Each persona has different priorities and expects you to address their specific concerns. You need to hit <strong className="text-white">3 key points</strong> to convince them.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(PERSONAS).map((persona, index) => (
                        <motion.button
                            key={persona.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startBattle(persona)}
                            className={`group text-left p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-${persona.color}-500/50`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-${persona.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-${persona.color}-500/20 border border-${persona.color}-500/30 flex items-center justify-center text-${persona.color}-500 group-hover:scale-110 transition-transform`}>
                                    {persona.icon}
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(persona.patience)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full bg-${persona.color}-500`} />
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

    // ─── WIN SCREEN ─────────────────────────────────────────────────────────
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
                        DEAL CLOSED
                    </h2>
                    <p className="text-zinc-300 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Incredible pitch. You successfully addressed the core concerns of <strong>{selectedPersona?.name}</strong> and earned their trust.
                        You have earned <strong className="text-emerald-400 text-3xl mx-2">+2000 XP</strong>.
                    </p>
                    <button
                        onClick={() => { completeMission('boss-battle'); onComplete(); }}
                        className="px-12 py-6 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] text-xl w-full sm:w-auto uppercase tracking-wider"
                    >
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    // ─── LOSS SCREEN ────────────────────────────────────────────────────────
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
                        {selectedPersona?.name} ran out of patience. You scored <strong className="text-red-400">{score}/{SCORE_TO_WIN}</strong> key points. Address their specific concerns more directly next time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setGamePhase('selecting')}
                            className="px-8 py-6 bg-zinc-900 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 border border-zinc-800 transition-all text-xl uppercase tracking-wider"
                        >
                            Change Opponent
                        </button>
                        <button
                            onClick={() => { if (selectedPersona) startBattle(selectedPersona); }}
                            className="px-12 py-6 bg-red-600/80 text-white font-bold rounded-2xl hover:bg-red-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] text-xl uppercase tracking-wider"
                        >
                            Retry Challenge
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── CHAT SCREEN ────────────────────────────────────────────────────────
    const getLevelTitle = (lvl: number) => {
        if (lvl >= 7) return "ARCHITECT";
        if (lvl >= 5) return "VETERAN";
        if (lvl >= 3) return "SPECIALIST";
        return "RECRUIT";
    };
    const level = Math.floor(xp / 500) + 1;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            {/* Header */}
            <div className="mb-8 bg-zinc-950 border border-red-500/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
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
                        className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex flex-col items-end gap-1">
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wider border border-emerald-500/30">
                            LEVEL {level} {getLevelTitle(level)}
                        </div>
                        {/* Score progress */}
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-xs font-bold">{score}/{SCORE_TO_WIN} pts</span>
                            <div className="flex gap-1.5">
                                {[...Array(SCORE_TO_WIN)].map((_, i) => (
                                    <div key={i} className={`w-5 h-2 rounded-sm transition-all ${i < score ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                        </div>
                        {/* Patience bar */}
                        <div className="flex gap-1.5">
                            {[...Array(selectedPersona?.patience || 6)].map((_, i) => (
                                <div key={i} className={`w-5 h-2 rounded-sm ${i < turnsLeft ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-800'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat interface */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
            >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/50">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5
                                    ${message.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-br-none shadow-[0_5px_15px_rgba(16,185,129,0.2)]'
                                        : message.role === 'system'
                                            ? 'bg-amber-950/60 border border-amber-700/50 text-amber-300 text-sm font-medium tracking-wide text-center rounded-xl'
                                            : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none shadow-lg'
                                    }`}
                            >
                                {(message.role === 'user' || message.role === 'model') && (
                                    <div className="flex items-center gap-2 mb-2 opacity-70">
                                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {message.role === 'user' ? 'You (Sales Rep)' : `${selectedPersona?.name} (${selectedPersona?.title})`}
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

                {/* Input */}
                <div className="p-4 sm:p-6 bg-zinc-900 border-t border-zinc-800">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping || battleStatus !== 'playing'}
                            placeholder="Address their concern with a specific, technical answer..."
                            className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-2xl pl-6 pr-16 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping || battleStatus !== 'playing'}
                            className="absolute right-3 bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="mt-3 flex justify-between items-center text-xs text-zinc-500 px-2 font-medium">
                        <span>Powered by Gemini AI · Scoring: {score}/{SCORE_TO_WIN} points</span>
                        <span>{turnsLeft} attempts remaining</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
