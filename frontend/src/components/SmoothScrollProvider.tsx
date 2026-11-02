'use client';

import { useEffect, useRef } from 'react';

// Import Lenis directly from the core package
import Lenis from 'lenis';

interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    const lenis: LenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // smooth: true, // deprecated in newer versions
      // smoothTouch: false, // deprecated
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}