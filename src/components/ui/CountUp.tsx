"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { formatNumber } from "@/lib/utils";

/** Counts up once when scrolled into view; shows the final value immediately for reduced-motion users. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const { locale } = useI18n();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <p ref={ref} className={className} aria-label={String(value)}>
      {formatNumber(reduce ? value : n, locale)}
    </p>
  );
}
