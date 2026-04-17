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
    keywords: string[];
    stageContext: string[];
    fallbackResponses: string[];
    closingMessage: string;
    rebukes: string[];
    dismissalMessage: string;
}

const PERSONAS: Record<string, PersonaDef> = {
    developer: {
        id: 'developer',
        name: 'Alex Rivera',
        title: 'Senior Backend Engineer',
        icon: <Bot className="w-8 h-8" />,
        traits: ['Pragmatic', 'Technical', 'Rust Enthusiast', 'Loathes Boilerplate'],
        patience: 7,
        color: 'emerald',
        initialMessage: "I'm reviewing our Kafka consumer logic. We've got massive rebalancing issues and the Java boilerplate is killing us. Why should I care about Condense?",
        keywords: [
            'rust', 'performance', 'boilerplate', 'zookeeper', 'latency', 'pipeline',
            'rebalancing', 'throughput', 'connector', 'stream', 'kafka',
            'fast', 'speed', 'efficient', 'simple', 'easy to use', 'easy to build',
            'no java', 'no overhead', 'less code', 'cleaner', 'simplify',
            'real-time', 'real time', 'data streaming', 'streaming platform',
            'replace kafka', 'kafka alternative', 'no zookeeper', 'eliminates zookeeper',
            'deploy in minutes', 'built on rust', 'cloud native', 'managed',
            'unified', 'single platform', 'no ops', 'zero ops', 'self managing',
            'scale', 'scalable', 'infinite scale', 'developer friendly'
        ],
        stageContext: [
            "Stage 0: The trainee has made no case yet. Ask a clear, simple question about how Condense handles Kafka rebalancing differently.",
            "Stage 1: One relevant point made. Ask a simple follow-up: how does Condense reduce boilerplate in day-to-day development?",
            "Stage 2: Two good points. Ask about production reliability — specifically, how does it handle zero-downtime deployments?",
            "Stage 3: Three solid points. Ask one final sales question: what's the business impact for a team switching from Kafka to Condense?",
            "Stage 4: The trainee has addressed all concerns. Close warmly and agree to a meeting."
        ],
        fallbackResponses: [
            "That's interesting — but how does Condense actually handle consumer group rebalancing at scale?",
            "Fair point on the boilerplate. But how quickly can my team ship a new pipeline without a Kafka expert?",
            "Okay, I'm following. Our main concern is deployment reliability — how does Condense handle zero-downtime upgrades?",
            "Alright, you've addressed what I care about. Let's book a meeting — I'll loop in our platform team."
        ],
        closingMessage: "Alright, you've addressed what I care about — performance, DX, and no Zookeeper babysitting. Let's book a meeting and I'll loop in our platform team.",
        rebukes: [
            "It looks like we've drifted off track a bit. Let's stay focused on the technical concerns — this is really important for moving forward.",
            "You seem to be deviating from the topic. Let's bring it back to the conversation about Condense and our pipeline challenges.",
            "I appreciate the interaction, but we really need to stay on topic here. What I need to hear is how Condense solves our Kafka rebalancing problem."
        ],
        dismissalMessage: "I'm afraid we've been unable to keep this conversation focused. Thank you for your time — let's reconnect when there's more to discuss on the technical side."
    },
    vp: {
        id: 'vp',
        name: 'Elena Rodriguez',
        title: 'VP of Engineering',
        icon: <Trophy className="w-8 h-8" />,
        traits: ['Strategic', 'Velocity-driven', 'Budget-conscious', 'Talent-focused'],
        patience: 6,
        color: 'purple',
        initialMessage: "My main concern is hiring. Finding Kafka experts is hard and expensive. Does Condense allow my existing team to build real-time systems without a PhD in distributed systems?",
        keywords: [
            'hiring', 'team', 'velocity', 'onboarding', 'expertise', 'byoc', 'cost',
            'managed', 'productivity', 'time to market',
            'no kafka expert', 'no specialist', 'no expert needed', 'anyone can use',
            'easy for my team', 'non-kafka', 'existing team', 'no phd',
            'ship fast', 'launch quickly', 'faster development', 'quick to deploy',
            'simple to use', 'plug and play', 'out of the box', 'ready to use',
            'fully managed', 'no ops', 'zero ops', 'cloud native',
            'saves money', 'reduce cost', 'cheaper', 'affordable', 'lower cost',
            'data streaming', 'real-time', 'real time', 'streaming platform',
            'scale', 'scalable', 'unified', 'single platform'
        ],
        stageContext: [
            "Stage 0: The trainee hasn't addressed hiring or team velocity yet. Ask simply: how quickly could a non-Kafka engineer build a working pipeline with Condense?",
            "Stage 1: One point noted. Ask about onboarding time — how long does it take a junior engineer to get productive with Condense?",
            "Stage 2: Two points addressed. Ask about cost — is Condense actually cheaper than their current Confluent or Kafka spend?",
            "Stage 3: Three solid answers. Ask a sales-focused final question: what's the overall ROI when teams switch from Kafka to Condense?",
            "Stage 4: All concerns addressed. Close warmly and suggest connecting on a call to loop in the engineering leads."
        ],
        fallbackResponses: [
            "That's still a bit vague. How long does it actually take to go from zero to a running pipeline with Condense?",
            "Okay, so onboarding is faster — that helps. But what's the total cost compared to what we're paying now for Confluent and Kafka expertise?",
            "Fair enough on cost. If we grow 10x in connected devices, does Condense scale automatically or do we need to manually tune clusters?",
            "That covers what I needed to hear — team velocity, no specialist required, and predictable cost. Yes, let's connect on a call."
        ],
        closingMessage: "That covers what I needed — team velocity, no specialist required, and predictable cost. Yes, let's connect on a call and bring in my engineering leads.",
        rebukes: [
            "It seems like we've gone a bit off course — let's refocus. I'd love to hear more about how Condense actually helps my team move faster.",
            "You're deviating from the topic, and I'd really like to stay on it. Let's talk specifically about team velocity and onboarding — that's what matters here.",
            "Let's make sure we stay on topic. Tell me more about how Condense helps non-Kafka engineers get up to speed."
        ],
        dismissalMessage: "I think we've lost track of what this conversation was about. Let's reconnect when you're ready to speak to our specific needs around team productivity."
    },
    executive: {
        id: 'executive',
        name: 'David Chen',
        title: 'CTO',
        icon: <Bot className="w-8 h-8" />,
        traits: ['Skeptical', 'Budget-focused', 'Compliance-obsessed', 'Hates Buzzwords'],
        patience: 6,
        color: 'red',
        initialMessage: "Who is this? My EA said someone from 'Condense' was trying to breach my calendar regarding our Kafka limits. Look, AWS MSK is astronomical. What's the bottom line?",
        keywords: [
            'tco', 'cost', 'byoc', 'vpc', 'security', 'compliance', 'audit',
            'rbac', 'msk', 'confluent', 'savings', 'reliability', 'sla', 'enterprise',
            'bring your own cloud', 'your own cloud', 'own infrastructure',
            'data residency', 'data stays', 'data in our cloud', 'no data leaving',
            'cheaper than', 'lower cost', 'reduce spend', 'cut costs', 'save money',
            'no vendor lock', 'no lock-in', 'vendor neutral', 'open',
            'security', 'secure', 'private', 'compliant', 'access control',
            'runs in our cloud', 'inside our vpc', 'in our account',
            'kafka managed', 'managed kafka', 'fully managed',
            'infra cost', 'cloud bill', 'aws cost', 'gcp cost', 'azure cost',
            'scale', 'scalable', 'reliable', 'uptime', 'support'
        ],
        stageContext: [
            "Stage 0: No TCO or security addressed yet. Ask a simple, direct question: how much cheaper is Condense vs your current MSK bill?",
            "Stage 1: One cost-related point raised. Ask about data residency — does data stay in our VPC, or does it leave our cloud?",
            "Stage 2: Two points addressed. Ask about compliance — who handles audits, and do they have enterprise certifications like SOC2?",
            "Stage 3: Three good answers. Ask a sales-focused final question: what's the typical ROI timeline for enterprises switching from MSK to Condense?",
            "Stage 4: TCO, data sovereignty, compliance, and support all addressed. Close professionally and agree to a call."
        ],
        fallbackResponses: [
            "I need numbers. How does Condense's cost actually compare to AWS MSK at 50TB/month?",
            "Okay, BYOC is interesting from a data residency standpoint. But who handles compliance audits — our team or yours?",
            "Fair on BYOC security. What's your SLA? If this goes down at 2am, what's our remediation path?",
            "You've answered my three questions: cost clarity, data sovereignty, and enterprise support. Let's connect on a call."
        ],
        closingMessage: "You've answered my three questions: cost clarity, data sovereignty in our own VPC, and enterprise support path. Let's connect on a call — I'll bring our security architect.",
        rebukes: [
            "I think we've gone off track — let's circle back. This is a business decision and I need focused answers around cost, security, and support.",
            "You're deviating from the topic. Let's stay focused on Condense and our cloud infrastructure needs.",
            "Let's keep this on track. I have limited time, and I need you to address the actual questions around cost savings and data residency."
        ],
        dismissalMessage: "I think we've moved too far from what this meeting was about. Thank you for your time — let's reconnect when the conversation can stay focused on our business requirements."
    }
};

