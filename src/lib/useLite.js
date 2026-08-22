import { useEffect, useState } from "react";

/**
 * Returns true when heavy *decorative* motion should be suppressed:
 *  - the user prefers reduced motion, OR
 *  - the viewport is small/mobile (where continuous animation causes the most
 *    jank and battery drain).
 *
 * Essential, one-shot entrance animations may still run; this only gates the
 * expensive always-on decorative effects (marquees, parallax, etc.).
 */
export function useReducedMotionOrMobile() {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 768px)"
    );
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return lite;
}
