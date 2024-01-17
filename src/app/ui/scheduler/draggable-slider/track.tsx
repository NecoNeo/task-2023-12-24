import React, { useEffect, useRef, useState } from 'react';
import { TRACK_LINE_HEIGHT, GRID_WIDTH, GRID_HEIGHT } from '../config';
import { ValueSegment } from './value-segment';

const HourLabel: React.FC<{ pos: 'left' | 'right'; hour: number }> = (props) => {
  const offset = props.pos === 'left' ? 'left-[-1.25rem]' : 'right-[-1.25rem]';
  return (
    <div
      className={`absolute -top-4 ${offset} w-10 bg-white text-gray-800 text-xs text-center`}
      style={{ transform: 'scale(0.8)' }}
    >
      {props.hour}:00
    </div>
  );
};

/** container track for hours */
const Track: React.FC<{
  startHour: number;
  endHour: number;
  startValue: number;
  endValue: number;
  change: (start: number, end: number) => void;
}> = (props) => {
  const duration = props.endHour >= props.startHour ? props.endHour - props.startHour : 0;
  const availableHours = new Array(duration).fill(0).map((_, i) => props.startHour + i);
  const container = useRef<HTMLDivElement>(null);

  const containerXRef = useRef(0);
  const containerYRef = useRef(0);
  const gridsPerRowRef = useRef(0);
  const rowCountRef = useRef(1);

  const [isDragging, setIsDragging] = useState(false);
  const [dropHighlightStart, setDropHighlightStart] = useState(0);
  const [dropHighlightEnd, setDropHighlightEnd] = useState(0);
  const dropHighlightStartRef = useRef(0);
  const dropHighlightEndRef = useRef(0);
  const updateHighlightStart = (v: number) => {
    setDropHighlightStart(v);
    dropHighlightStartRef.current = v;
  };
  const updateHighlightEnd = (v: number) => {
    setDropHighlightEnd(v);
    dropHighlightEndRef.current = v;
  };

  const [startValue, setStartValue] = useState(props.startValue);
  const [endValue, setEndValue] = useState(props.endValue);
  const startValueRef = useRef(props.startValue); // TODO these pair values not properly cleaned, but seems doesn't matter
  const endValueRef = useRef(props.endValue);
  const updateStartVal = (v: number) => {
    setStartValue(v);
    startValueRef.current = v;
  };
  const updateEndVal = (v: number) => {
    setEndValue(v);
    endValueRef.current = v;
  };

  useEffect(() => {
    updateStartVal(props.startValue);
    updateEndVal(props.endValue);
  }, [props.startValue, props.endValue]);

  const alignValue = (v: number) => {
    let output = Math.round(v * 2) / 2;
    if (output < props.startHour) output = props.startHour;
    if (output > props.endHour) output = props.endHour;
    return output;
  };

  const initVal = (sv: number) => {
    if (startValue === 0 && endValue === 0) {
      const ev = sv + 0.5;
      setStartValue(sv);
      setEndValue(ev);
      props.change(sv, ev);
    }
  };

  const changed = () => {
    if (dropHighlightStartRef.current || dropHighlightStartRef.current) {
      const start = alignValue(dropHighlightStartRef.current);
      const end = alignValue(dropHighlightEndRef.current);
      setStartValue(start);
      setEndValue(end);
      dropHighlightStartRef.current = 0;
      dropHighlightEndRef.current = 0;
      props.change(start, end);
    } else {
      const start = alignValue(startValueRef.current);
      const end = alignValue(endValueRef.current);
      setStartValue(start);
      setEndValue(end);
      props.change(start, end);
    }
    setIsDragging(false);
  };

  const calcValWithPageXY = (x: number, y: number, contX: number, contY: number) => {
    let rowIndex = 0;
    for (; rowIndex < rowCountRef.current; rowIndex++) {
      if (y < contY + (rowIndex + 1) * TRACK_LINE_HEIGHT) break;
    }
    return (x - contX) / (GRID_WIDTH - 1) + rowIndex * gridsPerRowRef.current + props.startHour;
  };

  // window RESIZING effect resolving
  const layoutParamInit = () => {
    // TODO reduce calc times when resizing
    containerXRef.current = getElPageX(container.current);
    containerYRef.current = getElPageY(container.current);
    gridsPerRowRef.current = Math.floor((container.current?.offsetWidth || 0) / (GRID_WIDTH - 1));
    rowCountRef.current = Math.ceil(availableHours.length / gridsPerRowRef.current);
  };

  return (
    <div className="p-4">
      <div style={{ lineHeight: `${TRACK_LINE_HEIGHT}px` }} ref={container}>
        {availableHours.map((hour) => (
          <div
            key={hour}
            style={{ height: `${GRID_HEIGHT}px`, width: `${GRID_WIDTH}px` }}
            className="relative inline-block box-border mr-[-1px] w-12 h-12 border-l border-r border-solid border-gray-200"
          >
            <ValueSegment
              hour={hour}
              startValue={startValue}
              endValue={endValue}
              isDragging={isDragging}
              dropHighlightStart={dropHighlightStart}
              dropHighlightEnd={dropHighlightEnd}
              updateStartVal={(x: number, y: number) => {
                const targetStart = calcValWithPageXY(x, y, containerXRef.current, containerYRef.current);
                if (targetStart + 0.5 <= endValue) updateStartVal(targetStart);
              }}
              updateEndVal={(x: number, y: number) => {
                const targetEnd = calcValWithPageXY(x, y, containerXRef.current, containerYRef.current);
                if (targetEnd - 0.5 >= startValue) updateEndVal(targetEnd);
              }}
              updateDropHighlight={(x: number, y: number) => {
                setIsDragging(true);
                const v = calcValWithPageXY(x, y, containerXRef.current, containerYRef.current);
                if (v === null) {
                  updateHighlightStart(0);
                  updateHighlightEnd(0);
                } else {
                  // TODO calc value cache
                  updateHighlightStart(v);
                  updateHighlightEnd(v - startValue + endValue);
                }
              }}
              changeStart={() => {
                layoutParamInit();
              }}
              changed={changed}
            />

            <HourLabel pos={'left'} hour={hour} />
            <HourLabel pos={'right'} hour={hour + 1} />
            <div className="absolute z-10 h-[50%] left-[50%] bottom-0 border-r border-solid border-gray-200"></div>
            <div
              className={`absolute top-0 inline-block w-[50%] h-[100%] ${
                hour < 19 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
              onClick={() => {
                initVal(hour);
              }}
            ></div>
            <div
              className={`absolute top-0 left-[50%] inline-block w-[50%] h-[100%] ${
                hour < 18 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
              onClick={() => {
                initVal(hour + 0.5);
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getElPageY(el: HTMLElement | null): number {
  function getPageY(el: HTMLElement | null): number {
    return el ? el.offsetTop + getElPageY(el.offsetParent as HTMLElement) : 0;
  }
  function getAccumulateScrollOffset(el: HTMLElement | null): number {
    return el ? getAccumulateScrollOffset(el.parentElement as HTMLElement) - el.scrollTop : 0;
  }
  return getPageY(el) + getAccumulateScrollOffset(el);
}

// TODO if scroll-x exist we should calc like getElPageY too
function getElPageX(el: HTMLElement | null): number {
  return el ? el.offsetLeft + getElPageX(el.offsetParent as HTMLElement) : 0;
}

export default Track;
