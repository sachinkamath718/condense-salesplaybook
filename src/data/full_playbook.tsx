export interface KeywordDef {
    term: string;
    definition: string;
}

export const PLAYBOOK_KEYWORDS: KeywordDef[] = [
    { term: "BYOC", definition: "Bring Your Own Cloud: Software runs entirely inside your own AWS, GCP, or Azure account for maximum security and data residency." },
    { term: "Kafka", definition: "Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines." },
    { term: "MSK", definition: "Amazon Managed Streaming for Apache Kafka: A fully managed service that makes it easy to build and run applications." },
    { term: "KSQL", definition: "kSQL is a streaming SQL engine that enables real-time data processing against Apache Kafka." },
    { term: "Microservices", definition: "An architectural style that structures an application as a collection of loosely coupled independently deployable services." },
    { term: "SRE", definition: "Site Reliability Engineering ensures system reliability and uptime." },
    { term: "Observability", definition: "The ability to measure internal states natively by examining its outputs (metrics, logs, and traces)." },
    { term: "Data Residency", definition: "The geographic location of an organization's data or information." },
    { term: "FMS", definition: "Fleet Management System: Comprehensive software for managing and tracking commercial motor vehicles." },
    { term: "OEM", definition: "Original Equipment Manufacturer (e.g. Ford, Volvo)." },
    { term: "ETL", definition: "Extract, Transform, Load: Data integration process." },
    { term: "AIS140", definition: "Indian government regulation mandating real-time GPS tracking for all commercial vehicles." },
    { term: "TCO", definition: "Total Cost of Ownership: All costs associated with a product or system over its lifetime." },
    { term: "VPC", definition: "Virtual Private Cloud: A private network inside a public cloud provider." }
];

export interface ContentBlock {
    type: 'paragraph' | 'quote' | 'list' | 'image' | 'deep-dive' | 'action-block' | 'chart';
    content: string | string[] | unknown;
    caption?: string;
    title?: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface Chapter {
    id: string;
    missionId: number;
    title: string;
    subtitle: string;
    vibeColor: string;
    content: ContentBlock[];
    pages?: ContentBlock[][];
    quiz?: QuizQuestion[];
}

export interface MissionDef {
    id: number;
    title: string;
    description: string;
    color: string;
    icon: string;
}

export const MISSIONS: MissionDef[] = [
    { id: 1, title: "Mission 1", description: "Understanding Condense", color: "emerald", icon: "🧠" },
    { id: 2, title: "Mission 2", description: "Identifying the Right Customer", color: "blue", icon: "🎯" },
    { id: 3, title: "Mission 3", description: "How to Sell Condense", color: "violet", icon: "⚡" },
];

export const fullPlaybookData: Chapter[] = [

    // ─────────────────────────────────────────
    // MISSION 1 — Understanding Condense
    // ─────────────────────────────────────────
    {
        id: "m1-s1",
        missionId: 1,
        title: "Introduction",
        subtitle: "What is Condense?",
        vibeColor: "#065f46",
        content: [
            {
                type: "paragraph",
                content: "A truck breaks down on a highway. The driver calls the fleet manager. The fleet manager opens the dashboard. The data is 5 minutes old. Nobody knows where the truck is right now. This happens every single day across thousands of fleets."
            },
            {
                type: "paragraph",
                content: "The data exists. The sensors are working. The problem is the system handling the data is slow, broken into pieces, and impossible to manage. Condense fixes that."
            },
            {
                type: "action-block",
                title: "What Condense Does",
                content: "It is one platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Picture this. A truck breaks down on a highway. The driver calls the fleet manager. The fleet manager opens the dashboard. The data is 5 minutes old. Nobody knows where the truck is right now."
                },
                {
                    type: "paragraph",
                    content: "This happens every single day across thousands of fleets. The data exists. The sensors are working. The problem is the system handling the data is slow, broken into pieces, and impossible to manage."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Condense fixes that",
                    content: "It is one platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud."
                },
                {
                    type: "paragraph",
                    content: "By the end of these missions you will understand exactly what Condense does and how to explain it to anyone in under 2 minutes."
                },
                {
                    type: "quote",
                    content: "One platform. Real-time data. Inside your cloud. That is Condense."
                }
            ]
        ],
        quiz: [
            {
                question: "What is the core problem Condense solves?",
                options: ["Trucks breaking down", "Data systems that are slow, fragmented, and unmanageable", "Lack of GPS devices on vehicles", "High internet costs for fleet operators"],
                correctAnswerIndex: 1,
                explanation: "Condense solves the problem of fragmented, slow data pipelines — not the hardware or device side of things."
            },
            {
                question: "Where does Condense run?",
                options: ["On Condense's own servers", "On the customer's own cloud", "On a shared public cloud", "On-premise in the customer's data center only"],
                correctAnswerIndex: 1,
                explanation: "Condense runs inside the customer's own cloud — their VPC, their region, their infrastructure."
            },
            {
                question: "Which phrase best summarizes Condense in one sentence?",
                options: ["A GPS tracking app for trucks", "A Kafka replacement for small startups", "One platform that ingests, processes, and delivers real-time data inside your cloud", "A monitoring tool for cloud infrastructure"],
                correctAnswerIndex: 2,
                explanation: "Condense is a unified platform covering ingestion, processing, and delivery — all within the customer's cloud boundary."
            }
        ]
    },

