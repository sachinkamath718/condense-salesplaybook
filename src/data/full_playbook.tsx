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
    { term: "ETL", definition: "Extract, Transform, Load: Data integration process." }
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
        id: "ch-0",
        title: "Introduction",
        subtitle: "What is Condense?",
        vibeColor: "#0f172a", // zinc-900
        content: [
            {
                type: "paragraph",
                content: "Condense is an AI-first, Kafka-native streaming platform that helps teams build, run, and scale real-time data pipelines inside their own cloud (BYOC). It eliminates the \"microservice sprawl\" typical of modern streaming architectures by unifying ingestion, transformation, processing, and delivery into a single, clean system. While most organizations agree that event-driven architectures are superior to traditional batch processing, the reality of implementing them at scale is fraught with operational hurdles."
            },
            {
                type: "paragraph",
                content: "Consider the typical evolution of a data platform. It begins with a single use case: perhaps replicating database changes via CDC (Change Data Capture) or streaming clickstream analytics. A small cluster is spun up, a few producers and consumers are written, and it works perfectly. However, success breeds complexity. As more teams realize the value of real-time insights, the number of topics, partitions, and custom microservices explodes exponentially. What was once an elegant event bus rapidly devolves into an unmanageable web of interdependent services, each requiring its own CI/CD pipelines, scaling policies, and observability stacks."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Condense is an AI-first, Kafka-native streaming platform that helps teams build, run, and scale real-time data pipelines inside their own cloud (BYOC). It eliminates the \"microservice sprawl\" typical of modern streaming architectures by unifying ingestion, transformation, processing, and delivery into a single, clean system. While most organizations agree that event-driven architectures are superior to traditional batch processing, the reality of implementing them at scale is fraught with operational hurdles."
                },
                {
                    type: "paragraph",
                    content: "Consider the typical evolution of a data platform. It begins with a single use case: perhaps replicating database changes via CDC (Change Data Capture) or streaming clickstream analytics. A small cluster is spun up, a few producers and consumers are written, and it works perfectly. However, success breeds complexity. As more teams realize the value of real-time insights, the number of topics, partitions, and custom microservices explodes exponentially. What was once an elegant event bus rapidly devolves into an unmanageable web of interdependent services, each requiring its own CI/CD pipelines, scaling policies, and observability stacks."
                }
            ]
        ],
        quiz: [
            {
                question: "What does BYOC stand for in the Condense platform?",
                options: ["Build Your Own Cloud", "Bring Your Own Cloud", "Buy Your Own Cloud", "Boost Your Own Cloud"],
                correctAnswerIndex: 1,
                explanation: "Easy: BYOC means software runs in your account for security."
            },
            {
                question: "Which operational hurdle does Condense primarily eliminate?",
                options: ["Microservice sprawl", "Cloud provider fees", "Developer hiring", "Hardware failures"],
                correctAnswerIndex: 0,
                explanation: "Medium: We unify the logic tier to stop 'microservice sprawl'."
            },
            {
                question: "Why does successful data streaming lead to complexity?",
                options: ["Too many topics", "High storage cost", "Explosion of services", "Slow internet"],
                correctAnswerIndex: 2,
                explanation: "Medium: Success leads to more custom microservices for every rule."
            },
            {
                question: "What is the strategic choice between BIT and SIT for enterprises?",
                options: ["Stitch-it-Together", "Build-it-Today", "Buy-it-Together", "Share-it-Totally"],
                correctAnswerIndex: 2,
                explanation: "Hard: Buying a unified platform (BIT) allows for focused business growth."
            },
            {
                question: "What does it mean for Condense to be 'Kafka-native'?",
                options: ["Uses own protocol", "Direct Kafka compatibility", "Only runs on Java", "Requires custom hardware"],
                correctAnswerIndex: 1,
                explanation: "Hard: We speak standard Kafka, ensuring no translation lag."
            }
        ]
    },
    {
        id: "ch-1",
        title: "Section 1",
        subtitle: "Cloud-Native Streaming Architecture Today",
        vibeColor: "#1e1b4b", // indigo-950
        content: [
            {
                type: "action-block",
                title: "The Reality Check",
                content: "Most enterprises are drowning in fragmented real-time infrastructure. They string together five different tools just to move data from point A to point B. It's expensive, brittle, and exhausting."
            },
            {
                type: "paragraph",
                content: "Modern real-time architectures across AWS, Azure, and GCP are built by stitching together many cloud services, compute functions (Lambda / Azure Functions / Cloud Functions), cloud streaming services (Kinesis / Event Hubs / Pub/Sub), object storage, custom micro-services, and Kafka."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "TL;DR - The Fragmented Landscape",
                    content: "Modern architectures are built by stitching together diverse cloud services, resulting in complex, fragile, and expensive systems that are difficult to manage and scale."
                },
                {
                    type: "paragraph",
                    content: "Most enterprises today use managed Kafka services such as AWS MSK, Confluent Cloud, or Aiven. While these eliminate broker management, they do not solve the end-to-end challenges of building and maintaining real-time pipelines."
                },
                {
                    type: "list",
                    title: "Signs of Fragmentation",
                    content: [
                        "Multiple independent pipelines (live, periodic, alerts, ETL)",
                        "SQL/KSQL-based transformation chains",
                        "Custom micro-services for every business rule",
                        "Duplicate data flows across cloud services",
                        "Fragmented observability and manual scaling",
                        "Unpredictable cost and latency"
                    ]
                }
            ],
            [
                {
                    type: "paragraph",
                    title: "Layer 1 & 2: Ingestion & Core Streaming",
                    content: "Complexity accumulates as new use cases and requirements are added, evolving from simple patterns into multi-layered architectures with significant operational overhead."
                },
                {
                    type: "list",
                    title: "1. Ingestion Layer",
                    content: [
                        "Kinesis (AWS), Event Hubs (Azure), Pub/Sub (GCP)",
                        "Acts as the entry point, delivering events reliably.",
                        "Does NOT apply business logic, enrichment, or routing."
                    ]
                },
                {
                    type: "list",
                    title: "2. Core Streaming Layer (Kafka)",
                    content: [
                        "Backbone of almost all real-time systems (AWS MSK, Confluent, Redpanda).",
                        "Provides durability, ordering, and high throughput.",
                        "Does NOT manage transformations, business rules, or delivery orchestration."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "3. Processing Layer: Microservice Sprawl",
                    content: [
                        "Custom microservices handle live processing, alerts, ETL, and archival.",
                        "Each service requires its own compute, scaling policy, and failure handling.",
                        "Leads to 'microservice sprawl'—dozens of isolated services to maintain."
                    ]
                },
                {
                    type: "list",
                    title: "4. Transformation Layer: SQL/KSQL Graphs",
                    content: [
                        "Handles conditional filtering, windowing, and simple aggregations.",
                        "At scale, these become tightly coupled and fragile.",
                        "Changes can ripple across dependent queries, making them hard to debug."
                    ]
                },
                {
                    type: "quote",
                    content: "SQL pipelines often become the most dangerous part of the architecture because changes ripple across dependent queries."
                }
            ],
            [
                {
                    type: "list",
                    title: "5. Storage Layer: Multiple Pathways",
                    content: [
                        "Data persisted in S3, relational databases, and caches.",
                        "Creates pathways where data is duplicated and transformations run repeatedly.",
                        "Storage is often the hidden driver of both latency and cost."
                    ]
                },
                {
                    type: "list",
                    title: "6. Application Layer: Fragile Dependencies",
                    content: [
                        "APIs and Dashboards consume data from multiple upstream sources.",
                        "Any instability in the real-time pipeline directly affects customer-facing functionality."
                    ]
                },
                {
                    type: "action-block",
                    title: "Impact",
                    content: "The accumulation of isolated silos makes systems progressively harder to modify and resistant to change."
                }
            ],
            [
                {
                    type: "list",
                    title: "Why This Fails at Scale",
                    content: [
                        "Fragmented Pipelines: No single system governs the entire pipeline.",
                        "Redundant Data Movement: Each 'hop' in the data path adds cost and latency.",
                        "Maintenance Overhead: System grows faster than teams can manage.",
                        "Observability Silos: Troubleshooting requires navigating multiple disjointed tools.",
                        "Scaling Silos: Components scale separately, requiring deep SRE involvement."
                    ]
                },
                {
                    type: "paragraph",
                    content: "By the time an enterprise reaches multiple use cases, the architecture becomes complex, costly, fragile, and opaque. Knowledge is locked in specialists and owners."
                }
            ],
            [
                {
                    type: "quote",
                    content: "Condense consolidates this fragmented ecosystem into a single, modular, cloud-native platform running inside the customer's cloud boundary."
                },
                {
                    type: "list",
                    title: "Uncovering Customer Complexity (Questionnaire)",
                    content: [
                        "What is your approximate event or data volume today?",
                        "Which streaming service (MSK, Confluent, etc.) are you using?",
                        "How many systems or devices send data into your platform?",
                        "Are new use cases coming faster than the platform can support?",
                        "How critical is latency for customer-facing features?",
                        "What matters more this year: cost control or faster feature rollout?"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Which layer deliver events reliably but lacks business logic?",
                options: ["Kafka Layer", "Ingestion Layer", "Processing Layer", "Storage Layer"],
                correctAnswerIndex: 1,
                explanation: "Easy: Ingestion tools like Kinesis move data but don't 'think'."
            },
            {
                question: "What is the primary danger of SQL-based streaming at scale?",
                options: ["Slow queries", "High RAM use", "Fragile rippling changes", "No security"],
                correctAnswerIndex: 2,
                explanation: "Medium: A minor field change can break dozen downstream jobs."
            },
            {
                question: "How does 'Redundant Data Movement' impact a mobility platform?",
                options: ["More security", "Cumulative latency", "Better backups", "Easy scaling"],
                correctAnswerIndex: 1,
                explanation: "Medium: Every 'hop' adds cost and latency."
            },
            {
                question: "What is a major sign of 'Microservice Sprawl'?",
                options: ["Low CPU use", "High cloud bill", "Deployment dependency", "Too many SQL users"],
                correctAnswerIndex: 2,
                explanation: "Hard: Simple changes requiring multiple siloed teams to coordinate."
            },
            {
                question: "Why is fragmented observability a problem for SRE teams?",
                options: ["Higher costs", "Multiple tool tabs", "Lower throughput", "Insecure links"],
                correctAnswerIndex: 1,
                explanation: "Hard: Troubleshooting requires navigating disjointed, siloed tools."
            }
        ]
    },
    {
        id: "ch-2",
        title: "Section 2",
        subtitle: "Why Real-Time Architectures Become Challenging Over Time",
        vibeColor: "#311024", // rose-950
        content: [
            {
                type: "paragraph",
                content: "Real-time architectures face mounting pressure from 7 natural forces as they evolve from simple pipelines to complex enterprise ecosystems. These forces—ranging from mismatched execution tempos and scattered state to fractured observability—create operational friction, increase latency, and slow down innovation."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Real-time systems evolve under dynamic conditions: inconsistent data bursts, shifting SLAs, and growing consumers. As these accumulate, the architecture experiences pressure from several natural forces."
                },
                {
                    type: "list",
                    content: [
                        "Force 1: Continuous Workloads vs. Bursty Systems. Kafka flows continuously, but Cloud Functions burst and SQL engines are query-driven, creating mismatched tempos.",
                        "Force 2: Scattered Memory. State (windows, aggregates) is distributed across Kafka topics, SQL tables, and caches, leading to consistency challenges.",
                        "Force 3: Logic Sprawl. As use cases grow, logic spreads across SQL, microservices, and functions, increasing maintenance surface area."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    content: [
                        "Force 4: Accumulated Latency. Each hop in a multi-step pipeline adds processing time, retry overhead, and I/O costs, leading to cumulative delay.",
                        "Force 5: Misaligned Scaling Signals. Components scale by different signals (Kafka by partitions, microservices by CPU), causing downstream backpressure when one layer spikes.",
                        "Force 6: Fractured Observability. RCA requires cross-team collaboration as metrics spread across disjointed tools (Broker metrics, logs, SQL diagnostics).",
                        "Force 7: Intricate Dependencies. A small logic change can ripple through SQL flows, microservices, and storage outputs, making change management high-risk."
                    ]
                },
                {
                    type: "quote",
                    content: "Every enterprise reaches a point where these forces combine into higher operational load, slower delivery cycles, and multiple versions of truth. Condense fits here by reducing the friction created by these natural forces."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "The Architect's Questionnaire",
                    content: "Use these questions to identify where natural forces are causing friction in a prospect's environment:"
                },
                {
                    type: "list",
                    content: [
                        "Workload: 'When you have a traffic burst, does the ingestion layer break or do downstream consumers lag?' (Force 1)",
                        "State: 'Do you pay for idle compute just to be safe, or does your auto-scaling actually catch up in time?' (Force 5)",
                        "Scaling: 'Your Kafka scales by partitions, but your microservices scale by CPU. Do you see lag even when servers look healthy?' (Force 5)",
                        "Observability: 'When data is missing, how many browser tabs (CloudWatch, Datadog, etc.) do you open to find the root cause?' (Force 6)",
                        "Change: 'If you need to change an alert threshold, is it a simple config or a full code deployment and restart?' (Force 7)"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Force 1: Why is there a 'Tempo Mismatch'?",
                options: ["Kafka is query-driven", "Cloud Functions are continuous", "Kafka flows, Functions burst", "Both are query-driven"],
                correctAnswerIndex: 2,
                explanation: "Easy: Continuous Kafka flows vs bursty Functions creates a mismatch."
            },
            {
                question: "Force 5: Why is scaling on CPU alone risky?",
                options: ["Memory is too cheap", "Lag can grow while CPU is low", "CPU metrics are fake", "It slows down Kafka"],
                correctAnswerIndex: 1,
                explanation: "Medium: CPU might be low while partition lag grows exponentially."
            },
            {
                question: "Force 6: What is a major result of fractured observability?",
                options: ["Higher MTTR", "Faster debugging", "Cheaper licenses", "Better security"],
                correctAnswerIndex: 0,
                explanation: "Medium: Navigating multiple tabs increases the 'time to repair'."
            },
            {
                question: "Force 7: What does 'intricate dependencies' make difficult?",
                options: ["Scaling servers", "Adding more data", "Changing business rules", "Buying cloud space"],
                correctAnswerIndex: 2,
                explanation: "Hard: A small field change can ripple and break complex logic."
            },
            {
                question: "How is 'Accumulated Latency' (Force 4) calculated?",
                options: ["Sum of all 'hops'", "Broker disk speed", "Public internet lag", "CPU cycle count"],
                correctAnswerIndex: 0,
                explanation: "Hard: It is the total delay across the entire multi-step pipeline."
            }
        ]
    },
    {
        id: "ch-3",
        title: "Section 3",
        subtitle: "Where Condense Fits and What It Actually Brings",
        vibeColor: "#022c22", // teal-950
        content: [
            {
                type: "paragraph",
                content: "Condense is a Kafka-native, AI-first streaming platform that runs inside the customer’s cloud. It does three things at once: Removes pipeline sprawl, speeds development with no-code blocks and Git workflows, and reduces ops effort with fully managed Kafka inside their boundary."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Condense is a Kafka-native, AI-first streaming platform that runs inside the customer’s cloud. It provides a single platform for building and running real-time data pipelines, consolidating ingestion, transforms, state, and routing into a single processing plane. Instead of assembling multiple services, tools, and microservices, Condense offers one integrated execution environment."
                },
                {
                    type: "action-block",
                    title: "The Three Pillars of Condense",
                    content: "1. Removes pipeline sprawl by consolidating functions into a single plane.\n2. Speeds development with no-code/low-code blocks plus an IDE and Git workflows.\n3. Reduces ops effort with fully managed Kafka (BYOC or managed), autoscaling, and AI agents."
                },
                {
                    type: "paragraph",
                    content: "Use Condense when the customer wants to keep cloud control, accelerate go-to-market, and lower TCO while retaining their Kafka backbone."
                }
            ],
            [
                {
                    type: "list",
                    title: "Runs Fully Inside the Customer’s Cloud (BYOC)",
                    content: [
                        "Deploys directly into the customer’s cloud account (AWS, Azure, or GCP).",
                        "Uses existing networking, IAM, security groups, and governance policies.",
                        "Nothing leaves the environment; Kafka remains inside the customer’s VPC/VNet.",
                        "Result: Full control, data residency, and reduced compliance overhead."
                    ]
                },
                {
                    type: "list",
                    title: "Managed Kafka Without Losing Ownership",
                    content: [
                        "Handles provisioning, scaling, upgrades, balancing, and failover.",
                        "The cluster remains in the customer's network, but the operational burden is removed.",
                        "Allows teams to use Kafka confidently without dedicating specialized SRE resources."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "A Unified Execution Engine for Real-Time Logic",
                    content: [
                        "Replaces fragmented processing paths with a single runtime.",
                        "Supports enrichments, filters, splits, joins, windows, aggregations, and pattern checks.",
                        "Consistent compute model aligned with Kafka partitions for predictable performance.",
                        "Reduces the number of services and microservices to maintain."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Intelligent Tip: The 'Single Motion' Pitch",
                    content: "When talking to architects, emphasize that Condense turns 'deployment' into a single motion. Instead of provisioning a connector, then a function, then a topic, they define the pipeline and Condense handles the underlying infrastructure glue automatically."
                }
            ],
            [
                {
                    type: "list",
                    title: "No-Code, Low-Code, and Full-Code Development",
                    content: [
                        "1. No-code / low-code blocks for visual transformation and routing.",
                        "2. Low-code compositions for medium-complexity modular logic.",
                        "3. Full-code IDE for complex logic with version control, Git integration, and review/approval workflows."
                    ]
                },
                {
                    type: "action-block",
                    title: "Why This Matters",
                    content: "It democratizes pipeline building. Analysts can build simple flows, while engineers handle the complex logic, all within the same environment and Git-based lifecycle."
                }
            ],
            [
                {
                    type: "list",
                    title: "AI-First: Assistance for Dev & Ops",
                    content: [
                        "AI for Development: Generates logic, assists with custom connectors, validates pipelines, and helps with Git commits.",
                        "AI for Operations: Interprets Kafka behavior, summarizes logs, provides root cause insights, and recommends next steps.",
                        "Teams remain in control; AI simply reduces effort and speeds up the work."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Intelligent Tip: AI as a 'Force Multiplier'",
                    content: "Position the AI agents not as 'replacements' for engineers, but as 'senior advisors' that have read every documentation page and log line, allowing junior engineers to perform at a senior level and seniors to focus on architecture."
                }
            ],
            [
                {
                    type: "list",
                    title: "Infrastructure & Lifecycle Automation",
                    content: [
                        "Prebuilt Connectors: IoT, telemetry, mobility, and cloud-native source/sinks.",
                        "Unified Observability: One view for throughput, lag, resource usage, and errors.",
                        "Autoscaling: Automatically scales Kafka partitions, compute, and storage based on input patterns.",
                        "Standardized Lifecycle: One way to build, deploy, update, version, and observe."
                    ]
                },
                {
                    type: "quote",
                    content: "Condense does not replace what teams know, it simplifies how they apply it. It moves the focus from 'managing infrastructure' to 'delivering data logic'."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "What Condense Replaces (Jobs-to-Be-Done)",
                    content: "Teams move from: Operating Kafka + Managing Microservices + Maintaining SQL Flows + Running Cloud Functions + Handling Routing + Monitoring multiple tools...\n\nTo: ONE managed Kafka + ONE execution engine + ONE place for logic + ONE operational surface."
                }
            ]
        ],
        quiz: [
            {
                question: "Where does Condense run in the BYOC model?",
                options: ["On Zeliot's servers", "In the public data center", "Inside customer's VPC", "On local device"],
                correctAnswerIndex: 2,
                explanation: "Easy: It runs inside the organization's own cloud boundary."
            },
            {
                question: "What is the 'Single Motion' pitch for engineering?",
                options: ["One button deployment", "Declarative pipelines", "Unified Jira boards", "Faster cloud migration"],
                correctAnswerIndex: 1,
                explanation: "Medium: Defining 'Ingest -> Logic -> Delivery' as one unit."
            },
            {
                question: "Why is the AI called a 'Force Multiplier'?",
                options: ["Doubles throughput", "Assists junior engineers", "Scales partitions", "Replaces marketing team"],
                correctAnswerIndex: 1,
                explanation: "Medium: AI helps with ops and coding to speed up humans."
            },
            {
                question: "How does a 'Unified Processing Plane' reduce TCO?",
                options: ["Zero SRE headcount", "Consolidating services", "Free cloud credits", "Smaller Kafka topics"],
                correctAnswerIndex: 1,
                explanation: "Hard: Replacing many microservices with one efficient runtime."
            },
            {
                question: "Why align compute with Kafka partitions?",
                options: ["One server per topic", "Avoid data shuffles", "Meet SOC2 requirements", "Support 10k producers"],
                correctAnswerIndex: 1,
                explanation: "Hard: Local processing ensures predictable, linear scaling."
            }
        ]
    },
    {
        id: "ch-4",
        title: "Section 4",
        subtitle: "Identifying the Ideal Customer",
        vibeColor: "#2e1065", // violet-950
        content: [
            {
                type: "paragraph",
                content: "Condense is best suited for organizations where real-time data is central to the product or operations. Ideal customers are defined by data dependency, architectural complexity, operational load, and growth pressure rather than industry."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "TL;DR - The Ideal Persona",
                    content: "Look for organizations where Kafka is strategic, input diversity is high, and the architecture has become fragmented across multiple cloud services and teams."
                },
                {
                    type: "paragraph",
                    title: "A) The Organization’s Data Reality",
                    content: "Condense adds the most value where data is complex and continuous. Look for three hallmarks:"
                },
                {
                    type: "list",
                    content: [
                        "1. High Input Diversity: Data from mobile apps, vehicles, sensors, and partner APIs leads to inconsistent formats and multiple transformation paths.",
                        "2. Continuous Event Flow: Customers that are 'always-on' (telemetry, logistics, payments) rather than periodic batch systems.",
                        "3. Combined Workloads: Mature systems that require both live transformations and hourly/daily ETL-style pipelines."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "B) Assessing Architecture via 'Public Signals'",
                    content: [
                        "Engineering Blogs: Describing streaming use cases or architecture diagrams.",
                        "Job Descriptions: Referencing Kafka, MSK, Confluent, or event-driven systems.",
                        "Cloud Career Openings: Requiring EKS/AKS/GKE and microservices experience.",
                        "DevOps Postings: Mentioning consumer lag, scaling issues, or manual tuning."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Seller Intelligence: Spotting the 'Stitched' Stack",
                    content: "If you see job postings for 'Kafka SREs' or 'Infrastructure Engineers' specifically for data movement, it's a massive signal that they are struggling with the 'infrastructure glue' that Condense replaces."
                }
            ],
            [
                {
                    type: "list",
                    title: "C) Identifying the Operational Footprint",
                    content: [
                        "Multi-Team Involvement: Does a change require Platform, Backend, and Data engineers to coordinate? (Indicates fragmented ownership).",
                        "Unpredictable Scaling: Do components lag during bursts or demand manual tuning?",
                        "Logic Sprawl: Is logic spread inconsistently across Microservices and SQL/KSQL?",
                        "Fragmentation Cost: Is spend driven by redundant compute and independent silos?"
                    ]
                },
                {
                    type: "paragraph",
                    content: "Multi-team involvement = High coordination overhead. This is a primary driver for Condense adoption."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "D) Maturity Patterns",
                    content: "Pattern 1: Streaming is already strategic (Expanding Kafka/MSK usage).\nPattern 2: Streaming is required but expensive/painful to maintain.\nPattern 3: Use cases are growing faster than engineering bandwidth.\nPattern 4: Hard Compliance or BYOC requirement."
                },
                {
                    type: "deep-dive",
                    title: "Seller Intelligence: Pattern 4 is a 'Fast-Track'",
                    content: "When a customer mentions 'Data cannot leave our VPC' or 'We need BYOC', stop the technical pitch and focus on Security and Governance. This is often an unblockable requirement that Condense is uniquely positioned to solve."
                }
            ],
            [
                {
                    type: "list",
                    title: "E) Obtain Architectural Intel (Focused Questions)",
                    content: [
                        "'How is Kafka provisioned and maintained today?' (Operational investment)",
                        "'How many distinct upstream systems send events?' (Input diversity)",
                        "'What is the turnaround time for a new business rule?' (Change velocity)",
                        "'Which teams are involved when issues occur?' (Coordination load)"
                    ]
                },
                {
                    type: "quote",
                    content: "Future pressure (growth expectations) combined with current operational load creates the strongest value proposition for Condense."
                }
            ],
            [
                {
                    type: "list",
                    title: "F) Proxy Indicators (For Non-Technical Leads)",
                    content: [
                        "Product Behavior: Frequent updates, real-time feedback, or reaction-based features.",
                        "Hiring Patterns: Aggressive hiring for Kafka specialists or Platform Engineers.",
                        "Partner Ecosystem: Integration with many external vendors/APIs.",
                        "Customer Documentation: Language like 'live', 'instant', or 'continuously updated'."
                    ]
                },
                {
                    type: "action-block",
                    title: "Final Qualifying Signal",
                    content: "Does the architecture use AWS/Azure/GCP services elsewhere? If yes, they likely need the centralization Condense provides as soon as their streaming volume hits a critical mass."
                }
            ]
        ],
        quiz: [
            {
                question: "While looking for prospects, you notice an engineering blog describing a transition from a 'monolithic SQL streaming application' to a 'decoupled event processor.' Why is this a strong signal for Condense?",
                options: [
                    "It shows they are moving away from Kafka and might need a new message broker.",
                    "The transition indicates they are suffering from the 'Force 2' (Scattered Memory) and likely need a unified state management layer.",
                    "It means they have more than 100 developers, which is the minimum headcount for a Condense deal.",
                    "Decoupled processors are inherently slower than monolithic ones, requiring Zeliot's optimization."
                ],
                correctAnswerIndex: 1,
                explanation: "Decoupling is healthy but creates fragmented state ('Force 2'). Condense provides the unified plane to manage that state while keeping the architectural benefits of decoupling."
            },
            {
                question: "A prospect mentions that 'data residency is our #1 board-level risk this year.' Which Condense feature is the 'silver bullet' here?",
                options: [
                    "The AI-powered automated log analysis for quick troubleshooting.",
                    "The BYOC (Bring Your Own Cloud) model where data never leaves the customer's perimeter.",
                    "The ability to encrypt data using AES-256 during Kafka ingestion.",
                    "Native integration with multiple third-party identity providers (IDPs)."
                ],
                correctAnswerIndex: 1,
                explanation: "For board-level residency risk, SaaS is often a non-starter. BYOC is the only architecture that satisfies this strict compliance requirement."
            },
            {
                question: "What specific operational pain point is 'Multi-Team Involvement' in a simple pipeline update a proxy for?",
                options: [
                    "High employee engagement and strong cross-functional culture.",
                    "Fragmented ownership and high coordination overhead (infrastructure glue tax).",
                    "A requirement for quarterly security audits by the SRE team.",
                    "The use of multiple programming languages within the same data pipeline."
                ],
                correctAnswerIndex: 1,
                explanation: "If you need a meeting to change a field, you have too much 'glue'. Condense collapses these layers so one engineer can own the change."
            },
            {
                question: "Why should a seller target 'Pattern 2' maturity (Growth faster than bandwidth) over Pattern 1 (Expanding Kafka)?",
                options: [
                    "Pattern 2 targets have a smaller budget and are easier to close quickly.",
                    "Pattern 2 indicates a 'burning platform' where the pain of maintaining the status quo is greater than the cost of a new tool.",
                    "The technical team in Pattern 1 is usually too busy to take meetings.",
                    "Pattern 2 companies are legally required to purchase third-party orchestration tools."
                ],
                correctAnswerIndex: 1,
                explanation: "Bandwidth constraints ARE the pain. If growth outstrips the team's ability to build, they have no choice but to 'Buy' the platform (BIT)."
            },
            {
                question: "How does 'High Input Diversity' (IoT, Partner APIs, Mobile) lead to 'Logic Sprawl'?",
                options: [
                    "Each source requires a unique encryption key, which slows down the Kafka broker.",
                    "Engineers end up writing custom, isolated transformation 'shims' for every new schema, which become impossible to maintain.",
                    "Cloud providers charge 3x for data that originated from an external mobile device.",
                    "It forces the company to use three different versions of the Java SDK."
                ],
                correctAnswerIndex: 1,
                explanation: "Diversity = complexity. Without a unified engine, every new source starts as a 'quick fix' that eventually contributes to an unmanageable sprawl."
            },
            {
                question: "Under the 'BYOC Signal', what is the strategic advantage of aligning with the customer's EDP (Enterprise Discount Program)?",
                options: [
                    "Zeliot gets a percentage of the cloud provider's discount as a kickback.",
                    "It allows Condense to bypass the customer's internal procurement team.",
                    "Infrastructure spend on Condense compute nodes in their VPC counts toward their cloud commitment, making the 'net cost' feel lower.",
                    "Cloud providers provide free technical support for BYOC implementations."
                ],
                correctAnswerIndex: 2,
                explanation: "EDP alignment removes the 'budget' blocker. If they've already committed $5M to AWS, spending it on BYOC nodes is 'free' from their perspective."
            },
            {
                question: "What is the primary indicator of 'Scaling Silos' in a prospect's architecture diagram?",
                options: [
                    "The use of multiple cloud regions (e.g., us-east-1 and eu-central-1).",
                    "Independent autoscaling groups for the ingestion layer and the processing layer that do not communicate.",
                    "A high number of partitions per Kafka topic.",
                    "The inclusion of a third-party caching layer like Redis."
                ],
                correctAnswerIndex: 1,
                explanation: "If layers scale separately (silos), one layer spikes and crushes the other (backpressure). Condense unifies these scaling signals."
            },
            {
                question: "A job posting requires 'Deep knowledge of MSK partitioning and tuning consumer groups.' What does this tell you about their environment?",
                options: [
                    "They are in a highly mature, automated state with no operational toil.",
                    "They are likely over-invested in manual 'infrastructure management' and could benefit from Condense's automation.",
                    "They are planning to migrate away from AWS MSK in the next 12 months.",
                    "The company has a policy of only hiring Senior Staff Engineers."
                ],
                correctAnswerIndex: 1,
                explanation: "MSK tuning is 'toil'. If they are hiring specialized headcount for this, they reached the 'complexity ceiling' where it is hurting their bottom line."
            }
        ]
    },
    {
        id: "ch-5",
        title: "Section 5",
        subtitle: "Market Size",
        vibeColor: "#1e3a8a", // blue-950
        content: [
            {
                type: "paragraph",
                content: "The real-time data market is vast and expanding rapidly. Public estimates place the global streaming and real-time analytics market valuation at approximately $150 billion by 2030. However, defining Condense solely as an 'analytics' tool severely limits our Total Addressable Market (TAM). Condense's opportunity is profoundly larger because it consumes multiple traditional software categories simultaneously: managed Kafka, real-time pipeline orchestration, cloud-native operations platforms, BYOC environments, and AI-first processing suites."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "The real-time data market is vast and expanding rapidly. Public estimates place the global streaming and real-time analytics market valuation at approximately $150 billion by 2030. However, defining Condense solely as an 'analytics' tool severely limits our Total Addressable Market (TAM). Condense's opportunity is profoundly larger because it consumes multiple traditional software categories simultaneously: managed Kafka, real-time pipeline orchestration, cloud-native operations platforms, BYOC environments, and AI-first processing suites."
                },
                {
                    type: "paragraph",
                    content: "According to ENLYFT market analysis, nearly 50,000 companies globally use Apache Kafka across all major industries. A staggering percentage of these organizations successfully manage Kafka broker ingestion, but fail entirely at Layer 2—the processing and transformation phase surrounding the broker."
                }
            ],
            [
                {
                    type: "list",
                    content: [
                        "Layer 1 (Ingestion): Heavily captured by traditional vendors like Kafka, MSK, and Confluent. This is the standard backbone of real-time movement, but it yields the lowest margins.",
                        "Layer 2 (Processing): This is the most complex, expensive, and fragile part of the stack. Condense unifies this entirely with its hybrid low-code/full-code execution engine, capturing massive developer mindshare.",
                        "Layer 3 (Operations): Condense resolves complex unified observability, integrated autoscaling, and controlled GitOps deployments natively, replacing discrete alerting tools."
                    ]
                },
                {
                    type: "chart",
                    content: [
                        { label: "US", value: 33696, percentage: "37%", color: "#10b981" },
                        { label: "India", value: 8196, percentage: "9%", color: "#34d399" },
                        { label: "UK", value: 4553, percentage: "5%", color: "#6ee7b7" },
                        { label: "Germany", value: 3642, percentage: "4%", color: "#a7f3d0" },
                        { label: "Canada", value: 1821, percentage: "2%", color: "#d1fae5" }
                    ],
                    title: "Top Countries using Apache Kafka (by Enlyft)",
                    caption: "Source: enlyft.com (based on 91,072 companies)"
                },
                {
                    type: "paragraph",
                    content: "Therefore, Condense doesn't just sell \"Analytics\". We consolidate an end-to-end multi-layer pipeline opportunity across massive industries (FinTech, Logistics, Media) that are structurally transitioning toward continuous operations, massive IoT telemetry fleets, and demanding AI systems that require uninterrupted, low-latency streaming inputs."
                }
            ]
        ],
        quiz: [
            {
                question: "Which layer is being commoditized by cloud providers?",
                options: ["Layer 1: Broker", "Layer 2: Logic", "Layer 3: UI", "Layer 0: Hardware"],
                correctAnswerIndex: 0,
                explanation: "Easy: Cloud providers give away brokers (MSK) for free."
            },
            {
                question: "What is the 'Infrastructure Glue Tax'?",
                options: ["Cloud storage fee", "Maintenance toil", "Marketing cost", "Legal overhead"],
                correctAnswerIndex: 1,
                explanation: "Medium: Bandwidth wasted on 'piping' instead of building product."
            },
            {
                question: "Why does BYOC open the 'Unsellable' market?",
                options: ["Lower prices", "Faster support", "Data residency laws", "Open source code"],
                correctAnswerIndex: 2,
                explanation: "Medium: Banks and Gov require in-cloud data residency."
            },
            {
                question: "Which tier yields the highest long-term margins?",
                options: ["Broker tier", "Storage tier", "Logic tier", "Network tier"],
                correctAnswerIndex: 2,
                explanation: "Hard: Business logic is sticky and high-value."
            },
            {
                question: "Why is Layer 2 considered the most 'fragile' stack part?",
                options: ["Hardware breaks", "Custom code mess", "Cloud outages", "Slow internet"],
                correctAnswerIndex: 1,
                explanation: "Hard: Manual glue code for every rule is a massive liability."
            }
        ]
    },
    {
        id: "ch-6",
        title: "Section 6",
        subtitle: "How to Sell Condense in Mobility",
        vibeColor: "#4a044e", // fuchsia-950
        content: [
            {
                type: "paragraph",
                content: "The mobility and logistics sector operates on strict temporal constraints. They heavily utilize Kafka for high-frequency telemetry, building Fleet Management Systems (FMS), powering Electric Vehicle (EV) intelligence, and synthesizing ride dynamics for millions of connected cars. A delay in signal processing doesn't just mean a slow dashboard; it can mean missed catastrophic battery failures, non-compliant cold-chain deliveries, or massive routing inefficiencies."
            }
        ],
        pages: [
            [
                {
                    type: "paragraph",
                    content: "Selling into the Mobility sector requires understanding the shift from hardware-centric to software-defined vehicles (SDV). Condense allows mobility leaders to move logic away from fragile microservice meshes and directly into a unified streaming layer inside their own VPC."
                },
                {
                    type: "list",
                    title: "ICP Mind Mapping: The Funnel Strategy",
                    content: [
                        "TOFU (Top of Funnel): Awareness focusing on 'Architectural Sprawl' and 'Cloud Bill Inflation'.",
                        "MOFU (Middle of Funnel): Consideration targeting 'Developer Sprints' and 'Pipeline Fragility'.",
                        "BOFU (Bottom of Funnel): Decision-making based on 'SLA Enforcement' and 'Total Cost of Ownership (TCO)'."
                    ]
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "Not every mobility company uses Kafka the same way. We categorize them into organizational archetypes to tailor our technical value proposition."
                },
                {
                    type: "list",
                    title: "Organizational Archetypes in Mobility",
                    content: [
                        "Digital-First Fleet Management: Widely use Kafka for million-event ingestion (location, fuel, alerts). Need scalable ingestion + processing.",
                        "Vehicle OEMs (EV & ICE): Adopting Kafka to centralize ECU and CAN telemetry streams across global vehicle variants.",
                        "EV Ecosystem / Battery Tech: Using Kafka for charging patterns, SoC curves, and real-time anomaly detection.",
                        "Last-Mile / Micro-Mobility: Industry standard for trip events, delivery status updates, and geofence triggers."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Who They Are – Key Personas",
                    content: [
                        "CTO / CIO: Focused on the big picture—reducing architectural sprawl and operational overhead.",
                        "VP Engineering: Distressed by slow feature delivery and high SRE workload during traffic spikes.",
                        "Chief Architect: Struggling with 'multi-hop' pipelines that are hard to debug and evolve.",
                        "Director of Product: Blocked by engineering dependencies when launching new data-driven features."
                    ]
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "Persona-Specific Pitches",
                    content: [
                        "For the CTO: 'Condense unifies your Kafka-based pipelines into a single platform inside your cloud, reducing sprawl and enabling faster delivery with lower costs.'",
                        "For VP Engineering: 'Condense eliminates pipeline fragmentation so your teams can ship FMS features faster with fewer moving parts and higher agility.'",
                        "For the Chief Architect: 'Consolidate transforms, routing, and workflows into one execution layer, removing microservice and SQL sprawl.'"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Timing Signals: When to Pitch",
                    content: [
                        "New real-time feature demand is increasing (e.g., launching an EV line).",
                        "SRE workload and on-call burnout are rising due to pipeline instability.",
                        "Cloud cost reviews show multi-hop inefficiencies (data moving through too many services).",
                        "Compliance requires in-cloud streaming (BYOC is the winning argument here).",
                        "Microservice count is expanding horizontally without clear governance."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "What NOT To Say (Anti-Patterns)",
                    content: [
                        "DON'T say 'Condense replaces Kafka'. We manage/orchestrate Kafka, we don't kill it.",
                        "DON'T say 'Condense is like Flink/KSQL'. It's a unified runtime, not just a compute engine.",
                        "DON'T say 'Condense is an ETL tool'. ETL implies slow batches; Condense is live, operational infrastructure."
                    ]
                },
                {
                    type: "action-block",
                    title: "Executive Summary",
                    content: "Condense gives mobility leaders a unified real-time platform. We merge Kafka, transforms, and observability into one environment inside their cloud. You reduce operational load, accelerate delivery, and maintain full data control."
                },
                {
                    type: "deep-dive",
                    title: "Pain-Value-Evidence: Mobility",
                    content: [
                        "Pain: FMS is slow / High SRE on-call load. | Value: Condense eliminates pipeline fragmentation. | Evidence: Volvo / CEAT Case study.",
                        "Pain: Logic sprawled across too many microservices. | Value: Consolidate transforms, routing, and workflows into one layer. | Evidence: Reduced multi-hop latency and infra cost by 30-40%."
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "What is the risk of 'SoC Fragmentation' in EV?",
                options: ["Physical connectors", "Disconnected telemetry", "Small Kafka clusters", "Slow internet"],
                correctAnswerIndex: 1,
                explanation: "Easy: Scattered data prevents real-time battery health synthesis."
            },
            {
                question: "Why avoid 'ETL' when pitching to Mobility architects?",
                options: ["Too analytical", "Batch implies 'too late'", "Only uses SQL", "Disliked by Java devs"],
                correctAnswerIndex: 1,
                explanation: "Medium: Mobility is operational. 'Late' data is useless."
            },
            {
                question: "What is a major 'timing signal' for a mobility pitch?",
                options: ["New CEO hire", "Launching EV lines", "Stock price drop", "New logo design"],
                correctAnswerIndex: 1,
                explanation: "Medium: New technology rollouts increase architectural demand."
            },
            {
                question: "Why is BYOC mandatory for global OEMs?",
                options: ["Cheaper servers", "Data sovereignty", "Better UI", "More SRE jobs"],
                correctAnswerIndex: 1,
                explanation: "Hard: Vehicle data is a strategic asset; it cannot leave their VPC."
            },
            {
                question: "How does 'Multi-Hop' hurt fleet managers?",
                options: ["High Jira count", "Accumulated latency", "Bad UI graphics", "High payroll cost"],
                correctAnswerIndex: 1,
                explanation: "Hard: Every hop adds non-deterministic lag and failure points."
            }
        ]
    },
    {
        id: "ch-7",
        title: "Section 7",
        subtitle: "Objection Handling",
        vibeColor: "#7f1d1d", // red-950
        content: [
            {
                type: "paragraph",
                content: "In every sales cycle, objections are inevitable. The most common ones aren't signs of rejection—they're signals that the buyer needs more confidence. This section arms you with exactly what each objection means, the right response, a strong pivot, and a closing ask."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "Objection 1: \"This has to go through Central IT / It's part of our internal policy.\"",
                    content: "What they mean: We cannot adopt anything unless central IT approves it, and we want to avoid internal friction."
                },
                {
                    type: "paragraph",
                    content: "Response: \"That makes complete sense. Condense runs fully inside your cloud and follows the same network, IAM, and governance standards your IT team already enforces. We typically start by sharing our security, architecture, and deployment documentation with central IT so they can validate compatibility upfront.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Would it help if we first get listed as a vendor with central IT? That way, your teams don't carry the evaluation overhead.\"",
                        "Ask: \"Who is the right person in IT for us to begin that process with?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 2: \"This looks like a major investment; the effort and spend will be high.\"",
                    content: "What they mean: We're afraid this requires re-architecture, big-budget approvals, or new infra commitments."
                },
                {
                    type: "paragraph",
                    content: "Response: \"Condense doesn't require any redesign of your existing pipeline. You don't replace Kafka. You don't move to a new environment. You start by shifting a small part of the pipeline onto a unified runtime and evaluate the improvement in delivery speed and operational effort.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Instead of a full rollout, we can focus on one workflow like decoding, enrichment, or alerting and measure the reduction in service count, cost, and maintenance.\"",
                        "Ask: \"Which part of your current pipeline would be the least disruptive place to start?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 3: \"The cost savings you're showing don't move the needle for a company of our size.\"",
                    content: "What they mean: We are a large organisation; pure cost arguments won't land."
                },
                {
                    type: "paragraph",
                    content: "Response: \"That's fair. For large mobility organisations, the biggest value isn't only cloud savings—it's simplification. Reducing dozens of services, removing operational risk, and accelerating vehicle or FMS feature delivery typically creates far more financial impact than infrastructure optimisation alone.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Most of your peers saw value in having fewer moving parts, fewer cross-team dependencies, and faster rollout of customer-facing features.\"",
                        "Ask: \"Would it be useful to model the impact on engineering throughput rather than just cloud cost?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 4: \"Can you reduce pricing further?\"",
                    content: "What they mean: They are testing flexibility or benchmarking against known tools like Confluent or MSK."
                },
                {
                    type: "paragraph",
                    content: "Response: \"Our pricing aligns with the value we unlock in reducing engineering load, microservices, SQL flows, and operational overhead. But we can always explore structure — starting smaller, phasing by volume, or tying pricing to specific workloads.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Let's align on scope first — then we can adjust pricing for a phased or partial rollout.\"",
                        "Ask: \"Which workload do you want to start with so we can right-size the discussion?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 5: \"Our next-year roadmap is full; we aren't looking at this now.\"",
                    content: "What they mean: We are too overloaded to take on new technologies."
                },
                {
                    type: "paragraph",
                    content: "Response: \"I completely understand. Teams already stretched with real-time maintenance usually benefit the most, because Condense removes many of the low-value operational tasks.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Instead of a deployment, we can do a short technical validation or architecture review now so that you're ready when the next planning cycle opens.\"",
                        "Ask: \"Would early evaluation without commitment help you bring this into the next roadmap cycle?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 6: \"We don't have bandwidth to evaluate anything new.\"",
                    content: "What they mean: We're overwhelmed; even a POC feels heavy."
                },
                {
                    type: "paragraph",
                    content: "Response: \"Evaluation doesn't need to be heavy. We handle most of it — we deploy into your cloud, integrate with your Kafka, and use one of your existing workflows to demonstrate improvement. Your team's involvement can be minimal.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Most customers start by giving us one pipeline and a single contact person for reviews.\"",
                        "Ask: \"If we kept your team's time investment to under a few hours, would evaluation be feasible?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 7: \"Budget isn't available this quarter.\"",
                    content: "What they mean: We need to defer decisions without closing the door."
                },
                {
                    type: "paragraph",
                    content: "Response: \"That's absolutely fine. Many teams use the current quarter for validation so that budget allocation becomes easier next cycle.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"We can run discovery and sizing now at no cost, so you can plan cleanly for next quarter.\"",
                        "Ask: \"When should we reconnect to align with your internal budgeting calendar?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Objection 8: \"The timing is not right — maybe next year.\"",
                    content: "What they mean: We don't want to commit until we have clarity on future priorities."
                },
                {
                    type: "paragraph",
                    content: "Response: \"That's completely understandable. Our experience is that the best time to align is just before new planning cycles or before a major rollout of new signals, models, or fleet integrations.\""
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: \"Most mobility organisations see value in starting conversations at the beginning of the half-year, when roadmaps and investments are reviewed.\"",
                        "Ask: \"Is the start of the next half-year the right window for a deeper technical or commercial discussion?\""
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "How to pivot from 'Central IT' policy objections?",
                options: ["Avoid VPC", "Vendor listing", "Pay IT team", "ignore policy"],
                correctAnswerIndex: 1,
                explanation: "Easy: Getting 'listed' makes you an approved toolkit part."
            },
            {
                question: "What is the rebuttal for 'No bandwidth to evaluate'?",
                options: ["Wait 6 months", "Recover bandwidth", "Hire interns", "Call CEO"],
                correctAnswerIndex: 1,
                explanation: "Medium: Condense removes 'toil' to give time back to engineers."
            },
            {
                question: "How to handle 'Pricing too high' during first calls?",
                options: ["20% discount", "Pivot to value", "Call finance", "Stop call"],
                correctAnswerIndex: 1,
                explanation: "Medium: Align on the problem's size before discussing packaging."
            },
            {
                question: "Why is 'Simplification' powerful for large enterprises?",
                options: ["Free credits", "Operational risk", "McKinsey buzzword", "Tax breaks"],
                correctAnswerIndex: 1,
                explanation: "Hard: Risk and agilty are more critical than pennies for big firms."
            },
            {
                question: "What is the pivot for 'We already have MSK'?",
                options: ["MSK is bad", "Broker vs Logic gap", "Buy Confluent", "Exit Kafka"],
                correctAnswerIndex: 1,
                explanation: "Hard: MSK manages brokers; Condense manages the application logic."
            }
        ]
    },
    {
        id: "ch-8",
        title: "Section 8",
        subtitle: "Where Condense Wins & Why Teams Switch",
        vibeColor: "#14532d", // green-950
        content: [
            {
                type: "paragraph",
                content: "Condense wins in environments where real-time pipelines have grown beyond manageable boundaries — where Kafka is the backbone, but everything built around it has become harder to own than the broker itself. This section shows you exactly where Condense wins, why teams switch, and the precise signals that tell you a prospect is ready."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "TL;DR — The Core Win Condition",
                    content: "Condense wins when organizations need cloud control, simpler delivery cycles, lower operational load, and a unified model for real-time logic and operations — all inside their own cloud boundary."
                },
                {
                    type: "paragraph",
                    content: "Teams switch to Condense when they want real-time pipelines to behave predictably, scale uniformly, and be built and operated from one place inside their cloud — without relying on external managed services or a patchwork of microservices and SQL flows."
                },
                {
                    type: "paragraph",
                    content: "Think of it this way: Kafka solved the highway. Condense solves everything that happens on the highway — the traffic routing, the toll systems, the monitoring cameras, and the dispatch center — unified, inside your cloud, under your control."
                }
            ],
            [
                {
                    type: "list",
                    title: "Where Condense Wins — 6 Universal Patterns",
                    content: [
                        "Complexity exceeds what microservices and SQL can handle cleanly — dozens of services doing what one unified layer could do.",
                        "Kafka is the backbone, but everything around Kafka is fragmented — transforms live in Lambda, routing lives in custom code, observability is bolted on.",
                        "SRE and DevOps overhead keeps rising — on-call load grows as the number of moving parts grows.",
                        "Delivery cycles slow down — logic is spread everywhere, so every change requires coordinating multiple teams.",
                        "Compliance or governance pressures mandate data stay inside the cloud boundary — BYOC becomes non-negotiable.",
                        "AI initiatives demand fresh, reliable, low-latency real-time data — and the existing patchwork can't guarantee it."
                    ]
                }
            ],
            [
                {
                    type: "quote",
                    content: "\"Managed Kafka solves the brokers — not the pipelines. Condense addresses the actual complexity.\""
                },
                {
                    type: "paragraph",
                    content: "MSK, Confluent, and Aiven are excellent at keeping Kafka alive. But the moment a team needs transformations, enrichment, routing, or stateful logic — they're on their own. That's where the microservice sprawl begins."
                },
                {
                    type: "list",
                    title: "What Managed Kafka leaves unsolved",
                    content: [
                        "Transformations remain a microservice burden — each new field or rule means a new service.",
                        "SQL flows become brittle — KSQL and Flink queries break under schema evolution.",
                        "Cloud functions proliferate — Lambda, Cloud Run, and Azure Functions multiply to fill gaps.",
                        "Routing and enrichment logic spreads across codebases — no single owner, no single view.",
                        "State is duplicated — multiple systems track the same entity independently.",
                        "Observability is scattered — alerts, metrics, and logs live in 5 different tools.",
                        "On-call load stays high — every outage is a detective story across systems."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Why Teams Switch — The 5 Real Reasons",
                    content: [
                        "They want Kafka + processing + deployment + observability in ONE place — Condense becomes the central real-time execution plane inside their cloud.",
                        "They want predictable cost — Condense's vCPU-hour based costing eliminates the hidden fees from egress, function invocations, and microservice scaling.",
                        "They want cloud control, not external SaaS dependencies — fully managed Kafka runtime inside their cloud matters for security, compliance, and vendor-risk policies.",
                        "They want to accelerate delivery cycles — distributed logic means slow delivery; Condense unifies the pipeline lifecycle and provides industry-specific templates to fast-track GTM.",
                        "They want to power AI initiatives properly — AI models need fresh, reliable, structured data in real-time; Condense is the ingestion and processing layer that delivers it."
                    ]
                },
                {
                    type: "image",
                    content: "/subtle_integration_1773055099880.png",
                    caption: "One unified runtime replaces a fragmented mesh of microservices, SQL engines, and cloud functions."
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Trigger Signals — When a Prospect Is Ready",
                    content: "Listen for these exact phrases. Each one is a buying signal disguised as a complaint."
                },
                {
                    type: "list",
                    title: "High-Confidence Buying Signals",
                    content: [
                        "\"Kafka works, but our team spends too much time maintaining it.\" → They've outgrown managed Kafka alone.",
                        "\"Every new alert takes a sprint or months to build.\" → Logic is too distributed across teams.",
                        "\"Our managed Kafka is too expensive and doesn't let us use our cloud credits.\" → BYOC inside their cloud is the answer.",
                        "\"We have strict data residency or OEM security policies.\" → BYOC compliance is the winning argument.",
                        "\"Our platform needs to scale across fleets, tenants, and regions — fast.\" → They need a unified execution layer, not more microservices."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Why Condense Wins on AI Readiness",
                    content: [
                        "AI models are only as good as the data feeding them. Every recommendation engine, anomaly detector, and predictive system needs a continuous, clean, low-latency stream of structured events.",
                        "Most teams discover that their real-time infrastructure can't reliably deliver this — events are late, duplicated, or inconsistently formatted because the pipeline is fragmented.",
                        "Condense creates the reliable data backbone that AI initiatives actually require — with unified enrichment, deduplication, and routing built into the same execution layer that handles everything else.",
                        "This means prospects investing in AI are also, by definition, prospects who need Condense."
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "What is the 'Highway' in the Condense analogy?",
                options: ["Traffic", "Kafka", "Users", "Internet"],
                correctAnswerIndex: 1,
                explanation: "Easy: Kafka is the path; Condense is the logic."
            },
            {
                question: "When is microservice architecture at its 'limit'?",
                options: ["100+ devs", "Coordinated releases", "Cloud migration", "Language switch"],
                correctAnswerIndex: 1,
                explanation: "Medium: Fragmentation causes friction and slows delivery."
            },
            {
                question: "How does collapsing 'Hops' impact costs?",
                options: ["Flat yearly fee", "Eliminates hidden tax", "Negotiates discounts", "Legal requirement"],
                correctAnswerIndex: 1,
                explanation: "Medium: Stops egress and redundant function fees."
            },
            {
                question: "Why is BYOC essential for global OEMs?",
                options: ["Cheaper SaaS", "Data sovereignty", "5G support", "More SREs"],
                correctAnswerIndex: 1,
                explanation: "Hard: Sensitive vehicle data must stay in their VPC."
            },
            {
                question: "Why does Condense win on 'AI Readiness'?",
                options: ["Deterministic enrichment", "Free engineers", "Python only", "Cloud storage"],
                correctAnswerIndex: 0,
                explanation: "Hard: Stitched pipelines can't guarantee clean AI inputs."
            }
        ]
    },
    {
        id: "ch-9",
        title: "Section 9",
        subtitle: "Competitive Positioning",
        vibeColor: "#064e3b", // emerald-950
        content: [
            {
                type: "paragraph",
                content: "Every competitive conversation is a positioning opportunity. For each vendor a prospect names, there is a clear, honest answer that shows why Condense delivers more — not just at the broker layer, but across the entire real-time architecture."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "vs. Confluent — \"We already use Confluent.\"",
                    content: "Confluent is a strong managed Kafka offering. Customers adopt Condense to replace Confluent because Condense delivers the same Kafka compatibility inside your own cloud at a much lower cost and with a unified processing layer on top."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: You keep full Kafka semantics, but you eliminate external SaaS dependency, reduce TCO, and simplify your entire pipeline.",
                        "Ask: \"Would you like us to model the savings and simplification for your current Confluent usage?\""
                    ]
                },
                {
                    type: "action-block",
                    title: "vs. AWS MSK — \"We already use AWS MSK.\"",
                    content: "MSK removes broker operations, but the cost grows quickly as workloads expand. Condense replaces MSK with a fully managed Kafka that runs inside your cloud, giving you predictable performance, lower cost, and a unified environment for transforms, routing, and operations."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: Most MSK customers switch when they see that Condense reduces both infrastructure cost and the number of services required around it.",
                        "Ask: \"Would it help to compare your current MSK cost and maintenance with an equivalent Condense-managed cluster?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "vs. Redpanda — \"We are evaluating Redpanda.\"",
                    content: "Redpanda focuses on replacing the Kafka broker. Condense replaces the broker AND the surrounding microservices, SQL flows, and serverless pipelines. When customers need cost efficiency plus simplification of the entire streaming layer, Condense delivers both in one platform."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: If your priority is only broker performance, Redpanda is an option. If the priority is end-to-end simplification and TCO reduction, Condense fits better.",
                        "Ask: \"Are you looking to optimise only the broker, or the full real-time architecture?\""
                    ]
                },
                {
                    type: "action-block",
                    title: "vs. Aiven — \"We use Aiven Kafka.\"",
                    content: "Aiven provides managed Kafka at premium pricing. Condense replaces Aiven with a fully managed Kafka inside your cloud and adds the entire processing and operational layer, reducing both cost and complexity."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: With Condense, you no longer pay SaaS premiums or manage the logic around Kafka in many separate services.",
                        "Ask: \"Would it be useful to review how much of your current spend and effort can be consolidated?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "vs. AutoMQ — \"We are evaluating AutoMQ.\"",
                    content: "AutoMQ reduces broker-level infrastructure cost. Condense replaces the broker entirely with a BYOC-managed Kafka and also consolidates the surrounding transformation and routing layers — resulting in larger overall savings."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: Most organisations find that broker savings alone are small compared to simplifying the entire pipeline.",
                        "Ask: \"Would you like to compare broker-only savings vs full-pipeline savings?\""
                    ]
                },
                {
                    type: "action-block",
                    title: "vs. WarpStream — \"We are considering WarpStream.\"",
                    content: "WarpStream modernises Kafka storage. Condense replaces the entire Kafka layer with a managed cluster in your cloud and also eliminates the microservices, SQL graphs, ETL paths, and operational overhead above it."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: WarpStream optimises storage. Condense optimises the full architecture.",
                        "Ask: \"Are you primarily targeting infra efficiency or reducing overall operational and architectural load?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "vs. Solace — \"We use Solace.\"",
                    content: "Solace excels at messaging and event distribution. Condense replaces your Kafka backbone and provides a unified real-time processing engine — reducing the number of moving parts needed to run event-driven applications."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: Customers that shift from Solace + Kafka to Condense simplify their architecture dramatically.",
                        "Ask: \"What functions are still built outside Solace today that require separate services?\""
                    ]
                },
                {
                    type: "action-block",
                    title: "vs. Quix — \"We are evaluating Quix.\"",
                    content: "Quix is a SaaS streaming platform. Condense replaces both your managed Kafka and your real-time processing layer while keeping everything inside your cloud — which is essential for governance, security, and cost control."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: Teams choose Condense when they want full control of data and infrastructure, not a SaaS dependency.",
                        "Ask: \"Is keeping your streaming platform inside your own cloud a requirement?\""
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "vs. DIY Kafka — \"We run our own Kafka.\"",
                    content: "DIY Kafka gives flexibility but is expensive to operate and scale. Condense replaces DIY Kafka with a fully managed cluster inside your cloud and consolidates all processing into one runtime — dramatically reducing operational effort."
                },
                {
                    type: "list",
                    title: "Pivot & Ask",
                    content: [
                        "Pivot: Most DIY teams adopt Condense to eliminate tuning, scaling, version upgrades, and service sprawl.",
                        "Ask: \"Which parts of your current maintenance cycle take the most time?\""
                    ]
                },
                {
                    type: "deep-dive",
                    title: "The Universal Competitive Differentiator",
                    content: [
                        "Across every competitive comparison, one pattern is constant: every alternative solves the broker. Condense solves the broker AND everything above it.",
                        "Confluent: great broker, expensive SaaS, no unified processing. Condense: same Kafka, inside your cloud, with processing built in.",
                        "MSK / Aiven: managed broker, but transforms, routing, and observability are still your problem. Condense: the full layer, not just the broker.",
                        "Redpanda / AutoMQ / WarpStream: broker performance optimisation. Condense: end-to-end architectural simplification.",
                        "DIY Kafka: maximum flexibility, maximum maintenance cost. Condense: fully managed inside your cloud, zero tuning burden.",
                        "The question to always close with: 'Are you optimising just the broker, or the entire real-time architecture?'"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Pivot for 'already use Confluent' objections?",
                options: ["Better broker tech", "Logic processing gap", "Future acquisition", "Manage their brokers"],
                correctAnswerIndex: 1,
                explanation: "Easy: Confluent sells pipes. We sell the 'brains' on those pipes."
            },
            {
                question: "What is the primary Condense vs Redpanda difference?",
                options: ["C++ vs Java", "Full architecture focus", "Azure vs AWS", "Kafka support"],
                correctAnswerIndex: 1,
                explanation: "Medium: Redpanda optimizes brokers; Condense simplifies the architecture."
            },
            {
                question: "Rebuttal for AutoMQ's cost efficiency?",
                options: ["No support", "Pipeline consolidation savings", "Kubernetes incompatibility", "Free trial"],
                correctAnswerIndex: 1,
                explanation: "Medium: Consolidation saves more than broker-only optimization."
            },
            {
                question: "Why do enterprises reject SaaS for streaming?",
                options: ["Small SaaS teams", "Data residency risks", "Legal protocols", "Hardware preference"],
                correctAnswerIndex: 1,
                explanation: "Hard: Data sovereignty prevents letting telemetry leave the VPC."
            },
            {
                question: "Why ask DIY Kafka users about 'Maintenance'?",
                options: ["Wasted engineering time", "Buy more servers", "Illegal in EU", "Linux version check"],
                correctAnswerIndex: 0,
                explanation: "Hard: Highlights opportunity cost of fixing pipes vs building features."
            }
        ]
    },
    {
        id: "ch-10",
        title: "Section 10",
        subtitle: "Road Map for Condense until Dec 2026",
        vibeColor: "#3b0764", // purple-950
        content: [
            {
                type: "paragraph",
                content: "Condense is moving toward a future where real-time data platforms are not only cloud-native and fully managed inside the customer's boundary, but also AI-driven, self-optimizing, and developer-assistive. The roadmap below outlines the key milestones and capabilities shaping Condense through December 2026."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "AI-First Platform Evolution",
                    content: "Condense is being designed as an AI-first streaming platform, where AI agents assist in development, operations, debugging, monitoring, and pipeline optimization — all natively inside the customer's cloud."
                },
                {
                    type: "list",
                    title: "Kafka Agent",
                    content: [
                        "Creates and updates topics, publishes and reads last messages.",
                        "Fetches metadata, partition details, and consumer lag.",
                        "Retrieves broker credentials and configs — accelerating Kafka operational workflows."
                    ]
                },
                {
                    type: "list",
                    title: "Kubernetes Agent",
                    content: [
                        "Inspects pods, jobs, and services inside the customer's K8s cluster.",
                        "Reads logs of deployed connectors and summarises events and runtime behaviour.",
                        "Enables faster debugging and operational transparency."
                    ]
                },
                {
                    type: "list",
                    title: "Grafana Monitoring Agent",
                    content: [
                        "Interprets alerts generated in Grafana.",
                        "Explains root causes using data from Prometheus and Kubernetes logs.",
                        "Suggests corrective steps — reducing SRE/DevOps effort during incidents."
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Git Agent (GitHub / GitLab)",
                    content: [
                        "Creates and updates repositories, modifies versioned files.",
                        "Assists in generating commit-ready changes.",
                        "Supports GitOps workflows integrated with Condense."
                    ]
                },
                {
                    type: "list",
                    title: "Pipeline Agent",
                    content: [
                        "Creates pipelines from natural-language or idea descriptions.",
                        "Summarises connector behaviour and provides resource utilisation insights.",
                        "Aligns real-time development with an AI-driven design experience."
                    ]
                },
                {
                    type: "list",
                    title: "Developer Agent",
                    content: [
                        "Generates and modifies code for applications and custom connectors.",
                        "Assists with logic creation, improves readability or structure.",
                        "Modifies existing logic safely — helping teams build complex real-time logic faster."
                    ]
                },
                {
                    type: "list",
                    title: "QA Agent",
                    content: [
                        "Creates test suites and scenarios for generated or updated logic.",
                        "Produces test case files, edge-condition scenarios, and data validation templates.",
                        "Completes the development cycle with AI-enabled quality assurance."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Platform Enhancements",
                    content: "Condense continues evolving beyond pipeline consolidation — ensuring operational governance and developer productivity at enterprise scale."
                },
                {
                    type: "list",
                    title: "Kafka ACL, RBAC & Access Control Redesign",
                    content: [
                        "Unified ACL management for topics, groups, and principals.",
                        "Fine-grained RBAC for pipelines, transforms, connectors, and deployment operations.",
                        "Audit visibility for user actions and role templates for enterprise teams.",
                        "Reduces onboarding friction and strengthens compliance across large organisations."
                    ]
                },
                {
                    type: "list",
                    title: "Unified Governance & Observability Control Plane",
                    content: [
                        "Single interface for pipeline lineage, operational state, and Kafka metrics.",
                        "Covers connectors, compute usage, audit logs, and multi-team visibility.",
                        "Becomes the centrepiece for platform teams managing large streaming estates."
                    ]
                },
                {
                    type: "list",
                    title: "Auto-Optimization Engine (AI-Driven)",
                    content: [
                        "Self-adjusts scaling behaviour, resource allocation, and backpressure handling.",
                        "Tunes parallelism and partition alignment automatically.",
                        "Shifts real-time infrastructure towards self-tuning, hands-off operations."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Developer Experience Roadmap (2024–2026)",
                    content: "Condense will increasingly reduce the time required to build real-time logic — from idea to deployed pipeline."
                },
                {
                    type: "list",
                    title: "AI-Assisted IDE Evolution",
                    content: [
                        "Natural-language → pipeline transformations.",
                        "Code refactoring suggestions and impact analysis before deployment.",
                        "Context-aware inline debugging assistance."
                    ]
                },
                {
                    type: "list",
                    title: "Template Packs for Rapid Use-Case Onboarding",
                    content: [
                        "Industry templates for event decoding, enrichment, alerting, data routing, and periodic pipelines.",
                        "Reduces onboarding time for new integrations and use cases significantly."
                    ]
                },
                {
                    type: "list",
                    title: "Expanded Connector Ecosystem",
                    content: [
                        "A broader library of cloud-native, industry, and custom connectors.",
                        "All connectors deployable directly from Condense — no external dependency."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "Try-For-Free Experience — 1-Month Full Access",
                    content: "To accelerate adoption and evaluation, Condense will introduce a 1-month fully functional trial hosted inside the customer's cloud. Full capability, zero commitment."
                },
                {
                    type: "list",
                    title: "What the Trial Includes",
                    content: [
                        "Full Kafka-managed experience inside the customer's own cloud.",
                        "Complete pipeline environment — build, deploy, and operate real workflows end-to-end.",
                        "Access to all AI Agents — Kafka, Kubernetes, Grafana, Git, Pipeline, Developer, and QA.",
                        "Observability and scaling features — full operational visibility from day one.",
                        "A real production-grade environment, not a restricted sandbox."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Why This Roadmap Matters for Sales",
                    content: [
                        "Every item on the Condense roadmap closes a gap that competitors leave open.",
                        "AI agents mean teams can build faster without expanding headcount — a direct argument against DIY complexity.",
                        "The unified governance plane gives compliance-heavy enterprise buyers the audit and access control story they need.",
                        "The Auto-Optimization Engine turns real-time infrastructure from a high-maintenance burden into a self-managing system.",
                        "The free trial removes the biggest adoption barrier — committing to a platform before they've seen it work inside their own cloud.",
                        "Use the roadmap as a value-selling tool: 'Here is where we are going — and every step reduces your operational burden further.'"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Purpose of 'Grafana Monitoring Agent'?",
                options: ["Voice interface", "Interpret alerts", "Aesthetic charts", "Smart watch view"],
                correctAnswerIndex: 1,
                explanation: "Easy: Tells you why a fire started and how to fix it."
            },
            {
                question: "What is the 'Auto-Optimization Engine' result?",
                options: ["New config language", "Self-tuning operations", "More Jira tickets", "Replace all SREs"],
                correctAnswerIndex: 1,
                explanation: "Medium: Removes the need for manual 3 AM scaling interventions."
            },
            {
                question: "What bottleneck does the 'Pipeline Agent' remove?",
                options: ["Forgotten passwords", "Specialist dependency", "Electricity usage", "Website downtime"],
                correctAnswerIndex: 1,
                explanation: "Medium: Product teams can build without waiting for Kafka experts."
            },
            {
                question: "Trial vs SaaS Sandbox difference?",
                options: ["Trial is paid", "Real-world validation", "Hardware setup", "No difference"],
                correctAnswerIndex: 1,
                explanation: "Hard: Trial uses real data and VPC context, not just a sandbox."
            },
            {
                question: "Value of 'Unified ACL & RBAC' redesign?",
                options: ["Delete topics", "Compliance control plane", "Make data public", "Replace VPN"],
                correctAnswerIndex: 1,
                explanation: "Hard: Satisfies enterprise auditors with strict access control."
            }
        ]
    },
    {
        id: "ch-11",
        title: "Section 11",
        subtitle: "Customer Wins and Proof of Value",
        vibeColor: "#422006", // amber-950
        content: [
            {
                type: "paragraph",
                content: "A detailed overview of recent customer wins, showcasing how Condense delivers value across OEMs, FMS providers, and large fleet owners through BYOC Kafka and hardware integration."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "1. Volvo Eicher Commercial Vehicles — OEM",
                    content: "Replaced IBM Event Streams (+ Wabco Device Gateway) with Condense. Direct Hardware Integration, BYOC Kafka on Direct channel. Powers FMS platforms 'MyEicher' and 'Uptime Center'."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "IBM Event Streams had no direct device integration and high managed-service cost.",
                        "Condense: Direct hardware connectors + BYOC Kafka = zero external SaaS dependency.",
                        "Buyer: CIO + Head of Digital Services."
                    ]
                },
                {
                    type: "action-block",
                    title: "2. Volvo Trucks India — OEM",
                    content: "Launched 'Fleet Assist Service' for mining vehicles with Condense as the real-time backend. Direct channel, Azure. Primary value: GTM Acceleration with hardware connectors."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "Hardware connector readiness accelerated time-to-market dramatically.",
                        "Buyer: Head of Digitisation – After Market."
                    ]
                },
                {
                    type: "action-block",
                    title: "3. Ashok Leyland — OEM",
                    content: "Fully Managed Kafka on SaaS. Direct Hardware Integration. Powers FMS 'iAlert' and internal service tools 'ConnectAll'. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "Hardware connector readiness for GTM acceleration.",
                        "Buyer: CIO & CDO + Head of Connected Vehicles."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "4. Swaraj Mazda (via Pragathi Solutions) — OEM",
                    content: "Direct Hardware Integration, BYOC Kafka. Launched FMS solution 'SML Saarthi Pro'. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-ready transforms.",
                        "Buyer: CEO + Head of Marketing and Customer Service."
                    ]
                },
                {
                    type: "action-block",
                    title: "5. Adani Port Operations — Large Fleet Owner",
                    content: "Condense as data backend for all connected assets across Pan India Ports. Developed a control centre to monitor vehicle performance. Channel: GCP. Previous platform: Google Pub/Sub + Amnex device gateway."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "Hardware connector readiness + GCP Marketplace availability.",
                        "Buyer: CIO + Head of Digital & AI."
                    ]
                },
                {
                    type: "action-block",
                    title: "6. Taabi Mobility — FMS Provider",
                    content: "Launched FMS platform 'dtwin.taabi.ai' using Condense as the data streaming backbone. BYOC Kafka on Azure. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-focused transforms on Azure.",
                        "Buyer: CEO + CPO."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "7. Hero Motocorp — OEM",
                    content: "Launching B2B FMS software using Condense as the data backbone. BYOC Kafka on Azure. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: FMS-focused transforms ready to use on Azure.",
                        "Buyer: CIO + Head of Digital."
                    ]
                },
                {
                    type: "action-block",
                    title: "8. Norq Technologies — FMS Provider",
                    content: "Migrating existing FMS from OSS Kafka to Condense. BYOC Kafka, Direct channel. Scaling from 10k to 55k connected assets this year. Previous platform: OSS Kafka."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "Lower TCO vs OSS Kafka — scale from 10k to 55k assets with predictable cost.",
                        "Buyer: CEO + Solution Architect."
                    ]
                },
                {
                    type: "action-block",
                    title: "9. Africa Systems — FMS Provider",
                    content: "Launched new FMS offering 'Lewoo track' using Condense. BYOC Kafka. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-focused transforms.",
                        "Buyer: CEO."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "10. Aztosoftcon — FMS Provider",
                    content: "Launched new FMS offering 'Yellow Bus Track' using Condense for school mobility. BYOC Kafka. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-focused transforms for school fleet.",
                        "Buyer: CEO."
                    ]
                },
                {
                    type: "action-block",
                    title: "11. Log9 Mobility — Fleet Leasing",
                    content: "Needed a battery and asset visibility platform for leased vehicles. BYOC on Azure. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-focused transforms on Azure.",
                        "Buyer: COO + Head of Supply Chain."
                    ]
                },
                {
                    type: "action-block",
                    title: "12. TVS Motors — OEM",
                    content: "Using Condense as the data streaming platform for their connected vehicle platform 'M360'. BYOC Kafka on Azure. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "BYOC Kafka on Azure availability + Lower TCO vs Managed Services.",
                        "Buyer: Head of Digital & AI + Solution Architect."
                    ]
                }
            ],
            [
                {
                    type: "action-block",
                    title: "13. Royal Enfield — OEM",
                    content: "Using Condense as the data streaming platform for their connected bike platform 'CBP'. BYOC Kafka on GCP. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "BYOC Kafka on GCP availability + Lower TCO vs Managed Services.",
                        "Buyer: CIO + Product Manager – Connected Vehicles."
                    ]
                },
                {
                    type: "action-block",
                    title: "14. Michelin — FMS Provider",
                    content: "Launching B2B FMS software using Condense with a focus on 'tyre health analytics'. Fully Managed SaaS Deployment. Direct channel."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "GTM Acceleration: hardware connectors + FMS-focused transforms for tyre analytics.",
                        "Buyer: Head of Aftermarket Business India + FMS Business Head."
                    ]
                },
                {
                    type: "action-block",
                    title: "15. Montra — OEM",
                    content: "Using Condense as the data streaming platform for their connected EV platform. Covers all Montra EV variants: 3Ws, SCVs, Trucks, and Tractors. Starting at ~20,000 vehicles, growing rapidly. Previous platform: Confluent Cloud."
                },
                {
                    type: "list",
                    title: "Why Condense Won",
                    content: [
                        "Fully managed Kafka with complete data streaming platform — replacing Confluent Cloud.",
                        "Buyer: Director of Digital Services."
                    ]
                },
                {
                    type: "deep-dive",
                    title: "Patterns Across All 15 Wins",
                    content: [
                        "BYOC Kafka is a major competitive advantage — customers win on cost AND control.",
                        "Hardware connector availability consistently accelerates GTM for FMS providers and OEMs alike.",
                        "Cost efficiency vs IBM Event Streams, Confluent, MSK, and OSS Kafka is the recurring trigger.",
                        "FMS-ready transforms reduce engineering dependency — faster time-to-revenue.",
                        "Azure and GCP support broaden deal accessibility across cloud-committed customers.",
                        "Large OEMs (Volvo, Ashok Leyland, TVS, Royal Enfield) value operational visibility and simplified scaling.",
                        "Mid-size FMS players (Taabi, Africa Systems, Aztosoftcon) value speed to launch and lower TCO."
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Why did Volvo Eicher replace IBM with Condense?",
                options: ["Cheaper SaaS", "Hardware integration", "Java support", "New UI"],
                correctAnswerIndex: 1,
                explanation: "Easy: Condense talk to devices directly, unlike IBM."
            },
            {
                question: "Hidden ROI for switching from OSS Kafka?",
                options: ["Free SREs", "End engineering toil", "Marketing reports", "Tax credits"],
                correctAnswerIndex: 1,
                explanation: "Medium: OSS is expensive in senior engineering salaries."
            },
            {
                question: "How does Royal Enfield confirm cloud-agnosticism?",
                options: ["Private data center", "Azure and GCP support", "Proprietary cloud", "Shared clusters"],
                correctAnswerIndex: 1,
                explanation: "Medium: Condense brings the same logic to ANY cloud."
            },
            {
                question: "Why replace Confluent at Montra?",
                options: ["Tractor ban", "Variant scaling control", "SaaS preference", "Slow processing"],
                correctAnswerIndex: 1,
                explanation: "Hard: Owning the platform is better for complex fleet variants."
            },
            {
                question: "Which persona drives GTM Acceleration wins?",
                options: ["CISO", "Head of Digital", "Junior Engineer", "Finance Director"],
                correctAnswerIndex: 1,
                explanation: "Hard: Digital leads care about revenue launch speed."
            }
        ]
    },
    {
        id: "ch-12",
        title: "Section 12",
        subtitle: "Pricing Approach",
        vibeColor: "#022c22", // teal-950
        content: [
            {
                type: "paragraph",
                content: "Structured and transparent pricing method designed for enterprise sales teams, partners, and solution consultants."
            },
            {
                type: "paragraph",
                content: "Condense pricing is engineered to be predictable, value-aligned, and easy for customers to understand. Unlike traditional Kafka-based pricing (which often hides costs behind partitions, broker sizing, cluster tiers, or consumption-based billing), Condense pricing is built around customer outcomes and actual platform usage patterns."
            }
        ],
        pages: [
            [
                {
                    type: "action-block",
                    title: "Condense Listed Pricing",
                    content: "Evaluation: $0 Base Condense License Fee. Upto 5760 vCPU hours (typically supports upto 3MBps workloads). Beyond Base Fee: $0.4 / vCPU-hour. Remarks: Mention as Condense license fee. Infra extra.\n\nStandard: $5,000 Base Condense License Fee. Upto 14400 vCPU hours (typically supports upto 10MBps workloads). Beyond Base Fee: $0.86 / vCPU-hour. Remarks: Mention as Condense license fee. Infra extra."
                }
            ],
            [
                {
                    type: "paragraph",
                    content: "How to give pricing estimate:"
                },
                {
                    type: "paragraph",
                    content: "To generate an accurate Condense pricing estimate, you only need five core inputs. These should be collected early, even before a technical deep dive."
                },
                {
                    type: "deep-dive",
                    title: "1. Average Write Throughput (MBps)",
                    content: [
                        "This is the most important sizing input.",
                        "What to collect: Average sustained throughput in MBps, Peak throughput if available, Expected growth (next 6–12 months).",
                        "How to ask: 'On an average day, how much data do your devices or systems push into Kafka?', 'Do you already track throughput in MBps or per-topic volume?', 'Is the traffic stable, or does it spike during certain hours?'"
                    ]
                },
                {
                    type: "deep-dive",
                    title: "2. Retention Requirement (Days)",
                    content: [
                        "Retention drives storage and cluster sizing.",
                        "What to collect: How long real-time topics must be retained, Any compliance-driven retention needs, Whether retention differs across topics.",
                        "How to ask: 'How long do you typically retain data in Kafka for your operational workflows?', 'Is retention driven by compliance, analytics needs, or both?'"
                    ]
                }
            ],
            [
                {
                    type: "deep-dive",
                    title: "3. Fan-Out (Number of Consumers per Topic)",
                    content: [
                        "Fan-out determines downstream load and consumption scaling.",
                        "What to collect: How many systems or teams read from each topic, Whether multiple microservices consume the same stream, Planned additions (e.g., data science, telematics scoring, dashboards).",
                        "How to ask: 'How many applications or services read from your Kafka topics today?', 'Do multiple pipelines reuse the same stream?', 'Any new consumers expected over the next year?'"
                    ]
                },
                {
                    type: "deep-dive",
                    title: "4. Cloud Provider (AWS / Azure / GCP)",
                    content: [
                        "This decides infra assumptions and deployment model.",
                        "What to collect: Primary cloud where workloads run, Whether customer uses multi-cloud, Preference for BYOC or Condense-managed Kafka.",
                        "How to ask: 'Which cloud do your real-time or Kafka workloads run on currently?', 'Do you prefer BYOC inside your own account, or a fully managed deployment?'"
                    ]
                },
                {
                    type: "deep-dive",
                    title: "5. Cloud Region",
                    content: [
                        "Required for infra estimation and latency considerations.",
                        "What to collect: The specific region where deployment should run, Whether they require multi-region HA, Any residency constraints.",
                        "How to ask: 'Which cloud region should the deployment run in?', 'Is this tied to your production footprint or compliance policies?'"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Primary license metric after trial?",
                options: ["S3 storage GB", "Kafka topics", "Active vCPU hours", "User logins"],
                correctAnswerIndex: 2,
                explanation: "Easy: We charge for 'engine' power, not 'distance'."
            },
            {
                question: "Why is 'Fan-Out' critical for sizing?",
                options: ["Meeting invites", "CPU/Security load", "Legacy support", "Consumer fees"],
                correctAnswerIndex: 1,
                explanation: "Medium: More consumers = more replication and security overhead."
            },
            {
                question: "Professional estimate requirements?",
                options: ["Company revenue", "Throughput/Retention/Cloud", "IDE/Java version", "Competitor name"],
                correctAnswerIndex: 1,
                explanation: "Medium: You need the 'river' size and 'traffic' duration."
            },
            {
                question: "Evaluation tier base license fee?",
                options: ["$10,000", "$500", "$0", "$5,000"],
                correctAnswerIndex: 2,
                explanation: "Hard: Lower barriers to entry with zero base fee initially."
            },
            {
                question: "Who pays for BYOC infrastructure?",
                options: ["Condense (SaaS fee)", "Customer (Direct to cloud)", "Partner", "AWS only"],
                correctAnswerIndex: 1,
                explanation: "Hard: Customer keeps their cloud discounts and committed spend."
            }
        ]
    },
    {
        id: "ch-13",
        title: "Section 13",
        subtitle: "Available Resources",
        vibeColor: "#082f49", // emerald-950
        content: [
            {
                type: "paragraph",
                content: "A collection of essential resources, documents, presentations, and calculators to assist in the sales and evaluation process."
            }
        ],
        pages: [
            [
                {
                    type: "list",
                    title: "Product and Guides",
                    content: [
                        "Product Document: https://docs.zeliot.in/",
                        "Blog: https://www.zeliot.in/blog",
                        "Condense Mobility Ebooks: https://www.zeliot.in/data-streaming-resources/ebooks"
                    ]
                },
                {
                    type: "list",
                    title: "Collateral and Presentations",
                    content: [
                        "Condense Feature Flyer: Condense Features Flyer.pdf",
                        "Condense 2 Pager: Condense 2 Pager.pdf",
                        "Condense 3 Pager: Condense Pager 3.pdf",
                        "Condense Deck: Condense deck V2.pdf"
                    ]
                }
            ],
            [
                {
                    type: "list",
                    title: "Competitive Battlecards",
                    content: [
                        "Condense vs Confluent: Condense vs Confluent.pptx",
                        "Condense vs Redpanda: https://www.zeliot.in/how-does-condense-compare-against-redpanda",
                        "Condense vs Aiven: https://www.zeliot.in/how-does-aiven-compare-against-condense",
                        "Condense vs Oss Kafka Pricing: spend-analysis-EU-NA.pdf",
                        "Condense vs OSS Kafka Jobs to be Done: OSS Kafka vs Condense - jobs that a typical data engineer will have to do.pdf"
                    ]
                },
                {
                    type: "list",
                    title: "Tools and Trial",
                    content: [
                        "Pricing Calculator: https://www.zeliot.in/pricing",
                        "Try now Condense experience: https://www.zeliot.in/try-now",
                        "Newsletter: https://www.zeliot.in/data-streaming-newsletter-condense-str"
                    ]
                }
            ]
        ],
        quiz: [
            {
                question: "Deep Architecture source?",
                options: ["Blog", "docs.zeliot.in", "2-pager", "Calculator"],
                correctAnswerIndex: 1,
                explanation: "Easy: Technical truth lives in the documentation portal."
            },
            {
                question: "Best Confluent battle resource?",
                options: ["Flyer", "Battlecards", "Newsletter", "Try Now"],
                correctAnswerIndex: 1,
                explanation: "Medium: Battlecards highlight BYOC wins specifically."
            },
            {
                question: "Fastest skeptic-to-believer tool?",
                options: ["Try Now demo", "Deck V2", "Mobility blog", "Spend analysis"],
                correctAnswerIndex: 0,
                explanation: "Medium: Live 'hands-on-keys' demo proves the value instantly."
            },
            {
                question: "Where is the 'Jobs to be Done' PDF?",
                options: ["Calculator", "Resource list", "Win slide", "Roadmap"],
                correctAnswerIndex: 1,
                explanation: "Hard: Found in the competitive collateral section."
            },
            {
                question: "Purpose of Mobility e-books?",
                options: ["Pricing lookup", "Industry education", "Employee training", "SRE manual"],
                correctAnswerIndex: 1,
                explanation: "Hard: Guides prospects through high-level mobility digital shifts."
            }
        ]
    }
];
