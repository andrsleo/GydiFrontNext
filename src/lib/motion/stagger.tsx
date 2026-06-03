'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GYDI_STAGGER, GYDI_EASING, GYDI_DURATION } from './constants';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function Stagger({ children, className, staggerDelay = GYDI_STAGGER }: StaggerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        visible: {
          transition: { staggerChildren: reducedMotion ? 0 : staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reducedMotion ? {} : { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: GYDI_DURATION, ease: GYDI_EASING },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
