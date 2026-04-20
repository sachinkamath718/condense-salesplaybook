export interface KeywordDef {
    term: string;
    definition: string;
}

export const PLAYBOOK_KEYWORDS: KeywordDef[] = [
    { term: "BYOC", definition: "Bring Your Own Cloud: The Condense platform runs entirely inside your own AWS, GCP, or Azure account. Your data never leaves your cloud boundary." },
    { term: "Kafka", definition: "Apache Kafka is the world's most trusted open-source distributed event streaming platform, used by thousands of companies for high-performance data pipelines." },
    { term: "Confluent", definition: "A managed Kafka company. Handles the Kafka layer but not the full streaming stack. Runs on Confluent's cloud, which creates data residency challenges." },
    { term: "MSK", definition: "Amazon Managed Streaming for Apache Kafka. Manages the Kafka cluster on AWS but doesn't solve the processing and transformation layers above it." },
    { term: "TCO", definition: "Total Cost of Ownership: The full cost of a system including infrastructure, engineering time, cloud fees, oncall hours, and opportunity cost of delayed launches." },
    { term: "AIS140", definition: "Indian government regulation mandating real-time GPS tracking for all commercial vehicles. Creates immediate compliance urgency for fleet operators." },
    { term: "OEM", definition: "Original Equipment Manufacturer — vehicle makers like truck, two-wheeler, or EV companies building connected vehicle platforms." },
    { term: "Data Residency", definition: "The requirement that data must stay within a geographic or cloud boundary. A compliance requirement for most enterprise customers. Solved by BYOC." },
    { term: "SLA", definition: "Service Level Agreement — a commitment to uptime and performance. Condense guarantees 99.95% uptime for both the Kafka cluster and the applications built on it." },
    { term: "Microservice Sprawl", definition: "The result of building separate services for every data processing task. Each one needs its own deployment, monitoring, and scaling — multiplying maintenance burden." },
    { term: "Telemetry", definition: "Automated data collection from vehicles, sensors, or devices. Includes location, speed, diagnostics, and behavior data sent continuously in real time." }
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
    title: string;
    subtitle: string;
    vibeColor: string;
    content: ContentBlock[];
    pages?: ContentBlock[][];
    quiz?: QuizQuestion[];
}


