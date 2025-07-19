import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

export function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
} 