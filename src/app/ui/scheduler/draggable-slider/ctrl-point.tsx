import React, { useEffect, useRef } from 'react';
import { useAnimationFrame } from '../animation';

/** control points for resizing value range */
const CtrlPoint: React.FC<{
  type: 'left' | 'right';
  pos: number;
  updateVal: (x: number, y: number) => void;
  change: () => void;
}> = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const nextFrame = useAnimationFrame();
  useEffect(() => {
    const dragStartHandler = (ev: MouseEvent) => {
      ev.stopPropagation();

      const dragMoveHandler = (ev: MouseEvent) => {
        if (ev.pageX || ev.pageY) {
          nextFrame(() => {
            props.updateVal(ev.pageX, ev.pageY);
          });
        }
      };
      const dragEndHandler = () => {
        props.change();
        window.removeEventListener('mousemove', dragMoveHandler);
        window.removeEventListener('mouseup', dragEndHandler);
      };
      window.addEventListener('mousemove', dragMoveHandler);
      window.addEventListener('mouseup', dragEndHandler);
    };

    // compatible for react strict mode
    if (!initialized.current) {
      const containerEl = container.current;
      container.current?.addEventListener('mousedown', dragStartHandler);
      initialized.current = true;

      return () => {
        // compatible for react strict mode
        if (initialized.current) {
          if (containerEl) containerEl.removeEventListener('mousedown', dragStartHandler);
          initialized.current = false;
        }
      };
    }
  });

  return (
    <div
      className="absolute z-50 cursor-e-resize"
      ref={container}
      style={{ width: '24px', height: '24px', top: '12px', left: `calc(${props.pos * 100}% - 12px)` }}
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
