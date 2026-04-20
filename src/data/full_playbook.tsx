export interface KeywordDef {
    term: string;
    definition: string;
}

export const PLAYBOOK_KEYWORDS: KeywordDef[] = [
    { term: "BYOC", definition: "Bring Your Own Cloud: The Condense platform runs entirely inside the customer's own AWS, GCP, or Azure account for maximum security and data residency." },
    { term: "Kafka", definition: "Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines." },
    { term: "AIS140", definition: "An Indian government regulation that mandates real-time GPS tracking for all commercial vehicles. Creates immediate urgency for a compliant streaming platform." },
    { term: "MSK", definition: "Amazon Managed Streaming for Apache Kafka: AWS's fully managed Kafka service. Handles the cluster but not the full pipeline." },
    { term: "TCO", definition: "Total Cost of Ownership: The full cost including infrastructure, engineering time, maintenance, and opportunity cost of delayed features." },
    { term: "SLA", definition: "Service Level Agreement: Condense guarantees 99.95% uptime — not just for the Kafka cluster but for the applications built on it." },
    { term: "Microservices", definition: "Small independent services that handle different parts of a pipeline. When too many exist they create 'microservice sprawl' — hard to manage and maintain." },
    { term: "EDP", definition: "Enterprise Discount Program: Cloud provider pre-committed spend. Paying for Condense through the marketplace counts toward AWS/GCP/Azure EDP commitments." }
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
    {
        id: "ch-1",
        title: "Mission 1",
        subtitle: "Understanding Condense",
        vibeColor: "#064e3b",
        content: [
            {
                type: "paragraph",
                content: "One platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud."
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
                },
                {
                    type: "action-block",
                    title: "What is Condense?",
                    content: "Condense is one platform that takes in data the moment it is created, processes it instantly, and delivers it where it needs to go — all inside the customer's own cloud. By the end of these missions you will understand exactly what Condense does and how to explain it to anyone in under 2 minutes."
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "Most companies today collect data from vehicles, sensors, or devices and try to make sense of it fast. To do this they use a tool called Apache Kafka. Kafka moves data from one place to another at high speed. It works well. Almost every large company uses it."
                },
                {
                    type: "list",
                    title: "But Kafka alone is not enough. Companies have to build a lot of things around it:",
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
                    content: "Each tool is built separately. Maintained separately. Managed by a different team. This is how most companies operate today. It works — but just barely. And the bigger the company gets, the harder it becomes to manage."
                },
                {
                    type: "quote",
                    content: "Kafka is the foundation everyone already trusts. The problem is everything built around it. That is exactly where Condense comes in."
                }
            ],
            [
                {
                    type: "list",
                    title: "What happens when systems grow",
                    content: [
                        "Year 1 — The team sets up Kafka. Everything works. The team is happy.",
                        "Year 2 — A new use case comes in. They add a new service. Then another. Then a new alert. Then a new transformation.",
                        "Year 3 — The system is now made of 10 different pieces. When something breaks, nobody knows where to look. Fixing one thing breaks another.",
                        "Year 4 — The cloud bill is growing. A key engineer leaves. Hiring a replacement takes months. Adding any new feature takes weeks."
                    ]
                },
                {
                    type: "list",
                    title: "The symptoms your customer will recognize:",
                    content: [
                        "\"We have a lot of technical debt\"",
                        "\"Our pipeline is hard to maintain\"",
                        "\"It takes too long to ship new features\"",
                        "\"Our cloud costs keep going up\""
                    ]
                },
                {
                    type: "action-block",
                    title: "The signal",
                    content: "This is not bad engineering. This is what happens naturally when systems grow without a unified platform underneath them. When you hear these phrases, the door is open."
                }
            ],
            [
                {
                    type: "quote",
                    content: "Condense does not replace Kafka. It completes it. Say that line in every conversation. It removes fear immediately."
                },
                {
                    type: "paragraph",
                    content: "Condense takes everything a company has built around Kafka — the processing tools, the transformation services, the monitoring systems, the scaling setup — and replaces all of it with one single platform. That platform runs inside the customer's own cloud. Not Condense's cloud. The customer's cloud. Their data never leaves their environment."
                },
                {
                    type: "list",
                    title: "Three things to always highlight:",
                    content: [
                        "BYOC — Bring Your Own Cloud. The platform runs inside the customer's AWS, GCP, or Azure. Full data control. Full compliance. No shared infrastructure. This is not a feature for most enterprise customers. It is a requirement.",
                        "Build anything — Teams can use no-code tools for simple pipelines or write full custom code in Java, Python, or Go. There is an AI-assisted IDE built in. Version control is built in. Everything in one place.",
                        "Condense manages it all — Once a team builds something on Condense, Condense keeps it running. Scales it. Monitors it. Maintains 99.95% uptime. The team builds. Condense runs it."
                    ]
                },
                {
                    type: "action-block",
                    title: "The result",
                    content: "Faster product launches. Lower cloud costs. Less time on maintenance. More time building things that matter."
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "Many platforms do one or two of these things. Condense does all three together."
                },
                {
                    type: "list",
                    title: "The three things no competitor offers together:",
                    content: [
                        "Truly Kafka-native — Condense actually runs and manages a real Kafka cluster inside your customer's cloud. Topics, producers, consumers, and Kafka APIs all remain exactly the same. Nothing is abstracted away. No proprietary transport layer. Kafka stays as the backbone.",
                        "Full development environment — The built-in IDE lets developers write, test, version, and deploy streaming logic in Java, Python, or Go. Git is built in. CI/CD is supported. An AI coding agent, QA agent, and monitoring agent are all part of the platform.",
                        "Fully managed with a real SLA — Not just the Kafka cluster. The applications teams build on it too. Condense manages the application with a 99.95% uptime guarantee. Most platforms manage infrastructure. Condense manages the whole thing."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Why this matters",
                    content: "This combination — native Kafka, full development framework, full management — is what no other platform offers in one place."
                }
            ],
            [
                {
                    type: "list",
                    title: "Real customers, real numbers:",
                    content: [
                        "3rd largest truck maker in India (7,000 trucks/month) — Moved from IBM Event Streams to Condense on GCP. 20% reduction in cloud spend. 35% less on dev and ops. 6 months faster to market. 200,000 connected vehicles. 99.95% uptime. Use when: Prospect is on IBM Event Streams or any legacy platform.",
                        "Electric 3-Wheeler OEM, India — Moved from Confluent to Condense for a unified electric mobility platform. 40% reduction in TCO. 62,000 connected vehicles. 99.95% uptime. Use when: Prospect is on Confluent and feeling cost pressure.",
                        "India's largest truck maker (25,000 trucks/month) — Connected 8 different hardware sources across legacy and new fleet variants. 15,000 vehicles now. Potential of 1.2 million. Use when: Prospect has mixed hardware or legacy fleet integration challenges.",
                        "India's most loved 2-wheeler brand (75,000 vehicles/month) — Built their Connected Bike Platform on Condense, optimized for GCP. 360-degree vehicle insight. 40,000 connected vehicles. 99.95% uptime. Use when: Prospect is on GCP or building consumer-facing connected products.",
                        "One of India's largest port operators (12 ports) — Real-time tracking across electric and diesel trucks. 600+ active geofences. 6x faster time to market. 99.95% uptime. Use when: Prospect is in logistics, ports, or mixed-fleet operations."
                    ]
                },
                {
                    type: "quote",
                    content: "Every single customer runs at 99.95% uptime."
                }
            ]
        ],
        quiz: []
    },
    {
        id: "ch-2",
        title: "Mission 2",
        subtitle: "Identifying the Right Customer",
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
                    type: "list",
                    title: "Profile of a company ready for Condense:",
                    content: [
                        "They already use Kafka or something like it — not starting from scratch. They have a streaming stack that exists and is growing. Condense is built for teams that have already felt the pain of scale.",
                        "They have connected devices or real-time data flows — vehicles, sensors, machines, applications generating a continuous stream of data that needs to be acted on immediately.",
                        "They are between 100 and 10,000 employees — large enough to have real infrastructure pain, growing fast enough to feel it.",
                        "They are growing faster than their engineering team can keep up with — new use cases keep arriving, features are delayed, the backlog is long, the team is stretched.",
                        "They have data privacy or compliance requirements — healthcare data, vehicle telemetry, financial transactions. BYOC is not optional for these companies."
                    ]
                },
                {
                    type: "action-block",
                    title: "Walk away if:",
                    content: "The company has no streaming infrastructure and no plans to build one. The company is fully on-premise with no cloud migration planned. There is no technical champion willing to evaluate the platform."
                }
            ],
            [
                {
                    type: "list",
                    title: "The mobility market opportunity:",
                    content: [
                        "Over 1.4 billion vehicles on the road globally",
                        "Connected vehicle market growing at over 20% per year",
                        "Every new vehicle launched today has connectivity built in"
                    ]
                },
                {
                    type: "action-block",
                    title: "India — Immediate opportunity right now",
                    content: "The AIS140 regulation mandates real-time GPS tracking for all commercial vehicles. Every truck and bus operating commercially must comply. This is not a future need. It is happening right now. Any company operating commercial fleets that is not yet compliant needs a solution fast."
                },
                {
                    type: "paragraph",
                    content: "Beyond vehicles the same problem exists in ports, cold chain logistics, mining, last-mile delivery, and industrial operations. Any industry operating physical assets at scale has this problem. Your target is companies with large and growing connected fleets. That is where urgency is highest and budget is most available."
                }
            ],
            [
                {
                    type: "list",
                    title: "The technical conversation — your entry point:",
                    content: [
                        "Data engineers",
                        "Kafka engineers",
                        "Platform engineers",
                        "DevOps leads",
                        "Backend engineers",
                        "Streaming infrastructure engineers"
                    ]
                },
                {
                    type: "list",
                    title: "The decision conversation — who approves the budget:",
                    content: [
                        "CTO",
                        "VP Engineering",
                        "Head of Data",
                        "Director of Platform Engineering",
                        "Head of Cloud",
                        "Chief Data Officer"
                    ]
                },
                {
                    type: "quote",
                    content: "Start with the technical team and use their language. Then translate that conversation into business outcomes when you reach the decision maker. Your job is to start with the technical team and use their language."
                },
                {
                    type: "deep-dive",
                    title: "Signal to look for",
                    content: "If a company is posting jobs for Kafka engineers, data platform leads, or streaming infrastructure engineers — they have a real and growing streaming problem. That is your signal to reach out."
                }
            ],
            [
                {
                    type: "list",
                    title: "High priority triggers — reach out immediately:",
                    content: [
                        "Hiring signals — Posting for Kafka engineers, data platform leads, telematics architects, or DevOps engineers. This means their streaming system is growing and they are feeling the weight of it.",
                        "Funding events — Raised new investment and mentioned digital or AI initiatives. New money means new ambition. New ambition means new infrastructure needs.",
                        "New regulation — A new law around data transfer, data residency, or compliance has been announced in their market. BYOC becomes non-negotiable.",
                        "Technology migration — Moving to the cloud or optimizing their cloud setup. The perfect moment to introduce a platform that deploys natively into their cloud."
                    ]
                },
                {
                    type: "list",
                    title: "Medium priority triggers — add to cadence:",
                    content: [
                        "New product or feature launch — They announced a new application that processes real-time data. New pipelines are being built right now.",
                        "Leadership change — A new CTO, VP Engineering, or Head of Data joined. New leaders often audit what is working and what needs to change.",
                        "Geographic or fleet expansion — Entering a new market or launching a new vehicle model. More data, more devices, more pressure on existing infrastructure."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Companies to target in mobility:",
                    content: [
                        "Vehicle OEMs — Electric and ICE. Two-wheelers, three-wheelers, commercial trucks, heavy vehicles.",
                        "Fleet operators — Cold chain, mining, port operations, last-mile, hazardous material transport.",
                        "Aftermarket telematics platforms — Companies building connected vehicle software for existing fleets.",
                        "EV ecosystem players — Battery tech companies, charging infrastructure, EV SaaS platforms.",
                        "Shared mobility — Ride-hailing, gig platforms, subscription mobility services."
                    ]
                },
                {
                    type: "action-block",
                    title: "AIS140 — The India fast-track trigger",
                    content: "Every commercial vehicle must have a GPS device that sends real-time tracking data. Any company operating commercial fleets that is not yet compliant needs a solution fast. Condense handles the full data pipeline from device ingestion to delivery."
                },
                {
                    type: "quote",
                    content: "At 50,000 connected vehicles sending data every 10 seconds, that is over 5 million data points per minute. Most existing stacks were not built for that load. Condense was."
                }
            ]
        ],
        quiz: []
    },
    {
        id: "ch-3",
        title: "Mission 3",
        subtitle: "How to Sell Condense",
        vibeColor: "#3b1f5e",
        content: [
            {
                type: "paragraph",
                content: "Every great Condense sales conversation follows the same flow. Learn this and use it every time."
            }
        ],
        pages: [
            [
                {
                    type: "list",
                    title: "The 5-step conversation flow:",
                    content: [
                        "Step 1 — Start with their vehicles or devices, not your product. \"How many connected assets are you managing today and what does that number look like in 18 months?\" This question anchors the conversation in their business growth, not your technology.",
                        "Step 2 — Find the hidden cost. \"When your team needs to add a new data source or device type, how long does that take from decision to production?\" If weeks or months — that is your proof point. Condense can bring it down to hours.",
                        "Step 3 — Surface the compliance angle. \"Do you have any data residency or localization requirements for your vehicle or device data?\" Almost every enterprise in mobility answers yes. BYOC becomes your strongest card.",
                        "Step 4 — Introduce the platform. Only after you understand their pain, size, and compliance needs. Frame it as completing their Kafka investment, not replacing it.",
                        "Step 5 — Close with a forward question. \"If your team could spend half the time on infrastructure and twice the time on product, what would you build first?\" Let them answer. That answer is your next proposal."
                    ]
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "\"We've already built everything around Confluent.\"",
                    content: "Say: \"Confluent is widely used for managed Kafka. Where teams usually start reconsidering is not because Kafka isn't working — it's because everything built around it grows in complexity. Multiple microservices for transforms, SQL flows for logic, different tools for monitoring. Condense doesn't replace your Kafka investment. It replaces the complexity that grew around it.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Our system scales fine. Why change it?\"",
                    content: "Say: \"If it scales, your foundation is strong. The question is how easy it is to operate and evolve as the platform grows. Even if the system scales technically, teams spend increasing effort debugging, coordinating deployments, and maintaining infrastructure. Condense simplifies that layer so your engineers can focus on building new capabilities.\""
                },
                {
                    type: "deep-dive",
                    title: "\"We have data residency requirements. We can't use a cloud platform.\"",
                    content: "Say: \"That's exactly why BYOC exists. Condense runs entirely inside your cloud — your VPC, your region, your keys. No data ever leaves your environment. Most of our customers came to us specifically because of this requirement.\""
                },
                {
                    type: "deep-dive",
                    title: "\"We'd rather build this ourselves.\"",
                    content: "Say: \"Most teams start there. The question is the opportunity cost. Every engineer-hour spent building streaming infrastructure is an hour not spent on your actual product. Condense gives you a production-grade platform on day one.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Your price is too high.\"",
                    content: "Say: \"Let's look at what you're spending today. Kafka cluster. Processing layer. DevOps time. Cloud egress fees. Oncall hours. Most teams that add this up find Condense is not more expensive — it's often cheaper. And that's before counting the engineering time saved on every new use case.\""
                },
                {
                    type: "deep-dive",
                    title: "\"Confluent is the Kafka company. Why take a risk on someone else?\"",
                    content: "Say: \"Confluent has done a great job around Kafka. Condense builds on the same Kafka foundation. The difference is it simplifies how the entire streaming pipeline is built and operated — and it's backed by Bosch. 25+ enterprises are running it in production today, processing over 4,900 TB of streaming data per year.\""
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Against Confluent",
                    content: "Where it falls short: Manages the Kafka layer but everything around it still requires separate tools. Expensive at high data volumes. Runs on Confluent's cloud — creating data residency problems.\n\nYour line: \"Confluent solves the Kafka management problem. Condense solves the entire streaming stack problem. And it runs inside your cloud, not ours.\""
                },
                {
                    type: "action-block",
                    title: "Against self-managed Kafka",
                    content: "Where it falls short: Everything is the team's responsibility — upgrades, monitoring, scaling, fault tolerance, connector management.\n\nYour line: \"Self-managed Kafka gives maximum control. Condense gives the same control with none of the operational burden.\""
                },
                {
                    type: "action-block",
                    title: "Against AWS MSK",
                    content: "Where it falls short: Only manages the Kafka cluster. Everything above it still needs to be built. Only works on AWS.\n\nYour line: \"MSK is a solid Kafka cluster. Condense is the full platform above it. And it works on any cloud.\""
                },
                {
                    type: "action-block",
                    title: "Against building in-house",
                    content: "Where it falls short: Internal builds take 12 to 18 months to reach production quality, require constant maintenance, and depend on a small number of engineers who built the system.\n\nYour line: \"Building in-house gives you exactly what you need eventually. Condense gives you that today so your team can focus on what actually differentiates your business.\""
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "Never lead with price. Lead with the cost of their current situation. Before sharing any number, help the prospect understand what they are currently spending. Kafka cluster costs. Processing layer. DevOps time. Cloud egress fees. Oncall hours. Delayed feature launches. Most teams have never added this up. When they do, the Condense number looks very different."
                },
                {
                    type: "list",
                    title: "Pricing ranges:",
                    content: [
                        "Free trial — Up to 10 Mbps. No credit card. No commitment. Use this to get technical teams evaluating immediately.",
                        "Small deployments — $60,000 to $100,000 per year",
                        "Growing companies — $100,000 to $200,000 per year",
                        "Large enterprises — $200,000 to $1,500,000 per year"
                    ]
                },
                {
                    type: "action-block",
                    title: "The model",
                    content: "Priced on data throughput — how much data flows through the platform. The customer pays for what they use. Standard contract is 3 years. Available through AWS, GCP, and Azure marketplaces. Many enterprise customers use this to pay with existing cloud credits — reducing effective spend by 20 to 30 percent immediately."
                },
                {
                    type: "quote",
                    content: "\"Do you know the fully-loaded cost of your current streaming stack — infrastructure, engineering time, and the opportunity cost of slower delivery?\""
                }
            ],
            [
                {
                    type: "list",
                    title: "The situations where you will close every time:",
                    content: [
                        "When the engineering team is overwhelmed — Adding a new feature requires touching five systems, coordinating three teams, and a two-week deployment cycle. When a team hears they can do all of that in one platform, the reaction is immediate relief.",
                        "When cloud costs are rising with no clear explanation — Data moving between systems generates fees at every step. Kafka to processing engine. Processing engine to storage. Each hop costs money. Condense removes the hops.",
                        "When a regulation arrives with a deadline — AIS140 in India. GDPR in Europe. Data localization laws with a compliance date. These create urgency no other trigger matches. BYOC is the fastest path to compliance.",
                        "When a fleet is scaling rapidly — Going from 10,000 to 100,000 connected vehicles breaks most architectures. Condense was built for this scale.",
                        "When a key engineer leaves — Nobody wants to maintain what they left behind. A platform that manages itself becomes very attractive very fast.",
                        "When a new product launch is coming — Every time a manufacturer or fleet operator announces a new connected product, new pipelines are being built. This is the perfect moment to show how Condense reduces time from idea to production."
                    ]
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "To be updated with links to demo access, product documentation, sales decks, case study PDFs, and team contacts."
                },
                {
                    type: "action-block",
                    title: "Free trial — Use this to open doors",
                    content: "Use the 30-day free trial link for any technical team that wants to evaluate. Full features. Up to 10 Mbps. No credit card. No commitment."
                },
                {
                    type: "deep-dive",
                    title: "Resources coming soon",
                    content: "Demo access link, product documentation, sales deck PDF, customer case study PDFs, and key team contacts will be added here."
                }
            ]
        ],
        quiz: []
    }
];
