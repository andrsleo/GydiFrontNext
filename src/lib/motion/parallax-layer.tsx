'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  /** 0.1 = subtle, 0.35 = standard, 0.5 = strong. Positive = scrolls slower (background effect). */
  speed?: number;
}

export function ParallaxLayer({ children, className, speed = 0.2 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : speed * 120],
  );

  return (
    <div ref={ref} className={className} style={{ position: 'relative' }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
