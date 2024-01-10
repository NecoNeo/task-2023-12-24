import React, { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../animation';

const HourLabel: React.FC<{ pos: 'left' | 'right'; hour: number }> = (props) => {
  const offset = props.pos === 'left' ? 'left-[-1.25rem]' : 'right-[-1.25rem]';
  return (
    <div className={`absolute -top-4 ${offset} w-10 bg-white text-xs text-center`} style={{ transform: 'scale(0.8)' }}>
      {props.hour}:00
    </div>
  );
};

/** highlighting activated hours */
const ValueSegment: React.FC<{
  hour: number;
  startValue: number;
  endValue: number;
  updateStartVal: (x: number) => void;
  updateEndVal: (x: number) => void;
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

  return (
    <div className="absolute z-30 top-0 left-[-1px] h-full w-12">
      {showLeftCtrlPoint ? <CtrlPoint type="left" pos={start - hourStart} updateVal={props.updateStartVal} /> : null}
      {showRightCtrlPoint ? <CtrlPoint type="right" pos={end - hourStart} updateVal={props.updateEndVal} /> : null}
      <div className={`absolute top-0 h-full bg-red-500`} style={{ left: `${l * 100}%`, width: `${w * 100}%` }}></div>
    </div>
  );
};

/** control points for resizing value range */
const CtrlPoint: React.FC<{ type: 'left' | 'right'; pos: number; updateVal: (x: number) => void }> = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const nextFrame = useAnimationFrame();

  useEffect(() => {
    const dragHandler = (ev: DragEvent) => {
      // console.log('drag', ev.pageX, ev.pageY);
      if (ev.pageX) {
        nextFrame(() => {
          props.updateVal(ev.pageX);
        });
      }
    };

    // compatible for react strict mode
    if (!initialized.current) {
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

function getElPageLeft(el: HTMLElement | null): number {
  if (el) {
    return el.offsetLeft + getElPageLeft(el.offsetParent as HTMLElement);
  } else {
    return 0;
  }
}

/** container track for hours */
const Track: React.FC<{ startHour: number; endHour: number; startValue: number; endValue: number }> = (props) => {
  const duration = props.endHour >= props.startHour ? props.endHour - props.startHour : 0;
  const availableHours = new Array(duration).fill(0).map((_, i) => props.startHour + i);
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const [containerPageLeft, setContainerPageLeft] = useState(0);

  const [startValue, setStartValue] = useState(props.startValue);
  const [endValue, setEndValue] = useState(props.endValue);

  useEffect(() => {
    // window.addEventListener('mousemove', (ev) => {
    //   console.log(ev.pageX);
    // });

    const handler = () => {
      // TODO reduce calc times when resizing
      // console.log('resizing');
      // console.log('left', getElPageLeft(container.current));
      // console.log('width', container.current?.offsetWidth);
      setContainerPageLeft(getElPageLeft(container.current));
    };
    // compatible for react strict mode
    if (!initialized.current && container.current) {
      window.addEventListener('resize', handler);
      handler();
      initialized.current = true;
    }

    return () => {
      // compatible for react strict mode
      if (initialized.current) {
        window.removeEventListener('resize', handler);
        initialized.current = false;
      }
    };
  }, []);

  return (
    <div className="p-4">
      <div className="float-left leading-[4rem]" ref={container}>
        {availableHours.map((hour) => (
          <div
            key={hour}
            className="relative inline-block box-border mr-[-1px] w-12 h-12 border-l border-r border-solid border-gray-200"
          >
            <ValueSegment
              hour={hour}
              startValue={startValue}
              endValue={endValue}
              updateStartVal={(v) => {
                setStartValue((v - containerPageLeft) / 48);
              }}
              updateEndVal={(v) => {
                setEndValue((v - containerPageLeft) / 48);
              }}
            />

            <HourLabel pos={'left'} hour={hour} />
            <HourLabel pos={'right'} hour={hour + 1} />
            <div className="absolute z-10 h-[50%] left-[50%] bottom-0 border-r border-solid border-gray-200"></div>
            <div
              className={`relative inline-block w-[50%] h-[100%] ${
                hour < 19 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
            ></div>
            <div
              className={`relative inline-block w-[50%] h-[100%] ${
                hour < 18 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Track;
