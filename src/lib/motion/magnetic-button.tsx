'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { GYDI_SPRING } from './constants';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Magnetic pull strength. 0.3 = subtle, 0.6 = strong. Default 0.35. */
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.35 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={GYDI_SPRING}
    >
      {children}
    </motion.div>
  );
}
