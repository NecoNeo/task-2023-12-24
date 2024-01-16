import React, { useEffect, useRef } from 'react';
import { CtrlPoint } from './ctrl-point';
import { GRID_HEIGHT } from '../config';

/** highlighting activated hours */
const ValueSegment: React.FC<{
  hour: number;
  startValue: number;
  endValue: number;
  updateStartVal: (x: number, y: number) => void;
  updateEndVal: (x: number, y: number) => void;
}> = (props) => {
  const start = props.startValue;
  const end = props.endValue;
  const hourStart = props.hour;
  const hourEnd = props.hour + 1;

  const segmentStart = Math.max(start, hourStart);
  const segmentEnd = Math.min(end, hourEnd);
  const w = segmentEnd - segmentStart < 0 ? 0 : segmentEnd - segmentStart;
  const l = segmentStart - hourStart < 0 ? 0 : segmentStart - hourStart;
  const showLeftCtrlPoint = segmentStart === start && w > 0;
  const showRightCtrlPoint = segmentEnd === end && w > 0;

  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  useEffect(() => {
    const dragHandler = (ev: MouseEvent) => {
      props.updateStartVal(0, 0);
      props.updateEndVal(0, 0);
      console.log('drag seg', ev);
      const el = document.createElement('div');
      el.style.height = `${GRID_HEIGHT}px`;
      el.style.width = '60px';
      el.style.backgroundColor = 'rgb(239 68 68)';
      el.style.position = 'absolute';
      el.style.zIndex = '10000';
      el.style.top = '-1000px';
      el.style.left = '0';
      document.body.appendChild(el);

      const dragMove = (ev: MouseEvent) => {
        // console.log('drag move', ev);
        el.style.top = `${ev.pageY}px`;
        el.style.left = `${ev.pageX}px`;
      };

      const dragOver = (ev: MouseEvent) => {
        console.log('drag seg over', ev.pageX, ev.pageY);
        document.body.removeChild(el);
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragOver);
      };
      window?.addEventListener('mouseup', dragOver);
      window?.addEventListener('mousemove', dragMove);
    };

    // compatible for react strict mode
    if (!initialized.current) {
      const containerEl = container.current;
      containerEl?.addEventListener('mousedown', dragHandler);
      initialized.current = true;

      return () => {
        // compatible for react strict mode
        if (initialized.current) {
          if (containerEl) containerEl.removeEventListener('mousedown', dragHandler);
          initialized.current = false;
        }
      };
    }
  });

  return (
    <div className="absolute top-0 left-[-1px] h-full w-12" ref={container}>
      {showLeftCtrlPoint ? <CtrlPoint type="left" pos={start - hourStart} updateVal={props.updateStartVal} /> : null}
      {showRightCtrlPoint ? <CtrlPoint type="right" pos={end - hourStart} updateVal={props.updateEndVal} /> : null}
      <div
        className="absolute z-30 top-0 h-full bg-red-500"
        style={{ left: `${l * 100}%`, width: `${w * 100}%` }}
      ></div>
    </div>
  );
};

export { ValueSegment };
