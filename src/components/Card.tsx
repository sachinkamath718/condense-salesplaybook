import { cn } from "../lib/utils";
import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delay?: number;
}

export const Card = ({ children, className, delay = 0, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
            className={cn(
                "glass rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:boder-white/20 transition-all duration-500",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
