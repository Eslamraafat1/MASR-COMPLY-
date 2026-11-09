"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Route-change transition: a short fade/slide. Disabled automatically for reduced-motion users. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
