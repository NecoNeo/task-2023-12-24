import React, { useEffect, useRef, useState } from 'react';
import { TRACK_LINE_HEIGHT, GRID_WIDTH, GRID_HEIGHT } from '../config';
import { ValueSegment } from './value-segment';

const HourLabel: React.FC<{ pos: 'left' | 'right'; hour: number }> = (props) => {
  const offset = props.pos === 'left' ? 'left-[-1.25rem]' : 'right-[-1.25rem]';
  return (
    <div className={`absolute -top-4 ${offset} w-10 bg-white text-xs text-center`} style={{ transform: 'scale(0.8)' }}>
      {props.hour}:00
    </div>
  );
};

/** container track for hours */
const Track: React.FC<{ startHour: number; endHour: number; startValue: number; endValue: number }> = (props) => {
  const duration = props.endHour >= props.startHour ? props.endHour - props.startHour : 0;
  const availableHours = new Array(duration).fill(0).map((_, i) => props.startHour + i);
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const [containerX, setContainerX] = useState(0);
  const [containerY, setContainerY] = useState(0);
  const [gridsPerRow, setGridsPerRow] = useState(0);
  const [rows, setRows] = useState(1);

  const [isDragging, setIsDragging] = useState(false);
  const [dropHighlightStart, setDropHighlightStart] = useState<number>(0);
  const [dropHighlightEnd, setDropHighlightEnd] = useState<number>(0);

  const [startValue, setStartValue] = useState(props.startValue);
  const [endValue, setEndValue] = useState(props.endValue);

  const change = () => {
    setDropHighlightStart(0);
    setDropHighlightEnd(0);
    setIsDragging(false);
    // TODO emit change event
  };

  const calcValWithPageXY = (x: number, y: number, contX: number, contY: number) => {
    let rowIndex = 0;
    for (; rowIndex < rows; rowIndex++) {
      if (y < contY + (rowIndex + 1) * TRACK_LINE_HEIGHT) break;
    }
    return (x - contX) / (GRID_WIDTH - 1) + rowIndex * gridsPerRow;
  };
  // input x,y must be totally fit in container box
  const calcValWithPageXYStrict = (x: number, y: number, contX: number, contY: number) => {
    let rowIndex = -1;
    for (; rowIndex <= rows; rowIndex++) {
      if (y < contY + (rowIndex + 1) * TRACK_LINE_HEIGHT) break;
    }
    if (rowIndex < 0 || rowIndex >= rows) return null;
    return (x - contX) / (GRID_WIDTH - 1) + rowIndex * gridsPerRow;
  };

  useEffect(() => {
    const handler = () => {
      // TODO reduce calc times when resizing
      setContainerX(getElPageX(container.current));
      setContainerY(getElPageY(container.current));
      const gridsPerRow = Math.floor((container.current?.offsetWidth || 0) / (GRID_WIDTH - 1));
      setGridsPerRow(gridsPerRow);
      setRows(Math.ceil(availableHours.length / gridsPerRow));
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
  }, [availableHours.length]);

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
                if (!containerX && !containerY) return; // 0 value also caused by REACT.STRICT mode in CtrlPoint component
                setStartValue(calcValWithPageXY(x, y, containerX, containerY));
              }}
              updateEndVal={(x: number, y: number) => {
                if (!containerX && !containerY) return; // 0 value also caused by REACT.STRICT mode in CtrlPoint component
                setEndValue(calcValWithPageXY(x, y, containerX, containerY));
              }}
              updateDropHighlight={(x: number, y: number) => {
                setIsDragging(true);
                const v = calcValWithPageXYStrict(x, y, containerX, containerY);
                if (v === null) {
                  setDropHighlightStart(0);
                  setDropHighlightEnd(0);
                } else {
                  setDropHighlightStart(v);
                  setDropHighlightEnd(v - startValue + endValue); // TODO calc value cache
                }
              }}
              change={change}
            />

            <HourLabel pos={'left'} hour={hour} />
            <HourLabel pos={'right'} hour={hour + 1} />
            <div className="absolute z-10 h-[50%] left-[50%] bottom-0 border-r border-solid border-gray-200"></div>
            <div
              className={`absolute top-0 inline-block w-[50%] h-[100%] ${
                hour < 19 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
            ></div>
            <div
              className={`absolute top-0 left-[50%] inline-block w-[50%] h-[100%] ${
                hour < 18 ? 'bg-gray-50' : ''
              } hover:bg-red-300 hover:z-20`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getElPageX(el: HTMLElement | null): number {
  return el ? el.offsetLeft + getElPageX(el.offsetParent as HTMLElement) : 0;
}
function getElPageY(el: HTMLElement | null): number {
  return el ? el.offsetTop + getElPageY(el.offsetParent as HTMLElement) : 0;
}

export default Track;
