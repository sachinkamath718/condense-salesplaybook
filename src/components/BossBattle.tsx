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
        patience: 7,
        color: 'emerald',
        initialMessage: "I'm reviewing our Kafka consumer logic. We've got massive rebalancing issues and the Java boilerplate is killing us. Why should I care about Condense?",
        keywords: [
            // Core technical terms
            'rust', 'performance', 'boilerplate', 'zookeeper', 'latency', 'pipeline',
            'rebalancing', 'throughput', 'connector', 'stream', 'kafka',
            // Natural language equivalents
            'fast', 'speed', 'efficient', 'simple', 'easy to use', 'easy to build',
            'no java', 'no overhead', 'less code', 'cleaner', 'simplify',
            'real-time', 'real time', 'data streaming', 'streaming platform',
            'replace kafka', 'kafka alternative', 'no zookeeper', 'eliminates zookeeper',
            'deploy in minutes', 'built on rust', 'cloud native', 'managed',
            'unified', 'single platform', 'no ops', 'zero ops', 'self managing',
            'scale', 'scalable', 'infinite scale', 'developer friendly'
        ],
        stageContext: [
            "Stage 0: Very skeptical. The sales rep has made no case yet. Ask sharply about their Kafka rebalancing problem and why Condense is different.",
            "Stage 1: One relevant point made. Acknowledge briefly, then push harder on DX — how does it reduce boilerplate day-to-day?",
            "Stage 2: Two good points. You are starting to listen. Ask about production reliability and zero-downtime deployments.",
            "Stage 3: Three solid points. You are almost convinced. Ask one final question about connector ecosystem or team onboarding.",
            "Stage 4: The sales rep has addressed all your concerns thoroughly. You are convinced. Close warmly and agree to a meeting."
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
        patience: 6,
        color: 'purple',
        initialMessage: "My main concern is hiring. Finding Kafka experts is hard and expensive. Does Condense allow my existing team to build real-time systems without a PhD in distributed systems?",
        keywords: [
            // Core terms
            'hiring', 'team', 'velocity', 'onboarding', 'expertise', 'byoc', 'cost',
            'managed', 'productivity', 'time to market',
            // Natural language equivalents
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
            "Stage 0: Very skeptical. The sales rep hasn't addressed hiring or team velocity yet. Ask how quickly a non-Kafka engineer could build a pipeline from scratch.",
            "Stage 1: One point noted. Acknowledge it, then ask about actual onboarding time or learning curve for a junior engineer.",
            "Stage 2: Two points addressed. Ask about TCO — is Condense actually cheaper than their current Confluent or Kafka spend?",
            "Stage 3: Three solid answers. Ask one final question about scale — does it handle growth without needing ops intervention?",
            "Stage 4: All concerns addressed. You are convinced. Close warmly and suggest connecting on a call to loop in the engineering leads."
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
        patience: 6,
        color: 'red',
        initialMessage: "Who is this? My EA said someone from 'Condense' was trying to breach my calendar regarding our Kafka limits. Look, AWS MSK is astronomical. What's the bottom line?",
        keywords: [
            // Core terms
            'tco', 'cost', 'byoc', 'vpc', 'security', 'compliance', 'audit',
            'rbac', 'msk', 'confluent', 'savings', 'reliability', 'sla', 'enterprise',
            // Natural language equivalents
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
            "Stage 0: Very skeptical. You were cold-called. No TCO or security addressed yet. Ask sharply — how much cheaper is Condense vs your current MSK bill?",
            "Stage 1: One cost-related point raised. Acknowledge it, then ask about data residency — does data leave your cloud, or does it stay in your VPC?",
            "Stage 2: Two points addressed. Ask about compliance — who handles audits, and do they have SOC2 or enterprise certifications?",
            "Stage 3: Three good answers. Ask one final question about SLA and support — what happens if it goes down at 2am?",
            "Stage 4: TCO, data sovereignty, compliance, and support all addressed. You are convinced. Close professionally and agree to a call."
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
// Awards MAX 1 point per message — so a user must give 4 separate good answers to win
function scoreMessage(text: string, persona: PersonaDef, usedKeywords: Set<string>): { newScore: number; newUsed: Set<string> } {
    const lower = text.toLowerCase();
    const newUsed = new Set(usedKeywords);
    let hitFound = false;

    for (const kw of persona.keywords) {
        if (!newUsed.has(kw) && lower.includes(kw)) {
            newUsed.add(kw);
            hitFound = true;
            break; // MAX 1 point per message — stop after first hit
        }
    }
    return { newScore: hitFound ? 1 : 0, newUsed };
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
    const SCORE_TO_WIN = 4; // Need 4 separate good answers across 4+ turns to win

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

        // ─── 4. Build the structured prompt (production-grade prompt engineering) ───
        // Patterns borrowed from Cursor, Lovable, v0 system prompts:
        // - Identity block (who you are, one crisp sentence)
        // - Grounded product facts (no hallucination)
        // - Conversation state block (current score, stage, what was said)
        // - Rules block with MUST/NEVER/ALWAYS
        // - Per-stage few-shot examples (show don't just tell)
        // - Strict output format constraint

        const historyText = messages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role === 'model' ? selectedPersona.name + ':' : 'Sales Rep:'} ${m.content}`)
            .join('\n\n');

        const stageInstruction = selectedPersona.stageContext[stage];

        // Per-stage few-shot examples to anchor the model's tone
        const fewShotByStage: Record<string, string> = {
            developer: [
                // Stage 0
                `Sales Rep: "Condense is a streaming platform built on Rust."\n${selectedPersona.name}: "That's a starting point, but Rust alone doesn't solve our consumer group rebalancing hell. How does Condense actually handle partition reassignment without stopping message processing?"`,
                // Stage 1
                `Sales Rep: "Condense eliminates Zookeeper entirely, so no more ensemble management."\n${selectedPersona.name}: "Okay, that's actually useful — Zookeeper has cost us 3 on-call incidents this quarter. But what does the developer workflow look like? Can my team define a pipeline in code or are we back to YAML configs?"`,
                // Stage 2
                `Sales Rep: "You define pipelines in code, deploy in minutes, and it auto-scales without manual partition tuning."\n${selectedPersona.name}: "That's better. One last thing — what's the story for zero-downtime upgrades on live pipelines? Kafka rolling restarts have bitten us before."`,
                // Stage 3
                `Sales Rep: "Condense handles hot upgrades without consumer lag, no restart needed."\n${selectedPersona.name}: "That's solid. You've addressed the rebalancing, the DX, and the ops overhead. Let's book a meeting — I'll pull in our platform lead."`,
            ][Math.min(stage, 3)],
            vp: [
                `Sales Rep: "Condense is easier to use than Kafka."\n${selectedPersona.name}: "How much easier? I need concrete numbers. How long does it take a product engineer with zero Kafka experience to ship a working pipeline?"`,
                `Sales Rep: "A junior engineer can go from setup to a live pipeline in under a day using Condense's guided SDK."\n${selectedPersona.name}: "That's actually promising — we onboard 4-5 engineers a quarter. What's the cost model? Are we paying per message like Confluent, or is it infrastructure-based?"`,
                `Sales Rep: "It's infrastructure-based BYOC — you pay only your cloud provider, no per-message fees."\n${selectedPersona.name}: "Okay, that's a meaningful TCO improvement. Last question — does it scale automatically if we 5x our event volume during peak season?"`,
                `Sales Rep: "It auto-scales to infinity, no manual cluster tuning needed."\n${selectedPersona.name}: "You've addressed hiring friction, onboarding speed, cost model, and scale. That's everything I needed. Yes, let's connect on a call — I'll loop in my engineering leads."`,
            ][Math.min(stage, 3)],
            executive: [
                `Sales Rep: "Condense is cheaper than MSK."\n${selectedPersona.name}: "Give me a number, not a claim. We process 30TB/month. What's the actual cost delta versus MSK at that scale?"`,
                `Sales Rep: "At 30TB/month, typical customers see 60-70% cost reduction versus MSK because you're paying cloud infra only — no Confluent license on top."\n${selectedPersona.name}: "That's material. But my bigger concern is data residency. Does our data ever leave our cloud account, or does Condense run fully inside our VPC?"`,
                `Sales Rep: "Condense is fully BYOC — it deploys inside your VPC, your cloud account. Zero data leaves your perimeter."\n${selectedPersona.name}: "Good. That addresses our compliance posture. Last thing — what's your SLA and support model? If this goes down at 2am, who do we call?"`,
                `Sales Rep: "We offer 99.99% SLA with dedicated enterprise support and a named account engineer."\n${selectedPersona.name}: "Cost, data sovereignty, compliance, and enterprise support — you've covered all four. Let's connect on a call — I'll bring our security architect."`,
            ][Math.min(stage, 3)],
        };

        const fewShotExample = fewShotByStage[selectedPersona.id] || '';

        const prompt = isWin
            ? `## IDENTITY
You are ${selectedPersona.name}, ${selectedPersona.title}.

## TASK
The sales conversation is over. The sales rep has fully addressed your concerns. You must now close the deal.

## CLOSING INSTRUCTION
Output EXACTLY this sentence and nothing else:
"${selectedPersona.closingMessage}"

Do not add any preamble, do not modify the sentence, do not add any follow-up.`

            : `## IDENTITY
You are ${selectedPersona.name}, ${selectedPersona.title}. Traits: ${selectedPersona.traits.join(', ')}.

## PRODUCT FACTS (grounded truth — do not invent anything outside this)
Condense is a cloud-native data streaming platform built on Rust.
- Replaces Apache Kafka entirely
- Eliminates Zookeeper (no ensemble, no ops overhead)
- Infinite auto-scaling with no manual partition tuning
- BYOC model: deploys inside the customer's own VPC — data never leaves their cloud
- Developers define pipelines in code; deploy in minutes with no Kafka expertise required
- Cost model: infrastructure-only, no per-message fees like Confluent

## CONVERSATION STATE
- Current stage: ${stage} of ${SCORE_TO_WIN} (${stage === 0 ? 'not convinced yet' : stage < SCORE_TO_WIN - 1 ? 'slightly interested' : 'almost convinced — one more good answer needed'})
- Points scored so far: ${score}/${SCORE_TO_WIN}

## CONVERSATION HISTORY
${historyText}
Sales Rep: ${userText}

## STAGE INSTRUCTION
${stageInstruction}

## RULES
1. MUST stay in character as ${selectedPersona.name} at all times.
2. MUST ask exactly ONE follow-up question at the end. Never ask more than one.
3. MUST keep your response to 2 sentences maximum.
4. NEVER agree to book a meeting or say "let's connect" — that is FORBIDDEN before stage ${SCORE_TO_WIN}.
5. NEVER say "great point", "that's interesting", "I like that" or give generic praise.
6. NEVER invent product features not listed in PRODUCT FACTS above.
7. ALWAYS be skeptical but professional — push for specifics, not vague claims.
8. If the sales rep is still vague, push harder for a concrete answer.

## FEW-SHOT EXAMPLE (use this as your tone and format reference)
${fewShotExample}

## YOUR RESPONSE
Write your in-character response now. 2 sentences max. End with a question.`;


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
