import React, { useEffect, useRef } from 'react';
import { CtrlPoint } from './ctrl-point';
import { GRID_HEIGHT, GRID_WIDTH } from '../config';

/** highlighting activated hours */
const ValueSegment: React.FC<{
  hour: number;
  startValue: number;
  endValue: number;
  isDragging: boolean;
  dropHighlightStart: number;
  dropHighlightEnd: number;
  updateStartVal: (x: number, y: number) => void;
  updateEndVal: (x: number, y: number) => void;
  updateDropHighlight: (x: number, y: number) => void;
  changeStart: () => void;
  changed: () => void;
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
    const dragStartHandler = () => {
      const el = createDragTargetEl(GRID_WIDTH * (props.endValue - props.startValue));
      document.body.appendChild(el);
      props.changeStart();

      const dragMove = (ev: MouseEvent) => {
        props.updateDropHighlight(ev.pageX, ev.pageY);
        el.style.top = `${ev.pageY}px`;
        el.style.left = `${ev.pageX}px`;
      };
      const dragEnd = (ev: MouseEvent) => {
        props.updateDropHighlight(ev.pageX, ev.pageY);
        props.changed();
        document.body.removeChild(el);
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
      };
      window.addEventListener('mousemove', dragMove);
      window.addEventListener('mouseup', dragEnd);
    };

    // compatible for react strict mode
    if (!initialized.current) {
      const containerEl = container.current;
      containerEl?.addEventListener('mousedown', dragStartHandler);
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
    <div className="absolute top-0 left-[-1px] h-full w-12" ref={container}>
      {showLeftCtrlPoint && !props.isDragging ? (
        <CtrlPoint
          type="left"
          pos={start - hourStart}
          updateVal={props.updateStartVal}
          changeStart={props.changeStart}
          changed={props.changed}
        />
      ) : null}
      {showRightCtrlPoint && !props.isDragging ? (
        <CtrlPoint
          type="right"
          pos={end - hourStart}
          updateVal={props.updateEndVal}
          changeStart={props.changeStart}
          changed={props.changed}
        />
      ) : null}
      {props.isDragging ? null : (
        <div
          className="absolute z-30 top-0 h-full bg-red-500"
          style={{ left: `${l * 100}%`, width: `${w * 100}%` }}
        ></div>
      )}

      {/* handle drop feature target area highlight */}
      {props.isDragging && hourStart >= props.dropHighlightStart && hourStart <= props.dropHighlightEnd ? (
        <div className="absolute z-20 top-0 left-0 h-full bg-red-300" style={{ width: '50%' }}></div>
      ) : null}
      {props.isDragging && hourStart + 0.5 >= props.dropHighlightStart && hourStart + 0.5 <= props.dropHighlightEnd ? (
        <div className="absolute z-20 top-0 left-[50%] h-full bg-red-300" style={{ width: '50%' }}></div>
      ) : null}
    </div>
  );
};

function createDragTargetEl(width: number): HTMLDivElement {
  const el = document.createElement('div');
  el.style.height = `${GRID_HEIGHT}px`;
  el.style.width = `${width}px`;
  el.style.backgroundColor = 'rgb(239 68 68)';
  el.style.position = 'absolute';
  el.style.zIndex = '10000';
  el.style.top = '-1000px';
  el.style.left = '0';
  return el;
}

export { ValueSegment };
