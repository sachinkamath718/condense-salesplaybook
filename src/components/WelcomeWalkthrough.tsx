import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, BookOpen, BarChart3 } from 'lucide-react';

interface WelcomeProps {
    userName: string;
    onComplete: () => void;
}

const slides = [
    {
        id: "intro",
        title: "Welcome to Condense",
        subtitle: "The Real-Time Data Platform",
        content: "Condense is an AI-first, Kafka-native streaming platform built for the modern era. We help engineering teams build, run, and scale real-time data pipelines effortlessly.",
        icon: <Zap className="w-12 h-12 text-primary" />,
    },
    {
        id: "motivation",
        title: "Your Mission",
        subtitle: "Master the Architecture. Crush Your Quota.",
        content: "This playbook is your ultimate weapon. Learn the technology, understand the pain points, and discover how we solve impossible problems for our customers. You have what it takes to win.",
        icon: <BookOpen className="w-12 h-12 text-accent" />,
    },
    {
        id: "lets-go",
        title: "Ready to Execute?",
        subtitle: "The Opportunity is Massive.",
        content: "The knowledge is here. The market is waiting. Dive in, level up your streaming skills, and let's go build the future of data together.",
        icon: <BarChart3 className="w-12 h-12 text-emerald-400" />,
    }
];

export const WelcomeWalkthrough: React.FC<WelcomeProps> = ({ userName, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < slides.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const slide = slides[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl overflow-hidden p-6">
            {/* Ambient background glows */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="relative z-10 w-full max-w-3xl flex flex-col items-stretch bg-black/40 border border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden">

                {/* Content Side */}
                <div className="w-full p-10 md:p-14 flex flex-col justify-center relative bg-gradient-to-br from-white/5 to-transparent">
                    {/* Step Indicators */}
                    <div className="flex gap-2 mb-12">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === currentStep ? 'w-8 bg-primary shadow-sm' : 'w-4 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col h-full"
                        >
                            <div className="mb-6 inline-flex p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-gray-200">
                                {slide.icon}
                            </div>
                            <h3 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">
                                {slide.title}
                            </h3>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-md">
                                {currentStep === 0 ? `Hello, ${userName.split(' ')[0]}. ` : ''}
                                {slide.subtitle}
                            </h2>
                            <p className="text-lg text-gray-900/70 leading-relaxed max-w-md">
                                {slide.content}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-16 flex items-center justify-between">
                        <motion.button
                            onClick={handleNext}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-gray-900 font-bold tracking-wide shadow-lg hover:bg-primary/90 transition-all ml-auto"
                        >
                            {currentStep === slides.length - 1 ? "Let's Go!" : 'Next'}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};
