import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

// Mock framer-motion — all motion components render as plain divs
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, key) =>
        ({ children, style: _s, animate: _a, initial: _i, whileHover: _w, transition: _t, viewport: _v, ...props }: any) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          require('react').createElement(key as any, props, children),
    }
  ),
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_v: unknown, _from: unknown, to: number[] | string[]) => ({ get: () => to[0] }),
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'es',
    isLoading: false,
  }),
}));

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/lib/motion', () => ({
  FadeIn: ({ children }: any) => <div>{children}</div>,
  Stagger: ({ children }: any) => <div>{children}</div>,
  StaggerItem: ({ children }: any) => <div>{children}</div>,
  ParallaxLayer: ({ children }: any) => <div>{children}</div>,
  RevealText: ({ children, as: Tag = 'div' }: any) => <Tag>{children}</Tag>,
  MagneticButton: ({ children }: any) => <div>{children}</div>,
  CountUp: ({ to, suffix = '', className }: any) => <span className={className}>{to}{suffix}</span>,
  HorizontalScroll: ({ children }: any) => <div>{children}</div>,
  HorizontalPanel: ({ children }: any) => <div>{children}</div>,
  GYDI_SPRING: {},
}));

import HomePage from '../page';

describe('HomePage', () => {
  it('renders the UGC creators section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('creators-section')).toBeInTheDocument();
  });

  it('renders the video hero section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('hero-video')).toBeInTheDocument();
  });

  it('renders Creator Stay, Affiliate, and UGC Indie cards', () => {
    render(<HomePage />);
    expect(screen.getByTestId('creator-stay-card')).toBeInTheDocument();
    expect(screen.getByTestId('affiliate-card')).toBeInTheDocument();
    expect(screen.getByTestId('ugc-indie-card')).toBeInTheDocument();
  });
});
