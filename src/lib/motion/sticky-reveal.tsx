'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export interface StickyStage {
  id: string;
  content: React.ReactNode;
}

interface StickyRevealProps {
  stages: StickyStage[];
  className?: string;
  /** Height multiplier per stage. 1.5 = 150vh per stage. Default 1.5 */
  stageHeight?: number;
}

/**
 * Scrollytelling container: sticky viewport height + N stages of content
 * that fade in/out as user scrolls. Apple-style "features" section pattern.
 *
 * Usage:
 * ```tsx
 * <StickyReveal stages={[
 *   { id: 'step1', content: <Step1 /> },
 *   { id: 'step2', content: <Step2 /> },
 * ]} />
 * ```
 */
export function StickyReveal({ stages, className, stageHeight = 1.5 }: StickyRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const totalHeight = `${stages.length * stageHeight * 100}vh`;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: totalHeight, position: 'relative' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {stages.map((stage, i) => (
          <StickyStagePanel
            key={stage.id}
            stage={stage}
            index={i}
            total={stages.length}
            containerRef={containerRef}
            stageHeight={stageHeight}
            reducedMotion={reducedMotion ?? false}
          />
        ))}
      </div>
    </div>
  );
}

interface StagePanelProps {
  stage: StickyStage;
  index: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageHeight: number;
  reducedMotion: boolean;
}

function StickyStagePanel({ stage, index, total, containerRef, stageHeight, reducedMotion }: StagePanelProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const stageStart = index / total;
  const stageEnd = (index + 1) / total;
  const fadeinEnd = stageStart + 0.15 / stageHeight;
  const fadeoutStart = stageEnd - 0.15 / stageHeight;

  const opacity = useTransform(
    scrollYProgress,
    [stageStart, fadeinEnd, fadeoutStart, stageEnd],
    reducedMotion ? [1, 1, 1, index === total - 1 ? 1 : 0] : [0, 1, 1, index === total - 1 ? 1 : 0]
  );

  const y = useTransform(
    scrollYProgress,
    [stageStart, fadeinEnd],
    reducedMotion ? [0, 0] : [40, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [fadeoutStart, stageEnd],
    reducedMotion ? [1, 1] : [1, index === total - 1 ? 1 : 0.95]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y, scale }}
    >
      {stage.content}
    </motion.div>
  );
}