export const fullPlaybookData: Chapter[] = [

    // ─────────────────────────────────────────────
    // MISSION 1 — Understanding Condense
    // ─────────────────────────────────────────────

    {
        id: "m1-s1",
        title: "Mission 1 · Section 1",
        subtitle: "Introduction — What is Condense?",
        vibeColor: "#064e3b",
        content: [
            {
                type: "paragraph",
                content: "A truck breaks down on a highway. The driver calls the fleet manager. The fleet manager opens the dashboard. The data is 5 minutes old. Nobody knows where the truck is right now."
            },
            {
                type: "paragraph",
                content: "Condense fixes that. It is one platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Picture this."
                },
                {
                    type: "paragraph",
                    content: "A truck breaks down on a highway. The driver calls the fleet manager. The fleet manager opens the dashboard. The data is 5 minutes old. Nobody knows where the truck is right now."
                },
                {
                    type: "paragraph",
                    content: "This happens every single day across thousands of fleets."
                },
                {
                    type: "paragraph",
                    content: "The data exists. The sensors are working. The problem is the system handling the data is slow, broken into pieces, and impossible to manage."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "What Condense Does",
                    content: "It is one platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud."
                },
                {
                    type: "paragraph",
                    content: "By the end of these missions you will understand exactly what Condense does and how to explain it to anyone in under 2 minutes."
                },
                {
                    type: "quote",
                    content: "Let's go."
                }
            ]
        ]
    },

    {
        id: "m1-s2",
        title: "Mission 1 · Section 2",
        subtitle: "Cloud-Native Streaming Architecture Today",
        vibeColor: "#065f46",
        content: [
            {
                type: "paragraph",
                content: "Most companies today collect data from vehicles, sensors, or devices and try to make sense of it fast. To do this they use Apache Kafka. Kafka moves data at high speed. It works well. But Kafka alone is not enough."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "The world your customer lives in",
                    content: "Most companies today collect data from vehicles, sensors, or devices and try to make sense of it fast."
                },
                {
                    type: "paragraph",
                    content: "To do this they use a tool called Apache Kafka. Kafka moves data from one place to another at high speed. It works well. Almost every large company uses it."
                },
                {
                    type: "paragraph",
                    content: "But Kafka alone is not enough."
                }
            ],
            [
                {
                    type: "list",
                    title: "What companies have to build around Kafka",
                    content: [
                        "A tool to process the data",
                        "A tool to transform it",
                        "A tool to route it",
                        "A tool to monitor it",
                        "A tool to scale it",
                        "A tool to alert when something goes wrong"
                    ]
                },
                {
                    type: "paragraph",
                    content: "Each tool is built separately. Maintained separately. Managed by a different team."
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "This is how most companies operate today. It works. But just barely. And the bigger the company gets, the harder it becomes to manage."
                },
                {
                    type: "quote",
                    content: "Kafka is the foundation everyone already trusts. The problem is everything built around it. That is exactly where Condense comes in."
                }
            ]
        ]
    },

    {
        id: "m1-s3",
        title: "Mission 1 · Section 3",
        subtitle: "Why Architectures Break Over Time",
        vibeColor: "#14532d",
        content: [
            {
                type: "paragraph",
                content: "Here is what happens inside every company over time. Systems that start simple become impossible to manage as they grow — not because of bad engineering, but because of natural complexity."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "What happens when systems grow",
                    content: "Here is what happens inside every company over time."
                },
                {
                    type: "list",
                    content: [
                        "Year 1 — The team sets up Kafka. Everything works. The team is happy.",
                        "Year 2 — A new use case comes in. They add a new service. Then another. Then a new alert. Then a new transformation.",
                        "Year 3 — The system is now made of 10 different pieces. When something breaks, nobody knows where to look. Fixing one thing breaks another.",
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
                    type: "quote",
                    content: "When you hear these phrases, the door is open."
                }
            ]
        ]
    },

    {
        id: "m1-s4",
        title: "Mission 1 · Section 4",
        subtitle: "Where Condense Fits",
        vibeColor: "#166534",
        content: [
            {
                type: "paragraph",
                content: "Condense does not replace Kafka. It completes it. Say that line in every conversation. It removes fear immediately."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "The Line to Always Say",
                    content: "Condense does not replace Kafka. It completes it."
                },
                {
                    type: "paragraph",
                    content: "It takes everything a company has built around Kafka — the processing tools, the transformation services, the monitoring systems, the scaling setup — and replaces all of it with one single platform."
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
                        "BYOC — Bring Your Own Cloud. The platform runs inside the customer's AWS, GCP, or Azure. Full data control. Full compliance. This is not a feature for most enterprise customers. It is a requirement.",
                        "Build anything — Teams can use no-code tools for simple pipelines or write full custom code in Java, Python, or Go. An AI-assisted IDE is built in. Version control is built in.",
                        "Condense manages it all — Once a team builds something on Condense, Condense keeps it running. Scales it. Monitors it. Maintains 99.95% uptime."
                    ]
                }
            ],
            [
                {
                    type: "quote",
                    content: "The result: Faster product launches. Lower cloud costs. Less time on maintenance. More time building things that matter."
                }
            ]
        ]
    },

    {
        id: "m1-s5",
        title: "Mission 1 · Section 5",
        subtitle: "What Makes Condense Different",
        vibeColor: "#15803d",
        content: [
            {
                type: "paragraph",
                content: "Many platforms do one or two of these things. Condense does all three together. That combination is what no competitor offers in one place."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "The three things no competitor offers together",
                    content: "Many platforms do one or two of these things. Condense does all three together."
                },
                {
                    type: "deep-dive",
                    title: "First — Truly Kafka-native",
                    content: "Condense actually runs and manages a real Kafka cluster inside your customer's cloud. Topics, producers, consumers, and Kafka APIs all remain exactly the same. Nothing is abstracted away. No proprietary transport layer. Kafka stays as the backbone."
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Second — Full development environment",
                    content: "The built-in IDE lets developers write, test, version, and deploy streaming logic directly in code. Java, Python, or Go. Git is built in. CI/CD is supported. An AI coding agent, QA agent, and monitoring agent are all part of the platform."
                },
                {
                    type: "deep-dive",
                    title: "Third — Fully managed with a real SLA",
                    content: "Not just the Kafka cluster. The applications teams build on it too. Condense manages the application with a 99.95% uptime guarantee. Most platforms manage infrastructure. Condense manages the whole thing."
                }
            ],
            [
                {
                    type: "quote",
                    content: "Native Kafka, full development framework, full management — this is what no other platform offers in one place."
                }
            ]
        ]
    },

    {
        id: "m1-s6",
        title: "Mission 1 · Section 6",
        subtitle: "Proof It Works — Real Customers, Real Numbers",
        vibeColor: "#16a34a",
        content: [
            {
                type: "paragraph",
                content: "Every conversation needs proof. Five customers. Five proof points. One number to always remember: every single customer runs at 99.95% uptime."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "The Number to Always Remember",
                    content: "Every single customer runs at 99.95% uptime."
                },
                {
                    type: "list",
                    title: "Customer 1 — 3rd largest truck maker in India",
                    content: [
                        "7,000 trucks per month",
                        "Moved from IBM Event Streams to Condense on GCP",
                        "20% reduction in cloud spend",
                        "35% less on dev and ops",
                        "6 months faster to market",
                        "200,000 connected vehicles",
                        "Use when: Prospect is on IBM Event Streams or any legacy platform"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Customer 2 — Electric 3-Wheeler OEM, India",
                    content: [
                        "Moved from Confluent to Condense for a unified electric mobility platform",
                        "40% reduction in total cost of ownership",
                        "62,000 connected vehicles",
                        "99.95% uptime",
                        "Use when: Prospect is on Confluent and feeling cost pressure"
                    ]
                },
                {
                    type: "list",
                    title: "Customer 3 — India's largest truck maker",
                    content: [
                        "25,000 trucks per month",
                        "Connected 8 different hardware sources across legacy and new fleet variants",
                        "Real-time streaming across all device types",
                        "15,000 vehicles now. Potential of 1.2 million.",
                        "Use when: Prospect has mixed hardware or legacy fleet integration challenges"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Customer 4 — India's most loved 2-wheeler brand",
                    content: [
                        "75,000 vehicles per month",
                        "Built their Connected Bike Platform on Condense, optimized for GCP",
                        "360-degree vehicle insight",
                        "40,000 connected vehicles",
                        "Use when: Prospect is on GCP or building consumer-facing connected products"
                    ]
                },
                {
                    type: "list",
                    title: "Customer 5 — One of India's largest port operators",
                    content: [
                        "12 ports",
                        "Real-time tracking across electric and diesel trucks",
                        "600+ active geofences",
                        "6x faster time to market",
                        "Use when: Prospect is in logistics, ports, or mixed-fleet operations"
                    ]
                }
            ]
        ]
    },

    // ─────────────────────────────────────────────
    // MISSION 2 — Identifying the Right Customer
    // ─────────────────────────────────────────────

    {
        id: "m2-s1",
        title: "Mission 2 · Section 1",
        subtitle: "Who Is the Ideal Customer?",
        vibeColor: "#1e3a5f",
        content: [
            {
                type: "paragraph",
                content: "Not every company is the right fit. Knowing who to walk away from is just as valuable as knowing who to pursue."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "Know who to pursue and who to walk away from",
                    content: "Not every company is the right fit. Knowing who to walk away from is just as valuable as knowing who to pursue."
                },
                {
                    type: "list",
                    title: "Profile of a company ready for Condense",
                    content: [
                        "They already use Kafka or something like it — they are not starting from scratch",
                        "They have connected devices or real-time data flows — vehicles, sensors, machines generating continuous streams",
                        "They are between 100 and 10,000 employees — large enough to feel infrastructure pain, growing fast enough to feel it",
                        "They are growing faster than their engineering team can keep up with",
                        "They have data privacy or compliance requirements — healthcare, vehicle telemetry, financial transactions"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Walk away if",
                    content: [
                        "The company has no streaming infrastructure and no plans to build one",
                        "The company is fully on-premise with no cloud migration planned",
                        "There is no technical champion willing to evaluate the platform"
                    ]
                },
                {
                    type: "quote",
                    content: "Knowing who to walk away from saves you time for the right conversations."
                }
            ]
        ]
    },

    {
        id: "m2-s2",
        title: "Mission 2 · Section 2",
        subtitle: "Market Size — The Size of the Opportunity",
        vibeColor: "#1e3a8a",
        content: [
            {
                type: "paragraph",
                content: "The global data streaming market is large and growing fast. The mobility sector alone represents a massive and immediately addressable opportunity."
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
                    title: "The mobility sector opportunity",
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
                    title: "India — The Immediate Opportunity",
                    content: "The AIS140 regulation mandates real-time GPS tracking for all commercial vehicles. Every truck and bus operating commercially must comply. This is not a future need. It is happening right now."
                },
                {
                    type: "paragraph",
                    content: "Beyond vehicles the same problem exists in ports, cold chain logistics, mining, last-mile delivery, and industrial operations. Any industry operating physical assets at scale has this problem."
                },
                {
                    type: "quote",
                    content: "Your target is companies with large and growing connected fleets. That is where urgency is highest and budget is most available."
                }
            ]
        ]
    },

    {
        id: "m2-s3",
        title: "Mission 2 · Section 3",
        subtitle: "The Right People to Talk To",
        vibeColor: "#312e81",
        content: [
            {
                type: "paragraph",
                content: "In every account there are two types of conversations to have. Learn to run both and translate between them."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "Who opens the door and who signs the deal",
                    content: "In every account there are two types of conversations to have."
                },
                {
                    type: "list",
                    title: "The technical conversation",
                    content: [
                        "Data engineers, Kafka engineers, platform engineers",
                        "DevOps leads, backend engineers, streaming infrastructure engineers",
                        "These are the people who know exactly how many systems break when a pipeline fails",
                        "They are your entry point — if they understand the value, they become your champion"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "The decision conversation",
                    content: [
                        "CTO, VP Engineering, Head of Data, Director of Platform Engineering",
                        "Head of Cloud, Chief Data Officer",
                        "These people care about faster time to market, lower costs, and less operational overhead",
                        "They are not interested in technical details — they want outcomes"
                    ]
                },
                {
                    type: "action-block",
                    title: "Your Job",
                    content: "Start with the technical team and use their language. Then translate that conversation into business outcomes when you reach the decision maker."
                }
            ],
            [
                {
                    type: "list",
                    title: "Start here — roles to look for",
                    content: [
                        "Kafka engineers being hired",
                        "Data platform leads",
                        "Telematics architects",
                        "Backend engineers",
                        "Streaming infrastructure engineers"
                    ]
                },
                {
                    type: "quote",
                    content: "If a company is hiring these roles, they have a real and growing streaming problem. That is your signal to reach out."
                }
            ]
        ]
    },

    {
        id: "m2-s4",
        title: "Mission 2 · Section 4",
        subtitle: "Triggers That Signal Buying Intent",
        vibeColor: "#3730a3",
        content: [
            {
                type: "paragraph",
                content: "Timing matters in sales. Here are the signals that tell you a company is ready to have this conversation right now."
            }
        ],
        pages: [
            [
                {
                    type: "list",
                    title: "High Priority Triggers",
                    content: [
                        "Hiring signals — posting for Kafka engineers, data platform leads, telematics architects, or DevOps engineers. Their streaming system is growing and they are feeling the weight of it.",
                        "Funding events — raised new investment and mentioned digital or AI initiatives. New money means new ambition. New ambition means new infrastructure needs.",
                        "New regulation — a new compliance law has been announced in their market. These create immediate urgency. BYOC becomes non-negotiable.",
                        "Technology migration — moving to the cloud or optimizing their cloud setup. Perfect moment to introduce a platform that deploys natively into their cloud."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Medium Priority Triggers",
                    content: [
                        "New product or feature launch — they announced a new application that processes real-time data. New pipelines are being built right now.",
                        "Leadership change — a new CTO, VP Engineering, or Head of Data joined. New leaders often audit what is working and what needs to change.",
                        "Geographic or fleet expansion — entering a new market or launching a new vehicle model. Expansion means more data, more devices, more pressure on existing infrastructure."
                    ]
                },
                {
                    type: "quote",
                    content: "Timing matters. A perfectly positioned pitch at the wrong moment goes nowhere. The same pitch at the right moment closes deals."
                }
            ]
        ]
    },

    {
        id: "m2-s5",
        title: "Mission 2 · Section 5",
        subtitle: "The Mobility Vertical in Depth",
        vibeColor: "#4338ca",
        content: [
            {
                type: "paragraph",
                content: "Mobility is where Condense has its strongest proof points and its clearest buying triggers. Lead with this vertical whenever you can."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "Your strongest market right now",
                    content: "Mobility is where Condense has its strongest proof points and its clearest buying triggers. Lead with this vertical whenever you can."
                },
                {
                    type: "list",
                    title: "Companies to target",
                    content: [
                        "Vehicle OEMs — Electric and ICE. Two-wheelers, three-wheelers, commercial trucks, heavy vehicles.",
                        "Fleet operators — Cold chain, mining, port operations, last-mile, hazardous material transport.",
                        "Aftermarket telematics platforms — Companies building connected vehicle software for existing fleets.",
                        "EV ecosystem players — Battery tech companies, charging infrastructure, EV SaaS platforms.",
                        "Shared mobility — Ride-hailing, gig platforms, subscription mobility services."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "India Trigger — AIS140",
                    content: "Every commercial vehicle must have a GPS device sending real-time tracking data. Any company operating commercial fleets that is not yet compliant needs a solution fast. Condense handles the full data pipeline from device ingestion to delivery."
                },
                {
                    type: "action-block",
                    title: "Global OEM Trigger — New Vehicle Launches",
                    content: "Every time a manufacturer launches a new model with connected features, they need a streaming platform to handle the telemetry. If they are using a fragmented stack, this launch moment is the perfect time to introduce Condense."
                }
            ],
            [
                {
                    type: "quote",
                    content: "At 50,000 connected vehicles sending data every 10 seconds, that is over 5 million data points per minute. Most existing stacks were not built for that load. Condense was."
                }
            ]
        ]
    },

    // ─────────────────────────────────────────────
    // MISSION 3 — How to Sell Condense
    // ─────────────────────────────────────────────

    {
        id: "m3-s1",
        title: "Mission 3 · Section 1",
        subtitle: "The Sales Conversation Flow",
        vibeColor: "#7c2d12",
        content: [
            {
                type: "paragraph",
                content: "Every great Condense sales conversation follows the same flow. Learn this and use it every time."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "How to run the conversation from start to finish",
                    content: "Every great Condense sales conversation follows the same flow. Learn this and use it every time."
                },
                {
                    type: "list",
                    title: "Step 1 — Start with their vehicles or devices",
                    content: [
                        "\"How many connected assets are you managing today and what does that number look like in 18 months?\"",
                        "This anchors the conversation in their business growth, not your technology",
                        "If they are growing, their current stack will struggle"
                    ]
                },
                {
                    type: "list",
                    title: "Step 2 — Find the hidden cost",
                    content: [
                        "Most companies only count their Kafka bill",
                        "They do not count engineering hours, cloud fees from moving data, or cost of delayed launches",
                        "Ask: \"When your team needs to add a new data source, how long does that take from decision to production?\""
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Step 3 — Surface the compliance angle",
                    content: [
                        "\"Do you have any data residency or localization requirements for your vehicle data?\"",
                        "Almost every enterprise in mobility answers yes",
                        "The moment they say yes, BYOC becomes your strongest card"
                    ]
                },
                {
                    type: "list",
                    title: "Step 4 — Introduce the platform",
                    content: [
                        "Only after you understand their pain, size, and compliance needs",
                        "Frame it as completing their Kafka investment, not replacing it"
                    ]
                },
                {
                    type: "list",
                    title: "Step 5 — Close with a forward question",
                    content: [
                        "\"If your team could spend half the time on infrastructure and twice the time on product, what would you build first?\"",
                        "Let them answer",
                        "That answer is your next proposal"
                    ]
                }
            ]
        ]
    },

    {
        id: "m3-s2",
        title: "Mission 3 · Section 2",
        subtitle: "Objection Handling",
        vibeColor: "#92400e",
        content: [
            {
                type: "paragraph",
                content: "What they will say and exactly how to respond. Learn these lines until they are automatic."
            }
        ],
        pages: [
            [
                {
                    type: "deep-dive",
                    title: "\"We've already built everything around Confluent.\"",
                    content: "\"That makes sense. Confluent is widely used for managed Kafka. Where teams usually start reconsidering is not because Kafka isn't working — it's because everything built around it grows in complexity. Multiple microservices for transforms, SQL flows for logic, different tools for monitoring. Condense doesn't replace your Kafka investment. It replaces the complexity that grew around it.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Our system scales fine. Why change it?\"",
                    content: "\"If it scales, your foundation is strong. The question is how easy it is to operate and evolve as the platform grows. Even if it scales technically, teams spend increasing effort debugging, coordinating deployments, and maintaining infrastructure. Condense simplifies that layer so your engineers can focus on building new capabilities.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "\"We have data residency requirements.\"",
                    content: "\"That's exactly why BYOC exists. Condense runs entirely inside your cloud — your VPC, your region, your keys. No data ever leaves your environment. Most of our customers came to us specifically because of this requirement.\""
                },
                {
                    type: "deep-dive",
                    title: "\"We'd rather build this ourselves.\"",
                    content: "\"Most teams start there. The question is the opportunity cost. Every engineer-hour spent building and maintaining streaming infrastructure is an hour not spent on your actual product. Condense gives you a production-grade platform on day one.\""
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "\"Your price is too high.\"",
                    content: "\"Let's look at what you're spending today. Kafka cluster. Processing layer. DevOps time. Cloud egress fees. Oncall hours. Most teams that add this up find Condense is not more expensive — it's often cheaper. And that's before counting engineering time saved on every new use case.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Confluent is the Kafka company. Why take a risk?\"",
                    content: "\"Confluent has done a great job around Kafka. Condense builds on the same foundation. The difference is it simplifies how the entire streaming pipeline is built and operated — backed by Bosch, one of the world's largest engineering organizations. 25+ enterprises are running it in production, processing over 4,900 TB per year.\""
                }
            ]
        ]
    },

    {
        id: "m3-s3",
        title: "Mission 3 · Section 3",
        subtitle: "Competitive Positioning",
        vibeColor: "#78350f",
        content: [
            {
                type: "paragraph",
                content: "How to stand against every alternative. Know these lines and you will handle any competitive conversation with confidence."
            }
        ],
        pages: [
            [
                {
                    type: "list",
                    title: "Against Confluent",
                    content: [
                        "Where it falls short: Manages the Kafka layer but everything around it still requires separate tools. Expensive at high data volumes. Runs on Confluent's cloud, creating data residency problems.",
                        "Your line: \"Confluent solves the Kafka management problem. Condense solves the entire streaming stack problem. And it runs inside your cloud, not ours.\""
                    ]
                },
                {
                    type: "list",
                    title: "Against self-managed Kafka",
                    content: [
                        "Where it falls short: Everything is the team's responsibility. Upgrades, monitoring, scaling, fault tolerance — all taking time away from the actual product.",
                        "Your line: \"Self-managed Kafka gives maximum control. Condense gives the same control with none of the operational burden.\""
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Against AWS MSK",
                    content: [
                        "Where it falls short: Only manages the Kafka cluster. Everything above — transforms, processing, observability — still needs to be built. Only works on AWS.",
                        "Your line: \"MSK is a solid Kafka cluster. Condense is the full platform above it. And it works on any cloud.\""
                    ]
                },
                {
                    type: "list",
                    title: "Against Confluent's managed Flink",
                    content: [
                        "Where it falls short: Compute runs in Confluent's cloud. Data moves from your VPC into their service, introducing network hops and egress costs.",
                        "Your line: \"Managed Flink solves scaling. It doesn't solve where your data goes. Condense deploys the entire platform inside your cloud — data never leaves your network.\""
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Against building in-house",
                    content: [
                        "Where it falls short: Internal builds take 12 to 18 months to reach production quality, require constant maintenance, and depend on a small number of engineers who built the system.",
                        "Your line: \"Building in-house gives you exactly what you need eventually. Condense gives you that today so your team can focus on what actually differentiates your business.\""
                    ]
                }
            ]
        ]
    },

    {
        id: "m3-s4",
        title: "Mission 3 · Section 4",
        subtitle: "Pricing Approach",
        vibeColor: "#854d0e",
        content: [
            {
                type: "paragraph",
                content: "Never lead with price. Lead with the cost of their current situation."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "The Rule",
                    content: "Never lead with price. Lead with the cost of their current situation. Before sharing any number, help the prospect understand what they are currently spending."
                },
                {
                    type: "list",
                    title: "What they are actually spending",
                    content: [
                        "Kafka cluster costs",
                        "Processing layer",
                        "DevOps time",
                        "Cloud egress fees",
                        "Oncall hours",
                        "Delayed feature launches"
                    ]
                },
                {
                    type: "paragraph",
                    content: "Most teams have never added this up. When they do, the Condense number looks very different."
                }
            ],
            [
                {
                    type: "list",
                    title: "The pricing model",
                    content: [
                        "Priced on data throughput — how much data flows through the platform",
                        "The customer pays for what they use",
                        "Cost grows with their business, not as a fixed overhead from day one"
                    ]
                },
                {
                    type: "list",
                    title: "The ranges",
                    content: [
                        "Entry point — $1,200 per month for up to 10 Mbps (free trial tier, no credit card, no commitment)",
                        "Small deployments — $60,000 to $100,000 per year",
                        "Growing companies — $100,000 to $200,000 per year",
                        "Large enterprises — $200,000 to $1,500,000 per year"
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "The Marketplace Angle",
                    content: "Available through AWS, GCP, and Azure marketplaces. Many enterprise customers pay with existing cloud credits — which can reduce effective spend by 20 to 30 percent immediately."
                },
                {
                    type: "quote",
                    content: "\"Do you know the fully-loaded cost of your current streaming stack — infrastructure, engineering time, and the opportunity cost of slower delivery?\" If they don't know the answer, offer to work through it with them."
                }
            ]
        ]
    },

    {
        id: "m3-s5",
        title: "Mission 3 · Section 5",
        subtitle: "Where Condense Wins",
        vibeColor: "#713f12",
        content: [
            {
                type: "paragraph",
                content: "Know these situations and you will qualify deals faster and pitch sharper."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    title: "The situations where you will close every time",
                    content: "Know these situations and you will qualify deals faster and pitch sharper."
                },
                {
                    type: "list",
                    title: "Win situations",
                    content: [
                        "When the engineering team is overwhelmed — adding a new feature requires touching five systems, coordinating three teams, and a two-week deployment cycle",
                        "When cloud costs are rising with no clear explanation — data moving between systems generates fees at every step",
                        "When a regulation arrives with a deadline — AIS140 in India, GDPR in Europe, data localization laws. BYOC is the fastest path to compliance",
                        "When a fleet is scaling rapidly — going from 10,000 to 100,000 connected vehicles breaks most architectures",
                        "When a key engineer leaves — nobody wants to maintain what they left behind. A platform that manages itself becomes very attractive very fast",
                        "When a new product launch is coming — every connected product announcement means new pipelines are being built right now"
                    ]
                }
            ],
            [
                {
                    type: "quote",
                    content: "When a regulation arrives with a deadline, urgency is created for you. No other trigger matches it."
                },
                {
                    type: "action-block",
                    title: "The Question to Qualify Fast",
                    content: "\"Is your team spending more time maintaining your current streaming stack, or building new capabilities on top of it?\" If the answer is maintaining — you have a deal to pursue."
                }
            ]
        ]
    },

    {
        id: "m3-s6",
        title: "Mission 3 · Section 6",
        subtitle: "Available Resources",
        vibeColor: "#44403c",
        content: [
            {
                type: "paragraph",
                content: "Use the 30-day free trial for any technical team that wants to evaluate. Full features. Up to 10 Mbps. No credit card. No commitment."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "Free Trial",
                    content: "Use the 30-day free trial link for any technical team that wants to evaluate. Full features. Up to 10 Mbps. No credit card. No commitment. Getting a technical team into a trial converts faster than any deck."
                },
                {
                    type: "list",
                    title: "Resources — To Be Updated",
                    content: [
                        "Demo access link",
                        "Product documentation",
                        "Sales decks",
                        "Case study PDFs",
                        "Team contacts"
                    ]
                },
                {
                    type: "paragraph",
                    content: "This section will be updated with direct links to all sales and technical resources as they become available."
                }
            ]
        ]
    }
];
