'use client';

import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  to,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [isInView, to, duration, count, reducedMotion]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
