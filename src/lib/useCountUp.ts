import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target:   number;
  duration: number; // ms
  start:    boolean; // trigger — only count when visible
}

export function useCountUp({ target, duration, start }: UseCountUpOptions) {
  const [count, setCount]   = useState(0);
  const frameRef            = useRef<number>(0);

  useEffect(() => {
    if (!start || target === 0) return;

    const startTime  = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuart — fast start, slow end. Feels satisfying.
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + (target - startValue) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target); // ensure we land exactly on target
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return count;
}