    {
        id: "m1-s2",
        missionId: 1,
        title: "Section 2",
        subtitle: "Cloud-Native Streaming Architecture Today",
        vibeColor: "#064e3b",
        content: [
            {
                type: "paragraph",
                content: "Most companies today collect data from vehicles, sensors, or devices and try to make sense of it fast. To do this they use a tool called Apache Kafka. Kafka moves data from one place to another at high speed. It works well. Almost every large company uses it."
            },
            {
                type: "paragraph",
                content: "But Kafka alone is not enough. To actually use the data, companies have to build a lot of things around Kafka — a tool to process, transform, route, monitor, scale, and alert. Each tool is built separately. Maintained separately. Managed by a different team."
            },
            {
                type: "quote",
                content: "Kafka is the foundation everyone already trusts. The problem is everything built around it. That is exactly where Condense comes in."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Most companies today collect data from vehicles, sensors, or devices and try to make sense of it fast. To do this they use a tool called Apache Kafka. Kafka moves data from one place to another at high speed."
                },
                {
                    type: "paragraph",
                    content: "Almost every large company uses Kafka. It works well. But Kafka alone is not enough."
                }
            ],
            [
                {
                    type: "list",
                    title: "What companies build around Kafka",
                    content: [
                        "A tool to process the data",
                        "A tool to transform it",
                        "A tool to route it to the right destination",
                        "A tool to monitor everything",
                        "A tool to scale when traffic surges",
                        "A tool to alert when something goes wrong"
                    ]
                },
                {
                    type: "paragraph",
                    content: "Each tool is built separately. Maintained separately. Managed by a different team. This is how most companies operate today. It works — but just barely. And the bigger the company gets, the harder it becomes to manage."
                }
            ],
            [
                {
                    type: "quote",
                    content: "Kafka is the foundation everyone already trusts. The problem is everything built around it. That is exactly where Condense comes in."
                },
                {
                    type: "action-block",
                    title: "Remember this",
                    content: "Do not sell against Kafka. Kafka stays. Condense completes it."
                }
            ]
        ],
        quiz: [
            {
                question: "Why is Kafka alone not enough for enterprise data pipelines?",
                options: ["Kafka is too expensive", "Kafka only handles ingestion — everything around it still needs to be built separately", "Kafka doesn't work at high speeds", "Kafka requires a proprietary license"],
                correctAnswerIndex: 1,
                explanation: "Kafka moves data reliably, but companies still have to build separate tools for processing, transformation, routing, monitoring, and scaling."
            },
            {
                question: "What is the core sales message about Kafka when positioning Condense?",
                options: ["Kafka is outdated and should be replaced", "Condense competes directly with Kafka", "Condense completes Kafka — it does not replace it", "Kafka is only for small companies"],
                correctAnswerIndex: 2,
                explanation: "The key message is 'Condense completes Kafka.' This removes fear and positions Condense as an enhancement, not a disruption."
            }
        ]
    },

    {
        id: "m1-s3",
        missionId: 1,
        title: "Section 3",
        subtitle: "Why Architectures Break Over Time",
        vibeColor: "#047857",
        content: [
            {
                type: "paragraph",
                content: "Year 1: The team sets up Kafka. Everything works. Year 2: New use cases arrive — new services, alerts, transformations. Year 3: The system is 10 different pieces. Fixing one thing breaks another. Year 4: The cloud bill is growing, a key engineer leaves, new features take weeks."
            },
            {
                type: "list",
                title: "Symptoms your customer will recognize",
                content: [
                    "\"We have a lot of technical debt\"",
                    "\"Our pipeline is hard to maintain\"",
                    "\"It takes too long to ship new features\"",
                    "\"Our cloud costs keep going up\""
                ]
            },
            {
                type: "action-block",
                title: "When you hear these phrases, the door is open",
                content: "These are not complaints. These are buying signals. Each one maps directly to a problem Condense solves."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Here is what happens inside every company over time."
                },
                {
                    type: "list",
                    title: "The natural evolution of a streaming system",
                    content: [
                        "Year 1 — The team sets up Kafka. Everything works. The team is happy.",
                        "Year 2 — A new use case arrives. They add a new service. Then another. Then a new alert. Then a new transformation.",
                        "Year 3 — The system is now 10 different pieces. When something breaks, nobody knows where to look. Fixing one thing breaks another.",
                        "Year 4 — The cloud bill is growing. A key engineer leaves. Hiring a replacement takes months. Adding any new feature takes weeks."
                    ]
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "This is not bad engineering. This is what happens naturally when systems grow without a unified platform underneath them."
                },
                {
                    type: "list",
                    title: "Symptoms your customer will recognize",
                    content: [
                        "\"We have a lot of technical debt\"",
                        "\"Our pipeline is hard to maintain\"",
                        "\"It takes too long to ship new features\"",
                        "\"Our cloud costs keep going up\""
                    ]
                },
                {
                    type: "action-block",
                    title: "When you hear these phrases, the door is open",
                    content: "These are buying signals. Each one maps directly to a problem Condense solves."
                }
            ]
        ],
        quiz: [
            {
                question: "When a customer says 'It takes too long to ship new features,' what does this signal to a Condense seller?",
                options: ["They need more developers", "Their fragmented architecture is slowing down delivery — a core problem Condense solves", "They are not a good fit for Condense", "They need better project management"],
                correctAnswerIndex: 1,
                explanation: "Slow feature delivery is a direct symptom of fragmented streaming infrastructure. This is a strong buying signal."
            },
            {
                question: "Why do streaming systems naturally break down over time, even with good engineering?",
                options: ["Engineers make too many mistakes", "New use cases add more isolated services without a unified platform underneath", "Kafka stops working at scale", "Cloud providers raise their prices"],
                correctAnswerIndex: 1,
                explanation: "Without a unified platform, every new use case adds another isolated service, growing the maintenance burden exponentially."
            },
            {
                question: "Which of these is NOT a buying signal for Condense?",
                options: ["Our cloud costs keep going up", "We are very happy with our pipeline throughput and team capacity", "Our pipeline is hard to maintain", "It takes too long to ship new features"],
                correctAnswerIndex: 1,
                explanation: "A happy customer with no pain points is not a buying signal. Look for the friction phrases."
            }
        ]
    },

    {
        id: "m1-s4",
        missionId: 1,
        title: "Section 4",
        subtitle: "Where Condense Fits",
        vibeColor: "#059669",
        content: [
            {
                type: "quote",
                content: "Condense does not replace Kafka. It completes it. Say that line in every conversation. It removes fear immediately."
            },
            {
                type: "list",
                title: "Three things to always highlight",
                content: [
                    "BYOC — The platform runs inside the customer's AWS, GCP, or Azure. Full data control. Full compliance. This is not a feature. It is a requirement.",
                    "Build anything — No-code tools for simple pipelines, full custom code in Java, Python, or Go for complex logic. AI-assisted IDE built in.",
                    "Condense manages it all — Scales it. Monitors it. Maintains 99.95% uptime. The team builds. Condense runs it."
                ]
            }
        ],
        pages: [
            [
                {
                    type: "quote",
                    content: "Condense does not replace Kafka. It completes it."
                },
                {
                    type: "paragraph",
                    content: "Say that line in every conversation. It removes fear immediately. Condense takes everything a company has built around Kafka — the processing tools, the transformation services, the monitoring systems, the scaling setup — and replaces all of it with one single platform."
                },
                {
                    type: "paragraph",
                    content: "That platform runs inside the customer's own cloud. Not Condense's cloud. The customer's cloud. Their data never leaves their environment."
                }
            ],
            [
                {
                    type: "list",
                    title: "Three things to always highlight",
                    content: [
                        "BYOC — Bring Your Own Cloud. Runs inside the customer's AWS, GCP, or Azure. Full data control. Full compliance. No shared infrastructure. For most enterprise customers, this is not a feature. It is a requirement.",
                        "Build anything — Teams can use no-code tools for simple pipelines or write full custom code in Java, Python, or Go. AI-assisted IDE built in. Version control built in.",
                        "Condense manages it all — Once the team builds something on Condense, Condense keeps it running. Scales it. Monitors it. Maintains 99.95% uptime."
                    ]
                },
                {
                    type: "action-block",
                    title: "The result",
                    content: "Faster product launches. Lower cloud costs. Less time on maintenance. More time building things that matter."
                }
            ]
        ],
        quiz: [
            {
                question: "What is the most important phrase to say in every Condense sales conversation?",
                options: ["Condense is better than Kafka", "Condense does not replace Kafka. It completes it.", "Condense works without Kafka", "Kafka is outdated — Condense is the future"],
                correctAnswerIndex: 1,
                explanation: "This line removes the fear of disruption and positions Condense as an enhancement to existing infrastructure."
            },
            {
                question: "What does BYOC mean and why is it critical for enterprise customers?",
                options: ["Bring Your Own Computer — for remote work setups", "Bring Your Own Cloud — the platform runs in the customer's own cloud, ensuring data never leaves their environment", "Build Your Own Connector — for custom integrations", "Buy Your Own Credits — for cloud marketplace purchases"],
                correctAnswerIndex: 1,
                explanation: "BYOC means data stays inside the customer's cloud boundary. For regulated industries and enterprises, this is often non-negotiable."
            },
            {
                question: "What is the outcome promise of the Condense platform?",
                options: ["More developers hired", "Faster product launches, lower cloud costs, less maintenance overhead", "Complete migration away from cloud providers", "Elimination of all engineering roles"],
                correctAnswerIndex: 1,
                explanation: "Condense delivers concrete business outcomes: faster launches, lower costs, less toil, and more time building what matters."
            }
        ]
    },

    {
        id: "m1-s5",
        missionId: 1,
        title: "Section 5",
        subtitle: "What Makes Condense Different",
        vibeColor: "#10b981",
        content: [
            {
                type: "paragraph",
                content: "Many platforms do one or two of these things. Condense does all three together — natively Kafka, full development environment, and fully managed with a real SLA."
            },
            {
                type: "list",
                title: "The three differentiators",
                content: [
                    "Truly Kafka-native — Runs and manages a real Kafka cluster inside the customer's cloud. Topics, producers, consumers, and Kafka APIs remain exactly the same.",
                    "Full development environment — Built-in IDE with Java, Python, or Go. Git built in. CI/CD supported. AI coding, QA, and monitoring agents included.",
                    "Fully managed with a real SLA — Not just the Kafka cluster. The applications teams build on it too. 99.95% uptime guarantee."
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Many platforms do one or two of these things. Condense does all three together. This combination is what no other platform offers in one place."
                },
                {
                    type: "deep-dive",
                    title: "Differentiator 1 — Truly Kafka-native",
                    content: "Condense actually runs and manages a real Kafka cluster inside the customer's cloud. Topics, producers, consumers, and Kafka APIs all remain exactly the same. Nothing is abstracted away. No proprietary transport layer. Kafka stays as the backbone."
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Differentiator 2 — Full development environment",
                    content: "The built-in IDE lets developers write, test, version, and deploy streaming logic directly in code — Java, Python, or Go. Git is built in. CI/CD is supported. An AI coding agent, QA agent, and monitoring agent are all part of the platform."
                },
                {
                    type: "deep-dive",
                    title: "Differentiator 3 — Fully managed with a real SLA",
                    content: "Not just the Kafka cluster. The applications teams build on it too. Condense manages the application with a 99.95% uptime guarantee. Most platforms manage infrastructure. Condense manages the whole thing."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "The combination no competitor matches",
                    content: "Native Kafka + Full development framework + Full management and SLA — in one platform, inside your cloud."
                },
                {
                    type: "quote",
                    content: "Ask any competitor: 'Do you run the actual Kafka cluster inside my VPC, provide a full IDE, AND manage the applications I build with a 99.95% SLA?' The answer is always no."
                }
            ]
        ],
        quiz: [
            {
                question: "What makes Condense 'truly Kafka-native' different from other platforms that claim Kafka compatibility?",
                options: ["It uses a proprietary transport layer for speed", "It actually runs and manages a real Kafka cluster inside the customer's VPC", "It replaces Kafka with a faster alternative", "It provides a Kafka migration tool"],
                correctAnswerIndex: 1,
                explanation: "Condense runs real Kafka in the customer's cloud — not a Kafka-compatible abstraction or a shared cluster."
            },
            {
                question: "What is included in Condense's built-in development environment?",
                options: ["Only a visual drag-and-drop interface", "A full IDE with Java/Python/Go support, Git, CI/CD, and AI agents for coding, QA, and monitoring", "A basic SQL editor", "Only pre-built templates"],
                correctAnswerIndex: 1,
                explanation: "Condense includes a complete development environment — IDE, version control, CI/CD, and three AI agents — all in one platform."
            },
            {
                question: "What does Condense's 99.95% SLA cover that most competitors do not?",
                options: ["Only the Kafka cluster", "Only the connectors", "Both the Kafka cluster AND the applications teams build on the platform", "Only the monitoring dashboards"],
                correctAnswerIndex: 2,
                explanation: "Most platforms have SLAs only for infrastructure. Condense extends its 99.95% guarantee to the full applications — a unique differentiator."
            }
        ]
    },

    {
        id: "m1-s6",
        missionId: 1,
        title: "Section 6",
        subtitle: "Proof It Works",
        vibeColor: "#34d399",
        content: [
            {
                type: "paragraph",
                content: "Every conversation needs proof. Here are five real customers using Condense in production today — all running at 99.95% uptime."
            },
            {
                type: "quote",
                content: "Every single customer runs at 99.95% uptime. Say this with confidence in every conversation."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Every conversation needs proof. Use these. Know them. Say them with confidence."
                },
                {
                    type: "deep-dive",
                    title: "Customer 1 — 3rd largest truck maker in India",
                    content: "7,000 trucks per month. Moved from IBM Event Streams to Condense on GCP. Results: 20% reduction in cloud spend, 35% less on dev and ops, 6 months faster to market, 200,000 connected vehicles, 99.95% uptime. Use when: Prospect is on IBM Event Streams or any legacy platform."
                },
                {
                    type: "deep-dive",
                    title: "Customer 2 — Electric 3-Wheeler OEM, India",
                    content: "Moved from Confluent to Condense for a unified electric mobility platform. Results: 40% reduction in total cost of ownership, 62,000 connected vehicles, 99.95% uptime. Use when: Prospect is on Confluent and feeling cost pressure."
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Customer 3 — India's largest truck maker",
                    content: "25,000 trucks per month. Connected 8 different hardware sources across legacy and new fleet variants. Results: Real-time streaming across all device types, 15,000 vehicles now, potential of 1.2 million. Use when: Prospect has mixed hardware or legacy fleet integration challenges."
                },
                {
                    type: "deep-dive",
                    title: "Customer 4 — India's most loved 2-wheeler brand",
                    content: "75,000 vehicles per month. Built their Connected Bike Platform on Condense, optimized for GCP. Results: 360-degree vehicle insight, 40,000 connected vehicles, 99.95% uptime. Use when: Prospect is on GCP or building consumer-facing connected products."
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Customer 5 — One of India's largest port operators",
                    content: "12 ports. Real-time tracking across electric and diesel trucks. Results: 600+ active geofences, 6x faster time to market, 99.95% uptime. Use when: Prospect is in logistics, ports, or mixed-fleet operations."
                },
                {
                    type: "quote",
                    content: "Every single customer runs at 99.95% uptime. Say this number with confidence in every conversation."
                },
                {
                    type: "action-block",
                    title: "The number to always remember",
                    content: "99.95% uptime. Across every single customer. Every conversation. Every time."
                }
            ]
        ],
        quiz: [
            {
                question: "Which customer proof point should you use when a prospect is on Confluent and concerned about cost?",
                options: ["The port operator story", "The 2-wheeler OEM story", "The Electric 3-Wheeler OEM story — 40% TCO reduction after moving from Confluent", "The truck maker story"],
                correctAnswerIndex: 2,
                explanation: "The Electric 3-Wheeler OEM moved specifically from Confluent and achieved a 40% TCO reduction — the ideal proof point for Confluent customers."
            },
            {
                question: "What uptime does every Condense customer experience?",
                options: ["99%", "99.9%", "99.95%", "100%"],
                correctAnswerIndex: 2,
                explanation: "Every Condense customer runs at 99.95% uptime. This is consistent and verifiable across all deployments."
            },
            {
                question: "Which proof point is best for a prospect with mixed hardware and legacy fleet integration challenges?",
                options: ["Customer 1 — IBM Event Streams migration", "Customer 3 — India's largest truck maker with 8 hardware sources", "Customer 4 — 2-wheeler GCP platform", "Customer 5 — Port operator"],
                correctAnswerIndex: 1,
                explanation: "Customer 3 connected 8 different hardware sources across legacy and new fleet variants — exactly the right story for mixed-hardware challenges."
            }
        ]
    },

    // ─────────────────────────────────────────
    // MISSION 2 — Identifying the Right Customer
    // ─────────────────────────────────────────
    {
        id: "m2-s1",
        missionId: 2,
        title: "Section 1",
        subtitle: "Who Is the Ideal Customer",
        vibeColor: "#1e3a8a",
        content: [
            {
                type: "paragraph",
                content: "Not every company is the right fit. Knowing who to walk away from is just as valuable as knowing who to pursue."
            },
            {
                type: "list",
                title: "Profile of a company ready for Condense",
                content: [
                    "They already use Kafka or something like it",
                    "They have connected devices or real-time data flows",
                    "They are between 100 and 10,000 employees",
                    "They are growing faster than their engineering team can keep up",
                    "They have data privacy or compliance requirements"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Not every company is the right fit. Knowing who to walk away from is just as valuable as knowing who to pursue."
                },
                {
                    type: "list",
                    title: "The ideal Condense customer",
                    content: [
                        "They already use Kafka or something like it — not starting from scratch",
                        "They have connected devices or real-time data flows — vehicles, sensors, machines",
                        "They are between 100 and 10,000 employees — large enough to feel the pain, fast enough to need a solution",
                        "They are growing faster than their engineering team can keep up with",
                        "They have data privacy or compliance requirements — BYOC is often non-negotiable"
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Walk away if",
                    content: "The company has no streaming infrastructure and no plans to build one. OR they are fully on-premise with no cloud migration planned. OR there is no technical champion willing to evaluate the platform."
                },
                {
                    type: "quote",
                    content: "Knowing who NOT to pursue saves you weeks. Use these filters early in every conversation."
                }
            ]
        ],
        quiz: [
            {
                question: "Which company is the ideal Condense customer?",
                options: [
                    "A startup with no data infrastructure planning a batch processing setup",
                    "A 5,000-employee logistics company using Kafka with growing telematics data and compliance requirements",
                    "A small shop with no cloud presence",
                    "A fully on-premise company with no cloud migration plans"
                ],
                correctAnswerIndex: 1,
                explanation: "Condense targets companies with existing Kafka, real-time data, growth pressure, and compliance needs — the logistics company fits perfectly."
            },
            {
                question: "When should you walk away from a prospect?",
                options: [
                    "When they are using Confluent",
                    "When they have no streaming infrastructure and no plans to build one",
                    "When they have more than 1,000 employees",
                    "When they are in the mobility sector"
                ],
                correctAnswerIndex: 1,
                explanation: "If there is no streaming infrastructure and no plans to build one, Condense has nothing to complete. Walk away and focus qualified leads."
            }
        ]
    },

    {
        id: "m2-s2",
        missionId: 2,
        title: "Section 2",
        subtitle: "Market Size",
        vibeColor: "#1d4ed8",
        content: [
            {
                type: "paragraph",
                content: "The global data streaming market is large and growing fast. The mobility sector alone is a massive immediate opportunity — over 1.4 billion vehicles on the road globally, AIS140 regulation mandating real-time tracking for all Indian commercial vehicles."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "The global data streaming market is large and growing fast. Enterprises across every industry are moving away from batch processing and toward real-time."
                },
                {
                    type: "list",
                    title: "The mobility opportunity",
                    content: [
                        "Over 1.4 billion vehicles on the road globally",
                        "The connected vehicle market is growing at over 20% per year",
                        "Every new vehicle launched today has connectivity built in"
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "India — An immediate opportunity",
                    content: "The AIS140 regulation mandates real-time GPS tracking for all commercial vehicles. Every truck and bus operating commercially must comply. This is not a future need. It is happening right now."
                },
                {
                    type: "paragraph",
                    content: "Beyond vehicles, the same problem exists in ports, cold chain logistics, mining, last-mile delivery, and industrial operations. Any industry operating physical assets at scale has this problem."
                },
                {
                    type: "quote",
                    content: "Your target is companies with large and growing connected fleets. That is where urgency is highest and budget is most available."
                }
            ]
        ],
        quiz: [
            {
                question: "What is AIS140 and why does it matter for Condense sales in India?",
                options: [
                    "An air quality standard requiring sensors in factories",
                    "An Indian regulation mandating real-time GPS tracking for all commercial vehicles — creating immediate pipeline demand",
                    "A data storage compliance standard",
                    "An automotive safety standard for electric vehicles"
                ],
                correctAnswerIndex: 1,
                explanation: "AIS140 mandates real-time tracking for all Indian commercial vehicles. Companies that are not compliant need a solution immediately — making it a powerful buying trigger."
            },
            {
                question: "What is the connected vehicle market growth rate?",
                options: ["5% per year", "10% per year", "Over 20% per year", "Over 50% per year"],
                correctAnswerIndex: 2,
                explanation: "The connected vehicle market is growing at over 20% per year, creating sustained demand for real-time data processing platforms."
            }
        ]
    },

    {
        id: "m2-s3",
        missionId: 2,
        title: "Section 3",
        subtitle: "The Right People to Talk To",
        vibeColor: "#2563eb",
        content: [
            {
                type: "paragraph",
                content: "In every account there are two types of conversations: the technical conversation (people who feel the pain) and the decision conversation (people who approve the budget)."
            },
            {
                type: "list",
                title: "Technical entry points",
                content: [
                    "Data engineers and Kafka engineers",
                    "Platform engineers and DevOps leads",
                    "Backend engineers and streaming infrastructure engineers"
                ]
            },
            {
                type: "list",
                title: "Decision makers",
                content: [
                    "CTO, VP Engineering",
                    "Head of Data, Director of Platform Engineering",
                    "Head of Cloud, Chief Data Officer"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "In every account there are two types of conversations to have. Start with the technical team. Use their language. Then translate that conversation into business outcomes when you reach the decision maker."
                },
                {
                    type: "list",
                    title: "The technical conversation — entry points",
                    content: [
                        "Data engineers and Kafka engineers — know exactly how many systems break when a pipeline fails",
                        "Platform engineers and DevOps leads",
                        "Backend engineers and streaming infrastructure engineers",
                        "These are your champions — if they understand the value, they become your voice inside the account"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "The decision conversation — budget holders",
                    content: [
                        "CTO, VP Engineering",
                        "Head of Data, Director of Platform Engineering",
                        "Head of Cloud, Chief Data Officer",
                        "These people care about outcomes — faster time to market, lower costs, less overhead"
                    ]
                },
                {
                    type: "action-block",
                    title: "Hiring signals to watch",
                    content: "If a company is posting for Kafka engineers, data platform leads, telematics architects, or backend streaming engineers — they have a real and growing streaming problem. That is your signal to reach out."
                }
            ]
        ],
        quiz: [
            {
                question: "Who is your primary entry point into a new account?",
                options: [
                    "The CEO — start at the top",
                    "Technical teams like Kafka engineers and platform engineers — they feel the pain daily",
                    "The finance team — they control the budget",
                    "The marketing team — they understand customer needs"
                ],
                correctAnswerIndex: 1,
                explanation: "Start with technical teams who feel the operational pain. If they become champions, they carry the conversation to decision makers for you."
            },
            {
                question: "What does a job posting for a 'Kafka SRE' or 'streaming infrastructure engineer' tell a Condense seller?",
                options: [
                    "The company is doing well and has no streaming problems",
                    "The company has a real and growing streaming problem — it's a strong signal to reach out",
                    "The company is migrating away from streaming",
                    "The company is fully automated and needs no help"
                ],
                correctAnswerIndex: 1,
                explanation: "Hiring specifically for streaming infrastructure roles means the complexity has grown to the point where they need headcount just for maintenance — exactly what Condense eliminates."
            }
        ]
    },

    {
        id: "m2-s4",
        missionId: 2,
        title: "Section 4",
        subtitle: "Triggers That Signal Buying Intent",
        vibeColor: "#3b82f6",
        content: [
            {
                type: "paragraph",
                content: "Timing matters in sales. Use these signals to know when a company is ready to have this conversation right now."
            },
            {
                type: "list",
                title: "High priority triggers",
                content: [
                    "Hiring signals — posting for Kafka engineers, data platform leads, telematics architects",
                    "Funding events — new investment with digital or AI initiatives mentioned",
                    "New regulation — data residency or compliance laws announced in their market",
                    "Technology migration — moving to the cloud or optimizing their cloud setup"
                ]
            },
            {
                type: "list",
                title: "Medium priority triggers",
                content: [
                    "New product or feature launch processing real-time data",
                    "Leadership change — new CTO, VP Engineering, or Head of Data",
                    "Geographic or fleet expansion — new market or fleet model launch"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Timing matters in sales. Here are the signals that tell you a company is ready to have this conversation right now."
                },
                {
                    type: "list",
                    title: "High priority triggers",
                    content: [
                        "Hiring signals — Posting for Kafka engineers, data platform leads, telematics architects, or DevOps engineers",
                        "Funding events — Raised new investment and mentioned digital or AI initiatives",
                        "New regulation — Data transfer, data residency, or compliance laws announced in their market",
                        "Technology migration — Moving to the cloud or optimizing their cloud setup"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Medium priority triggers",
                    content: [
                        "New product or feature launch — processing real-time data means new pipelines are being built right now",
                        "Leadership change — New CTO, VP Engineering, or Head of Data joined the company",
                        "Geographic or fleet expansion — entering a new market or launching a new vehicle model"
                    ]
                },
                {
                    type: "quote",
                    content: "A new regulation with a compliance deadline is the strongest trigger of all. BYOC becomes non-negotiable immediately."
                }
            ]
        ],
        quiz: [
            {
                question: "Which trigger carries the highest urgency for a Condense sale?",
                options: [
                    "A leadership change",
                    "A new regulation requiring data residency compliance — it creates a hard deadline",
                    "A new product launch",
                    "Geographic expansion"
                ],
                correctAnswerIndex: 1,
                explanation: "Regulations with compliance deadlines create urgency that nothing else matches. BYOC immediately becomes the only viable solution."
            },
            {
                question: "Why is a technology migration to the cloud a strong buying trigger for Condense?",
                options: [
                    "Cloud migrations always fail without Condense",
                    "It is the perfect moment to introduce a platform that deploys natively into their cloud from day one",
                    "Cloud providers require Condense for compliance",
                    "Condense gives discounts during migrations"
                ],
                correctAnswerIndex: 1,
                explanation: "When a company is migrating to the cloud, they are rebuilding their stack. This is the ideal moment to introduce Condense as the native streaming layer."
            }
        ]
    },

    {
        id: "m2-s5",
        missionId: 2,
        title: "Section 5",
        subtitle: "The Mobility Vertical in Depth",
        vibeColor: "#60a5fa",
        content: [
            {
                type: "paragraph",
                content: "Mobility is where Condense has its strongest proof points and its clearest buying triggers. Lead with this vertical whenever you can."
            },
            {
                type: "list",
                title: "Companies to target",
                content: [
                    "Vehicle OEMs — Electric and ICE, 2-wheelers through heavy commercial",
                    "Fleet operators — Cold chain, mining, ports, last-mile, hazardous transport",
                    "Aftermarket telematics platforms",
                    "EV ecosystem players — Battery tech, charging infrastructure, EV SaaS",
                    "Shared mobility — Ride-hailing, gig platforms, subscription mobility"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Mobility is where Condense has its strongest proof points and its clearest buying triggers. Lead with this vertical whenever you can."
                },
                {
                    type: "list",
                    title: "Companies to target in mobility",
                    content: [
                        "Vehicle OEMs — Electric and ICE. Two-wheelers, three-wheelers, commercial trucks, heavy vehicles",
                        "Fleet operators — Cold chain, mining, port operations, last-mile, hazardous material transport",
                        "Aftermarket telematics platforms — Companies building connected vehicle software for existing fleets",
                        "EV ecosystem players — Battery tech companies, charging infrastructure, EV SaaS platforms",
                        "Shared mobility — Ride-hailing, gig platforms, subscription mobility services"
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "AIS140 — India's immediate buying trigger",
                    content: "Every commercial vehicle must have a GPS device sending real-time tracking data. Any company operating commercial fleets not yet compliant needs a solution fast. Condense handles the full data pipeline from device ingestion to delivery."
                },
                {
                    type: "action-block",
                    title: "Global OEM trigger — New vehicle launches",
                    content: "Every time a manufacturer launches a new model with connected features, they need a streaming platform for telemetry. If they are using a fragmented stack, this launch moment is the perfect time to introduce Condense."
                },
                {
                    type: "quote",
                    content: "At 50,000 connected vehicles sending data every 10 seconds, that is over 5 million data points per minute. Most existing stacks were not built for that load. Condense was."
                }
            ]
        ],
        quiz: [
            {
                question: "How many data points per minute does a fleet of 50,000 connected vehicles generate if each sends data every 10 seconds?",
                options: ["500,000", "1 million", "5 million", "50 million"],
                correctAnswerIndex: 2,
                explanation: "50,000 vehicles × 6 data points per minute = 300,000 per minute — but vehicles also send multiple data fields per event, easily reaching 5 million data points per minute at scale."
            },
            {
                question: "Which is the strongest and most immediate buying trigger in the Indian mobility market?",
                options: [
                    "EV adoption rates",
                    "AIS140 compliance — mandatory real-time GPS tracking for all commercial vehicles",
                    "Rising fuel costs",
                    "Driver shortage"
                ],
                correctAnswerIndex: 1,
                explanation: "AIS140 is a government mandate with a compliance deadline — creating urgent, non-negotiable demand for a real-time data pipeline."
            }
        ]
    },

    // ─────────────────────────────────────────
    // MISSION 3 — How to Sell Condense
    // ─────────────────────────────────────────
    {
        id: "m3-s1",
        missionId: 3,
        title: "Section 1",
        subtitle: "The Sales Conversation Flow",
        vibeColor: "#4c1d95",
        content: [
            {
                type: "paragraph",
                content: "Every great Condense sales conversation follows the same 5-step flow. Learn this and use it every time."
            },
            {
                type: "list",
                title: "The 5 steps",
                content: [
                    "Step 1 — Start with their vehicles or devices, not with your product",
                    "Step 2 — Find the hidden cost",
                    "Step 3 — Surface the compliance angle",
                    "Step 4 — Introduce the platform",
                    "Step 5 — Close with a forward question"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Every great Condense sales conversation follows the same flow. Learn this and use it every time."
                },
                {
                    type: "action-block",
                    title: "Step 1 — Start with their business",
                    content: "\"How many connected assets are you managing today and what does that number look like in 18 months?\" This anchors the conversation in their growth, not your technology. If they are growing, their current stack will struggle."
                },
                {
                    type: "action-block",
                    title: "Step 2 — Find the hidden cost",
                    content: "Most companies only count their Kafka bill. Ask: \"When your team needs to add a new data source or device type, how long does that take from decision to production?\" If the answer is weeks or months, Condense can bring it down to hours."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Step 3 — Surface the compliance angle",
                    content: "\"Do you have any data residency or localization requirements for your vehicle or device data?\" Almost every enterprise answers yes. The moment they say yes, BYOC becomes your strongest card."
                },
                {
                    type: "action-block",
                    title: "Step 4 — Introduce the platform",
                    content: "Only after you understand their pain, size, and compliance needs do you introduce Condense. Frame it as completing their Kafka investment, not replacing it."
                },
                {
                    type: "action-block",
                    title: "Step 5 — Close with a forward question",
                    content: "\"If your team could spend half the time on infrastructure and twice the time on product, what would you build first?\" Let them answer. That answer is your next proposal."
                }
            ]
        ],
        quiz: [
            {
                question: "What is the purpose of asking 'How many connected assets are you managing today and what does that number look like in 18 months?'",
                options: [
                    "To qualify whether the company is too small for Condense",
                    "To anchor the conversation in their business growth — which will stress their current stack",
                    "To determine the pricing tier",
                    "To understand their hardware vendor"
                ],
                correctAnswerIndex: 1,
                explanation: "This question makes the prospect think about scale and growth pressure — creating the context in which their current stack will fail and Condense becomes the natural solution."
            },
            {
                question: "At which step of the sales conversation should you introduce the Condense platform?",
                options: [
                    "Step 1 — Start by showing the product",
                    "Step 2 — After finding the hidden cost",
                    "Step 4 — Only after understanding their pain, size, and compliance needs",
                    "You should not introduce the platform at all"
                ],
                correctAnswerIndex: 2,
                explanation: "Introduce Condense only after you have established pain context. Pitching too early makes it feel like a product demo, not a solution."
            },
            {
                question: "Why is asking about data residency requirements an important step in the conversation?",
                options: [
                    "It helps determine which cloud provider they use",
                    "It activates the BYOC conversation — which is often a non-negotiable enterprise requirement",
                    "It is required by law before any sales conversation",
                    "It helps calculate pricing"
                ],
                correctAnswerIndex: 1,
                explanation: "When a customer says they have residency requirements, BYOC immediately becomes not just an advantage but often the only compliant option."
            }
        ]
    },

    {
        id: "m3-s2",
        missionId: 3,
        title: "Section 2",
        subtitle: "Objection Handling",
        vibeColor: "#5b21b6",
        content: [
            {
                type: "paragraph",
                content: "Know what they will say before they say it. These are the six most common objections and exactly how to respond."
            }
        ],
        pages: [
            [
                {
                    type: "deep-dive",
                    title: "\"We've already built everything around Confluent.\"",
                    content: "Say: \"That makes sense. Where teams usually start reconsidering is not because Kafka isn't working — it's because everything built around it grows in complexity. Condense doesn't replace your Kafka investment. It replaces the complexity that grew around it.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Our system scales fine. Why change it?\"",
                    content: "Say: \"If it scales, your foundation is strong. The question is how easy it is to operate and evolve as the platform grows. Even if the system scales technically, teams spend increasing effort debugging, coordinating deployments, and maintaining infrastructure.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "\"We have data residency requirements. We can't use a cloud platform.\"",
                    content: "Say: \"That's exactly why BYOC exists. Condense runs entirely inside your cloud — your VPC, your region, your keys. No data ever leaves your environment. Most of our customers came to us specifically because of this requirement.\""
                },
                {
                    type: "deep-dive",
                    title: "\"We'd rather build this ourselves.\"",
                    content: "Say: \"Most teams start there. The question is the opportunity cost. Every engineer-hour spent on streaming infrastructure is an hour not spent on your actual product. Condense gives you a production-grade platform on day one.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "\"Your price is too high.\"",
                    content: "Say: \"Let's look at what you're spending today. Kafka cluster. Processing layer. DevOps time. Cloud egress fees. Oncall hours. Most teams that add this up find Condense is not more expensive — it's often cheaper. And that's before counting the engineering time saved.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Confluent is the Kafka company. Why take a risk on someone else?\"",
                    content: "Say: \"Condense builds on the same Kafka foundation — and it's backed by Bosch, one of the world's largest engineering organizations. 25+ enterprises are running it in production today, processing over 4,900 TB of streaming data per year.\""
                }
            ]
        ],
        quiz: [
            {
                question: "When a customer says 'We have data residency requirements and can't use a cloud platform,' what is the correct response?",
                options: [
                    "Offer to host the data in their country",
                    "Explain that BYOC means Condense runs entirely inside their cloud — their VPC, their region, their keys",
                    "Tell them data residency requirements are overstated",
                    "End the conversation — they are not a fit"
                ],
                correctAnswerIndex: 1,
                explanation: "BYOC directly addresses data residency concerns — data never leaves the customer's environment. This objection is actually a strong signal of fit."
            },
            {
                question: "How do you respond to 'Your price is too high'?",
                options: [
                    "Offer an immediate discount",
                    "Help them calculate the fully-loaded cost of their current setup — Kafka, DevOps time, egress, oncall hours — Condense is often cheaper",
                    "Tell them they are wrong",
                    "Lower the scope of the deal"
                ],
                correctAnswerIndex: 1,
                explanation: "Most customers only know their Kafka bill, not the total cost. Walking through the real cost often reveals Condense is competitive or cheaper."
            }
        ]
    },

    {
        id: "m3-s3",
        missionId: 3,
        title: "Section 3",
        subtitle: "Competitive Positioning",
        vibeColor: "#6d28d9",
        content: [
            {
                type: "paragraph",
                content: "Know exactly how to stand against every alternative. Use these lines in every competitive conversation."
            }
        ],
        pages: [
            [
                {
                    type: "deep-dive",
                    title: "Against Confluent",
                    content: "Where it falls short: Manages the Kafka layer but everything around it — stream processing, custom transforms, application management — still requires separate tools. It is expensive at high data volumes and creates data residency problems. Your line: \"Confluent solves the Kafka management problem. Condense solves the entire streaming stack problem. And it runs inside your cloud, not ours.\""
                },
                {
                    type: "deep-dive",
                    title: "Against self-managed Kafka",
                    content: "Where it falls short: Everything is the team's responsibility. Upgrades, monitoring, scaling, fault tolerance — all of it takes engineering time away from the actual product. Your line: \"Self-managed Kafka gives maximum control. Condense gives the same control with none of the operational burden.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Against AWS MSK",
                    content: "Where it falls short: Only manages the Kafka cluster. Everything above it — transforms, processing, observability — still needs to be built. Only works on AWS. Your line: \"MSK is a solid Kafka cluster. Condense is the full platform above it. And it works on any cloud.\""
                },
                {
                    type: "deep-dive",
                    title: "Against Confluent's managed Flink",
                    content: "Where it falls short: The compute runs in Confluent's cloud. Your data still moves from your VPC into their service for processing — introducing network hops and egress costs. Your line: \"Managed Flink solves scaling. It doesn't solve where your data goes. Condense deploys everything inside your cloud — Kafka and processing run together. Data never leaves your network.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Against building in-house",
                    content: "Where it falls short: Internal builds take 12 to 18 months to reach production quality, require constant maintenance, and depend on a small number of engineers who built the system. Your line: \"Building in-house gives you exactly what you need eventually. Condense gives you that today so your team can focus on what actually differentiates your business.\""
                },
                {
                    type: "action-block",
                    title: "The universal competitive line",
                    content: "\"Ask any competitor: Do you run the actual Kafka cluster inside my VPC, provide a full IDE, AND manage the applications I build with a 99.95% SLA?' The answer is always no. Condense is the only platform that does all three.\""
                }
            ]
        ],
        quiz: [
            {
                question: "What is the single most important competitive differentiator for Condense against all alternatives?",
                options: [
                    "The lowest price in the market",
                    "Native Kafka + full development framework + full application management with SLA — all in one platform inside your cloud",
                    "The largest number of connectors",
                    "The longest company history"
                ],
                correctAnswerIndex: 1,
                explanation: "No competitor offers all three together: native Kafka in your VPC, a full development IDE, and managed application SLA all in one place."
            },
            {
                question: "Why is Confluent's managed Flink a weaker option than Condense's processing?",
                options: [
                    "Flink is technically inferior to Condense's processing engine",
                    "Managed Flink requires data to leave the customer's VPC for processing — adding egress costs and compliance risk",
                    "Flink is only available in one cloud region",
                    "Flink has no auto-scaling capability"
                ],
                correctAnswerIndex: 1,
                explanation: "Managed Flink runs in Confluent's cloud, meaning the customer's data must travel outside their VPC for processing — a data residency problem Condense avoids entirely."
            }
        ]
    },

    {
        id: "m3-s4",
        missionId: 3,
        title: "Section 4",
        subtitle: "Pricing Approach",
        vibeColor: "#7c3aed",
        content: [
            {
                type: "paragraph",
                content: "Never lead with price. Lead with the cost of their current situation. Before sharing any number, help the prospect understand what they are currently spending."
            },
            {
                type: "list",
                title: "Pricing ranges",
                content: [
                    "Entry point — $1,200/month for up to 10 Mbps (free trial tier, no credit card)",
                    "Small deployments — $60,000 to $100,000 per year",
                    "Growing companies — $100,000 to $200,000 per year",
                    "Large enterprises — $200,000 to $1,500,000 per year"
                ]
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Never lead with price. Lead with the cost of their current situation. Before sharing any number, help the prospect understand what they are currently spending — Kafka cluster, processing layer, DevOps time, cloud egress fees, oncall hours, delayed feature launches."
                },
                {
                    type: "action-block",
                    title: "The pricing model",
                    content: "Condense is priced on data throughput — how much data flows through the platform. The customer pays for what they use. Cost grows with their business, not as a fixed overhead from day one."
                }
            ],
            [
                {
                    type: "list",
                    title: "Pricing ranges",
                    content: [
                        "Entry point — $1,200/month for up to 10 Mbps. Free trial. No credit card. No commitment.",
                        "Small deployments — $60,000 to $100,000 per year",
                        "Growing companies — $100,000 to $200,000 per year",
                        "Large enterprises — $200,000 to $1,500,000 per year",
                        "Standard contract — 3 years"
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Cloud marketplace advantage",
                    content: "Available through AWS, GCP, and Azure marketplaces. Enterprise customers can pay using existing cloud credits — reducing effective spend by 20 to 30 percent immediately. This removes budget blockers for customers with pre-committed cloud spend."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "The question to always ask before pricing",
                    content: "\"Do you know the fully-loaded cost of your current streaming stack — infrastructure, engineering time, and the opportunity cost of slower delivery?\" If they don't know, offer to work through it together. That exercise is your strongest pre-proposal tool."
                },
                {
                    type: "quote",
                    content: "The best time to share a number is after the prospect feels the weight of what they are currently spending. Not before."
                }
            ]
        ],
        quiz: [
            {
                question: "What is the correct approach when a prospect asks for the price immediately?",
                options: [
                    "Share the full pricing sheet immediately",
                    "First help them quantify the fully-loaded cost of their current setup, then share Condense pricing in comparison",
                    "Refuse to discuss pricing until a legal NDA is signed",
                    "Always offer the lowest tier first"
                ],
                correctAnswerIndex: 1,
                explanation: "Sharing price before establishing cost context makes Condense look expensive. After they see their true current spend, the Condense number looks very different."
            },
            {
                question: "How can enterprise customers reduce their effective Condense spend by 20-30% immediately?",
                options: [
                    "By negotiating a longer contract",
                    "By purchasing through the AWS, GCP, or Azure marketplace and using existing cloud credits",
                    "By using the free trial indefinitely",
                    "By buying a smaller data throughput tier"
                ],
                correctAnswerIndex: 1,
                explanation: "Cloud marketplace purchases count toward existing EDP commitments — customers effectively pay with credits they've already committed, reducing out-of-pocket spend."
            },
            {
                question: "How is Condense priced?",
                options: [
                    "Per user or per seat",
                    "Fixed monthly fee regardless of usage",
                    "Based on data throughput — how much data flows through the platform",
                    "Based on the number of Kafka topics"
                ],
                correctAnswerIndex: 2,
                explanation: "Condense's throughput-based pricing means costs grow with the business — you pay for what you use, making it accessible at every stage of growth."
            }
        ]
    },

    {
        id: "m3-s5",
        missionId: 3,
        title: "Section 5",
        subtitle: "Where Condense Wins",
        vibeColor: "#8b5cf6",
        content: [
            {
                type: "paragraph",
                content: "Know these six situations and you will qualify deals faster and pitch sharper. These are the moments where Condense closes every time."
            }
        ],
        pages: [
            [
                {
                    type: "deep-dive",
                    title: "When the engineering team is overwhelmed",
                    content: "Adding a new feature requires touching five systems, coordinating three teams, and a two-week deployment cycle. When a team hears they can do all of that in one platform, the reaction is immediate relief."
                },
                {
                    type: "deep-dive",
                    title: "When cloud costs are rising with no clear explanation",
                    content: "Data moving between systems generates fees at every step. Kafka to processing engine. Processing engine to storage. Storage to analytics. Each hop costs money. Condense removes the hops."
                },
                {
                    type: "deep-dive",
                    title: "When a regulation arrives with a deadline",
                    content: "AIS140 in India. GDPR in Europe. Data localization laws with a compliance date. These create urgency no other trigger matches. BYOC is the fastest path to compliance."
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "When a fleet is scaling rapidly",
                    content: "Going from 10,000 to 100,000 connected vehicles breaks most architectures. Device types multiply. Data volume surges. New use cases appear. Companies growing this fast need a platform that grows with them."
                },
                {
                    type: "deep-dive",
                    title: "When a key engineer leaves",
                    content: "The person who understood the original architecture is gone. Nobody wants to maintain what they left behind. A platform that manages itself becomes very attractive very fast."
                },
                {
                    type: "deep-dive",
                    title: "When a new product launch is coming",
                    content: "Every time a manufacturer or fleet operator announces a new connected product, new pipelines are being built. This is the perfect moment to show how Condense reduces the time from idea to production."
                }
            ]
        ],
        quiz: [
            {
                question: "Why is a key engineer leaving the company a strong buying signal for Condense?",
                options: [
                    "It means the company has budget saved on salaries",
                    "The system they built is now unmaintainable by the remaining team — a self-managing platform like Condense becomes immediately attractive",
                    "The new engineer will always choose Condense",
                    "Engineer turnover doesn't affect technology decisions"
                ],
                correctAnswerIndex: 1,
                explanation: "When the person who understands the custom-built architecture leaves, no one wants to inherit it. A fully managed platform that runs itself solves this immediately."
            },
            {
                question: "How does Condense solve the problem of rising cloud costs that have no clear explanation?",
                options: [
                    "By negotiating better rates with cloud providers",
                    "By removing the hops — data moving between systems generates fees at every step; Condense processes in one place",
                    "By compressing all data at rest",
                    "By switching the customer to a cheaper cloud provider"
                ],
                correctAnswerIndex: 1,
                explanation: "Every hop data takes between systems adds egress and compute costs. Condense's unified processing plane eliminates unnecessary data movement, directly reducing cloud bills."
            }
        ]
    },

    {
        id: "m3-s6",
        missionId: 3,
        title: "Section 6",
        subtitle: "Resources and Next Steps",
        vibeColor: "#a78bfa",
        content: [
            {
                type: "paragraph",
                content: "Use the 30-day free trial for any technical team that wants to evaluate. Full features. Up to 10 Mbps. No credit card. No commitment."
            },
            {
                type: "action-block",
                title: "Resources",
                content: "Demo access, product documentation, sales decks, case study PDFs, and team contacts will be updated here. Check with your sales lead for the latest materials."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "The 30-Day Free Trial",
                    content: "Use this for any technical team that wants to evaluate. Full features. Up to 10 Mbps. No credit card. No commitment. The fastest path to a technical champion is letting them experience the platform."
                },
                {
                    type: "list",
                    title: "Resources to be updated",
                    content: [
                        "Demo access link — ask your sales lead",
                        "Product documentation — ask your sales lead",
                        "Sales decks and pitch materials",
                        "Case study PDFs for each customer story",
                        "Team contacts for technical questions"
                    ]
                }
            ],
            [
                {
                    type: "quote",
                    content: "You have completed all three missions. You understand what Condense does, who needs it, and how to sell it. Now go use it."
                },
                {
                    type: "action-block",
                    title: "Your first action",
                    content: "Find one prospect in your pipeline who fits the ideal customer profile. Use the 5-step conversation flow. Report back what you learned."
                }
            ]
        ],
        quiz: [
            {
                question: "What is the best way to get a technical team to evaluate Condense?",
                options: [
                    "Send them a 50-slide deck",
                    "Use the 30-day free trial — full features, up to 10 Mbps, no credit card, no commitment",
                    "Schedule a demo with the CEO present",
                    "Send a pricing proposal before any evaluation"
                ],
                correctAnswerIndex: 1,
                explanation: "Getting technical teams hands-on with the platform is the fastest path to a technical champion. The free trial requires zero commitment and provides full access."
            },
            {
                question: "What should be your first action after completing these three missions?",
                options: [
                    "Read the missions again",
                    "Find one prospect fitting the ideal customer profile and run the 5-step conversation flow",
                    "Share the playbook with the entire team",
                    "Wait for your next training session"
                ],
                correctAnswerIndex: 1,
                explanation: "Learning without action is wasted. Apply the 5-step conversation flow immediately on one real prospect and bring back what you learned."
            }
        ]
    }
];
