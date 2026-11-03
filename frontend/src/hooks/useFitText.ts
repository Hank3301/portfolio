import {useLayoutEffect, useRef} from 'react';

export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const PROBE = 100;
    const fit = () => {
      el.style.fontSize = `${PROBE}px`;
      const styles = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const natural = el.offsetWidth;
      if (natural > 0) el.style.fontSize = `${(PROBE * available) / natural}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  return ref;
}