import {useEffect, useRef} from 'react';

export function useReveals<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Mobile: less aggressive rootMargin so elements reveal sooner
    const isMobile = window.innerWidth < 768;
    const rootMargin = isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      {rootMargin},
    );

    const watch = () =>
      root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    watch();

    const mo = new MutationObserver(watch);
    mo.observe(root, {childList: true, subtree: true});

    return () => { mo.disconnect(); io.disconnect(); };
  }, []);

  return ref;
}