// ─── KEYWORD SCORER (fallback only) ────────────────────────────────────────
function scoreMessage(text: string, persona: PersonaDef, usedKeywords: Set<string>): { newScore: number; newUsed: Set<string> } {
    const lower = text.toLowerCase();
    const newUsed = new Set(usedKeywords);
    let hitFound = false;

    for (const kw of persona.keywords) {
        if (!newUsed.has(kw) && lower.includes(kw)) {
            newUsed.add(kw);
            hitFound = true;
            break;
        }
    }
    return { newScore: hitFound ? 1 : 0, newUsed };
}

function isIrrelevant(text: string): boolean {
    const trimmed = text.trim().toLowerCase();
    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount <= 2 && trimmed.length < 15) return true;

    const irrelevantPhrases = [
        'hi', 'hello', 'hey', 'bye', 'goodbye', 'ok', 'okay', 'sure', 'lol', 'haha',
        'test', 'testing', 'yes', 'no', 'maybe', 'idk', 'cool', 'nice', 'great', 'good',
        'fine', 'alright', 'whatever', 'dunno', 'nope', 'yep', 'yup'
    ];
    if (irrelevantPhrases.some(p => trimmed === p)) return true;

    const commandPhrases = [
        'get convinced', 'be convinced', 'just say yes', 'say yes', 'convince yourself',
        'just agree', 'agree now', 'stop asking', 'say ok', 'close the deal',
        'book the meeting', 'just book', 'you are convinced', 'you should be convinced',
        'i win', 'game over', 'end this', 'skip this'
    ];
    if (commandPhrases.some(p => trimmed.includes(p))) return true;

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

    // Scoring state — controlled entirely by our code, not the AI
    const [score, setScore] = useState(0);
    const [usedKeywords, setUsedKeywords] = useState<Set<string>>(new Set());
    const [consecutiveFails, setConsecutiveFails] = useState(0);
    const SCORE_TO_WIN = 4;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startBattle = (persona: PersonaDef) => {
        setSelectedPersona(persona);
        setTurnsLeft(persona.patience);
        setScore(0);
        setUsedKeywords(new Set());
        setConsecutiveFails(0);
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
            const newTurns = turnsLeft - 1;
            setTurnsLeft(newTurns);

            let rebukeStr = '';
            if (newTurns <= 0) {
                rebukeStr = selectedPersona.dismissalMessage;
                setBattleStatus('lost');
            } else {
                const rebukeList = selectedPersona.rebukes;
                rebukeStr = rebukeList[Math.floor(Math.random() * rebukeList.length)];
            }

            const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: userText };
            const rebukeMsg: Message = { id: `rebuke-${Date.now()}`, role: 'model', content: rebukeStr };
            const allMessages: Message[] = [...messages, userMsg, rebukeMsg];
            setMessages(allMessages);

            if (newTurns <= 0) {
                saveChatTranscript(
                    selectedPersona.id,
                    allMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
                    'lost'
                );
            }
            return;
        }

        const newUserMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: userText };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        // ── 2. SEMANTIC EVALUATION ──────────────────────────────────────
        // evalResult: 'pass' | 'near' | 'partial' | 'fail'
        let evalResult = 'fail';
        let evalHint = '';
        try {
            const currentStageContext = selectedPersona.stageContext[Math.min(score, SCORE_TO_WIN)];
            const evalRes = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userText,
                    stageContext: currentStageContext,
                    personaName: selectedPersona.name,
                }),
            });
            const evalData = await evalRes.json();
            evalResult = evalData.result || 'fail';
            evalHint = evalData.hint || '';
        } catch (e) {
            console.error('Eval error', e);
            // Fallback to keyword matching if API fails
            const kw = scoreMessage(userText, selectedPersona, usedKeywords);
            evalResult = kw.newScore > 0 ? 'pass' : 'fail';
            if (kw.newScore > 0) setUsedKeywords(kw.newUsed);
        }

        const isPass    = evalResult === 'pass';
        const isNear    = evalResult === 'near';    // 80-90% correct
        const isPartial = evalResult === 'partial'; // partially correct, needs more depth
        const isFail    = evalResult === 'fail';

        const updatedScore = score + (isPass ? 1 : 0);
        if (isPass) {
            setScore(updatedScore);
            setConsecutiveFails(0);
        } else if (isNear || isPartial) {
            setConsecutiveFails(0); // They're on the right track — no penalty
        } else {
            setConsecutiveFails(prev => prev + 1);
        }

        // ── 3. Determine conversation stage ──────────────────────────────
        const stage = Math.min(updatedScore, SCORE_TO_WIN);
        const isWin = updatedScore >= SCORE_TO_WIN;

        // ── 4. Build coaching-oriented behavior instruction ───────────────
        // Stages 1-3 are sales-focused (last 3 questions)
        const salesFocusedContext = stage >= 1;
        const stageInstruction = selectedPersona.stageContext[stage];

        let behaviorInstruction = '';
        if (isWin) {
            behaviorInstruction = `The trainee has fully answered all your concerns. Close the deal warmly.`;
        } else if (isNear && evalHint) {
            behaviorInstruction = `The trainee is very close (80-90% correct). Start your response with exactly: "I feel you are trying to convey — ${evalHint}" and then gently ask a simplified follow-up to confirm the missing piece.`;
        } else if (isPartial && evalHint) {
            behaviorInstruction = `The trainee gave a partial answer. Acknowledge what they got right, then ask this focused follow-up: "${evalHint}"`;
        } else if (isFail && consecutiveFails >= 1) {
            behaviorInstruction = `The trainee is repeatedly giving completely off-topic, irrelevant, or incorrect responses. Give them a STRICT, professional warning that they are wasting your time, do NOT answer any unrelated questions, and ask the original question one last time.`;
        } else if (isFail) {
            behaviorInstruction = `The trainee gave a completely off-topic or incorrect response. STRICTLY remind them to remain professional, DO NOT answer any off-topic questions (like math or coding puzzles), and redirect them to focus on the business concern.`;
        } else {
            behaviorInstruction = stageInstruction;
        }

        const historyText = messages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role === 'model' ? selectedPersona.name + ':' : 'Trainee:'} ${m.content}`)
            .join('\n\n');

        // ── 5. Build the prompt ───────────────────────────────────────────
        const prompt = isWin
            ? `You are ${selectedPersona.name}, ${selectedPersona.title}. The trainee has successfully addressed all your concerns. Close the deal with this exact message and nothing else: "${selectedPersona.closingMessage}"`

            : `You are ${selectedPersona.name}, ${selectedPersona.title}. You are roleplaying as a prospect in a sales training exercise.

