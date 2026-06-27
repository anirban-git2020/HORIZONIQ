"use client";

import { motion } from "framer-motion";

import { DURATION_NORMAL, EASE_PREMIUM } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_NORMAL, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}
