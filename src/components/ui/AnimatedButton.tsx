"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "./button";
import { ButtonProps } from "./button";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  delay?: number;
  scale?: boolean;
}

export function AnimatedButton({
  children,
  delay = 0,
  scale = true,
  className = "",
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      whileHover={
        scale
          ? {
              scale: 1.05,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }
          : {}
      }
      whileTap={
        scale
          ? {
              scale: 0.95,
              transition: {
                duration: 0.1,
              },
            }
          : {}
      }
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
} 