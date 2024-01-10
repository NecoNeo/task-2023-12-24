import { useState } from 'react';

/** drawing frame throttle for mouse event */
export function useAnimationFrame(): (cb: () => void) => void {
  const [frame, setFrame] = useState<number | null>(null);

  const nextFrame = (cb: () => void) => {
    if (frame !== null) window.cancelAnimationFrame(frame);
    setFrame(
      window.requestAnimationFrame(() => {
        cb();
        setFrame(null);
      }),
    );
  };

  return nextFrame;
}
