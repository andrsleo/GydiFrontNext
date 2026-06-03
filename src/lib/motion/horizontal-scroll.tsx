'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValue, useReducedMotion } from 'framer-motion';

interface HorizontalScrollProps {
  children: React.ReactNode;
  panelCount: number;
  className?: string;
}

/**
 * Pins the section and translates children horizontally as the user scrolls.
 * Desktop (≥1024px): sticky + horizontal translate over panelCount×100vh scroll space.
 * Mobile (<1024px): panels stack vertically via CSS — no JS involved.
 *
 * Uses window scrollY + manual offsetTop measurement to avoid framer-motion's
 * useScroll({ target }) offset bug when body has overflow-x: clip.
 */
export function HorizontalScroll({ children, panelCount, className }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();

  const compute = useCallback(() => {
    if (!ref.current) return;
    if (window.innerWidth < 1024 || reducedMotion) {
      x.set(0);
      return;
    }
    const top = ref.current.offsetTop;
    const scrollRange = (panelCount - 1) * window.innerHeight;
    const progress = Math.max(0, Math.min(1, (scrollY.get() - top) / scrollRange));
    x.set(-progress * (panelCount - 1) * window.innerWidth);
  }, [panelCount, reducedMotion, x, scrollY]);

  useEffect(() => {
    compute();
    const unsub = scrollY.on('change', compute);
    window.addEventListener('resize', compute);
    return () => {
      unsub();
      window.removeEventListener('resize', compute);
    };
  }, [compute, scrollY]);

  return (
    <div
      ref={ref}
      className={`hs-outer relative ${className ?? ''}`}
      style={{ height: `${panelCount * 100}vh` }}
    >
      <div className="hs-sticky sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ x, height: '100%' }}
          className="hs-track flex will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function HorizontalPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`hs-panel h-screen w-screen flex-shrink-0 overflow-hidden ${className ?? ''}`}>
      {children}
    </div>
  );
}
