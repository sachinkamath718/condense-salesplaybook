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


export const fullPlaybookData: Chapter[] = [];