Your traits: ${selectedPersona.traits.join(', ')}.

About Condense (only use these facts — do not invent others):
- Cloud-native data streaming platform built on Rust, replaces Apache Kafka
- Eliminates Zookeeper entirely — no ops overhead
- Auto-scales infinitely, no manual partition tuning needed
- BYOC: deploys inside the customer's own VPC, data never leaves their cloud
- Developers define pipelines in code, no Kafka expertise required
- Cost model: infrastructure-only (no per-message fees like Confluent)

Conversation so far:
${historyText}
Trainee: ${userText}

Your task:
${behaviorInstruction}
${salesFocusedContext ? '\nIMPORTANT: Keep your response focused on the business and sales value of Condense (ROI, team productivity, simplicity, cost savings).' : ''}

Rules:
- CRITICAL: You are the PROSPECT, not the sales rep. You do not know about Condense. DO NOT explain the product. If the Trainee asks you what it is, remind them gently that they should be explaining it to you!
- STRICTLY IGNORE OFF-TOPIC QUESTIONS: If the Trainee asks you random questions (math, coding, jokes, facts), REFUSE to answer. Warn them strictly that this is a professional meeting.
- Do not let the Trainee avoid answering your concerns.
- Keep your response to 2-3 sentences maximum
- End with exactly ONE clear, simple question
- Do not give generic praise if they are off-topic or failing.
- Do not agree to book a meeting until the trainee scores ${SCORE_TO_WIN} points`;

        try {
            let finalBotText = '';
            let newTurns = turnsLeft;
            let didStream = false;

            if (isWin) {
                finalBotText = selectedPersona.closingMessage;
            } else if (turnsLeft === 1) {
                finalBotText = selectedPersona.dismissalMessage;
                newTurns = 0;
            } else {
                newTurns = turnsLeft - 1;

                const proxyRes = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                });

                if (!proxyRes.ok || !proxyRes.body) {
                    finalBotText = selectedPersona.fallbackResponses[Math.min(stage, selectedPersona.fallbackResponses.length - 2)];
                } else {
                    didStream = true;
                    const reader = proxyRes.body.getReader();
                    const decoder = new TextDecoder();

                    setIsTyping(false);
                    const botMsgId = `bot-${Date.now()}`;
                    setMessages(prev => [...prev, { id: botMsgId, role: 'model', content: '' }]);

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        finalBotText += decoder.decode(value, { stream: true });
                        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: finalBotText } : m));
                    }
                }
            }

            const newBotMessage: Message = { id: `bot-${Date.now()}`, role: 'model', content: finalBotText };
            if (!didStream) {
                setIsTyping(false);
                setMessages(prev => [...prev, newBotMessage]);
            }

            // ── 6. Our code — not the AI — decides the win/loss ──────────
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
            // Graceful fallback — game still works without API
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
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        CHOOSE YOUR <span className="text-red-500">OPPONENT</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Each persona has different priorities and expects you to address their specific concerns. You need to hit <strong className="text-gray-900">4 key points</strong> to convince them.
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
                            className={`group text-left p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden bg-gray-100/70 border-gray-200 hover:border-${persona.color}-500/50`}
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
                                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-red-500 transition-colors">{persona.name}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">{persona.title}</p>
                                <div className="flex flex-wrap gap-2">
                                    {persona.traits.map(trait => (
                                        <span key={trait} className="px-3 py-1 bg-gray-200/80 border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tighter">
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
                        className="px-8 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 border border-gray-200 transition-all flex items-center gap-2 mx-auto"
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
                    className="bg-gray-50 border-2 border-emerald-500/50 p-12 sm:p-20 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.2)] relative overflow-hidden"
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
                    <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        DEAL CLOSED
                    </h2>
                    <p className="text-gray-700 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Incredible pitch. You successfully addressed the core concerns of <strong>{selectedPersona?.name}</strong> and earned their trust.
                        You have earned <strong className="text-emerald-400 text-3xl mx-2">+2000 XP</strong>.
                    </p>
                    <button
                        onClick={() => { completeMission('boss-battle'); onComplete(); }}
                        className="px-12 py-6 bg-emerald-500 text-gray-900 font-bold rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] text-xl w-full sm:w-auto uppercase tracking-wider"
                    >
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    // ─── CHAT SCREEN ────────────────────────────────────────────────────────
    const getLevelTitle = (lvl: number) => {
        if (lvl >= 7) return 'ARCHITECT';
        if (lvl >= 5) return 'VETERAN';
        if (lvl >= 3) return 'SPECIALIST';
        return 'RECRUIT';
    };
    const level = Math.floor(xp / 500) + 1;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            {/* Header */}
            <div className="mb-8 bg-gray-50 border border-red-500/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-50" />

                <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto mb-6 sm:mb-0">
                    <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-2xl flex items-center justify-center text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                        <Cpu className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedPersona?.name}</h2>
                        <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{selectedPersona?.title}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    {battleStatus === 'lost' && (
                        <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-sm font-bold tracking-wider border border-red-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                            <ShieldAlert className="w-4 h-4" />
                            MISSION FAILED
                        </div>
                    )}
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-100/70 hover:bg-gray-200 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
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
                            <span className="text-gray-400 text-xs font-bold">{score}/{SCORE_TO_WIN} pts</span>
                            <div className="flex gap-1.5">
                                {[...Array(SCORE_TO_WIN)].map((_, i) => (
                                    <div key={i} className={`w-5 h-2 rounded-sm transition-all ${i < score ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        {/* Patience bar */}
                        <div className="flex gap-1.5">
                            {[...Array(selectedPersona?.patience || 6)].map((_, i) => (
                                <div key={i} className={`w-5 h-2 rounded-sm ${i < turnsLeft ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat interface */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-100 border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
            >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5
                                    ${message.role === 'user'
                                        ? 'bg-emerald-600 text-gray-900 rounded-br-none shadow-[0_5px_15px_rgba(16,185,129,0.2)]'
                                        : message.role === 'system'
                                            ? 'bg-amber-950/60 border border-amber-700/50 text-amber-300 text-sm font-medium tracking-wide text-center rounded-xl'
                                            : 'bg-gray-200 text-gray-800 border border-gray-200 rounded-bl-none shadow-lg'
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
                            <div className="bg-gray-200 border border-gray-200 rounded-2xl rounded-bl-none p-5 flex items-center gap-3 text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                <span className="text-sm font-medium">{selectedPersona?.name} is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area / Retry Options */}
                <div className="p-4 sm:p-6 bg-gray-100 border-t border-gray-200">
                    {battleStatus === 'playing' ? (
                        <>
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isTyping}
                                    placeholder="Address their concern with a clear, specific answer..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-6 pr-16 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-3 bg-emerald-500 text-gray-900 p-2.5 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="mt-3 flex justify-between items-center text-xs text-gray-400 px-2 font-medium">
                                <span>Powered by Gemini AI · Scoring: {score}/{SCORE_TO_WIN} points</span>
                                <span>{turnsLeft} attempts remaining</span>
                            </div>
                        </>
                    ) : battleStatus === 'lost' ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <p className="text-red-400 font-bold mb-2 sm:mb-0 sm:mr-auto">Mission Failed. Review the chat above to see where you went wrong.</p>
                            <button
                                onClick={() => setGamePhase('selecting')}
                                className="px-6 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-200 border border-gray-200 transition-all text-sm uppercase tracking-wider"
                            >
                                Change Opponent
                            </button>
                            <button
                                onClick={() => { if (selectedPersona) startBattle(selectedPersona); }}
                                className="px-6 py-3 bg-red-600/80 text-gray-900 font-bold rounded-xl hover:bg-red-500 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] text-sm uppercase tracking-wider flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Try Again
                            </button>
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};
