import React, { useEffect, useRef } from 'react';
import { useAnimationFrame } from '../animation';

/** control points for resizing value range */
const CtrlPoint: React.FC<{ type: 'left' | 'right'; pos: number; updateVal: (x: number, y: number) => void }> = (
  props,
) => {
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const nextFrame = useAnimationFrame();
  useEffect(() => {
    const dragHandler = (ev: DragEvent) => {
      if (ev.pageX || ev.pageY) {
        nextFrame(() => {
          props.updateVal(ev.pageX, ev.pageY);
        });
      }
    };

    // compatible for react strict mode
    if (!initialized.current) {
      container.current?.addEventListener('mousedown', (ev) => {
        ev.stopPropagation();
      });
      container.current?.addEventListener('drag', dragHandler);
      initialized.current = true;

      return () => {
        // compatible for react strict mode
        if (initialized.current) {
          initialized.current = false;
        }
      };
    }
  });

  return (
    <div
      className="absolute z-50"
      ref={container}
      style={{ width: '24px', height: '24px', top: '12px', left: `calc(${props.pos * 100}% - 12px)` }}
      draggable
    >
      <div
        className="absolute z-40 border-2 border-solid border-red-600 bg-white"
        style={{
          top: '7px',
          left: '7px',
          width: '10px',
          height: '10px',
          borderRadius: '5px',
        }}
      ></div>
    </div>
  );
};

export { CtrlPoint };
