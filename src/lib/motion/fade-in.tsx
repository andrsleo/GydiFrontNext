'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GYDI_EASING, GYDI_DURATION } from './constants';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

const directionOffset = {
  up:    { y: 24 },
  down:  { y: -24 },
  left:  { x: 24 },
  right: { x: -24 },
  none:  {},
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance,
}: FadeInProps) {
  const reducedMotion = useReducedMotion();

  const offset = distance
    ? direction === 'up' || direction === 'down'
      ? { y: direction === 'up' ? distance : -distance }
      : { x: direction === 'left' ? distance : -distance }
    : directionOffset[direction];

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? {} : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: reducedMotion ? 0 : GYDI_DURATION,
        delay: reducedMotion ? 0 : delay,
        ease: GYDI_EASING,
      }}
    >
      {children}
    </motion.div>
  );
}
