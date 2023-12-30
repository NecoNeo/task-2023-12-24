import React from 'react';

const HourLabel: React.FC<{ pos: 'left' | 'right'; hour: number }> = (props) => {
  const offset = props.pos === 'left' ? 'left-[-1.25rem]' : 'right-[-1.25rem]';
  return (
    <div className={`absolute -top-4 ${offset} w-10 bg-white text-xs text-center`} style={{ transform: 'scale(0.8)' }}>
      {props.hour}:00
    </div>
  );
};

/** highlighting activated hours */
const ValueSegment: React.FC<{ hour: number; startValue: number; endValue: number }> = (props) => {
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
      <div className={`absolute top-0 h-full bg-red-500`} style={{ left: `${l * 100}%`, width: `${w * 100}%` }}></div>
      {showLeftCtrlPoint ? <CtrlPoint type="left" pos={start - hourStart} /> : null}
      {showRightCtrlPoint ? <CtrlPoint type="right" pos={end - hourStart} /> : null}
    </div>
  );
};

/** control points for resizing value range */
const CtrlPoint: React.FC<{ type: 'left' | 'right'; pos: number }> = (props) => {
  return (
    <div
      className="absolute z-50 border-2 border-solid border-red-600 bg-white"
      style={{
        top: '20px',
        left: `calc(${props.pos * 100}% - 5px)`,
        width: '10px',
        height: '10px',
        borderRadius: '5px',
      }}
    ></div>
  );
};

/** container track for hours */
const Track: React.FC<{ startHour: number; endHour: number; startValue: number; endValue: number }> = (props) => {
  const duration = props.endHour >= props.startHour ? props.endHour - props.startHour : 0;
  const availableHours = new Array(duration).fill(0).map((_, i) => props.startHour + i);
  return (
    <div className="p-4">
      <div className="float-left leading-[4rem]">
        {availableHours.map((hour) => (
          <div
            key={hour}
            className="relative inline-block box-border mr-[-1px] w-12 h-12 border-l border-r border-solid border-gray-200"
          >
            <ValueSegment hour={hour} startValue={props.startValue} endValue={props.endValue} />

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
