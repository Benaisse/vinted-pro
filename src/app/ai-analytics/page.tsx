'use client'

import { AIAnalytics } from "@/components/AIAnalytics";
import { motion } from "framer-motion";

export default function AIAnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <AIAnalytics />
      </div>
    </motion.div>
  );
} 