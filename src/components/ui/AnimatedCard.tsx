"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  clickable?: boolean;
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  clickable = false,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.02,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }
          : {}
      }
      whileTap={
        clickable
          ? {
              scale: 0.98,
              transition: {
                duration: 0.1,
              },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
} 