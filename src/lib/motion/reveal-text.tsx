'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GYDI_EASING, GYDI_STAGGER } from './constants';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: HeadingTag;
}

export function RevealText({
  children,
  className,
  delay = 0,
  as: Tag = 'h1',
}: RevealTextProps) {
  const reducedMotion = useReducedMotion();
  const words = children.split(' ');

  const MotionTag = motion[Tag] as typeof motion.h1;

  return (
    <MotionTag
      className={`block w-full ${className ?? ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : GYDI_STAGGER * 0.6,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reducedMotion ? {} : { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.5, ease: GYDI_EASING },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </MotionTag>
  );
}
