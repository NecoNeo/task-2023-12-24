import React from 'react';
import Image from 'next/image';
import DraggableSlider from './draggable-slider/draggable-slider';

/**
 * Parent scheduler component which contains a draggable slider implemented
 */
const ScheduleItem: React.FC<{
  /** display name of the schedule item */
  slotName: string;
  /** int value setting start hour of the track */
  startHour: number;
  /** int value setting end hour of the track */
  endHour: number;
  /** user picked range start */
  startValue: number;
  /** user picked range end */
  endValue: number;
  onChange?: (startValue: number, endValue: number) => void;
}> = (props) => {
  return (
    <div className="m-2 border border-solid border-gray-100 bg-white">
      <div className="py-2 bg-gray-50">
        <div className="inline-block px-4 font-medium font-sans text-xs from-neutral-800 border-r border-solid border-gray-200">
          Schedule - {props.slotName}
        </div>
      </div>

      <div className="flex p-6">
        <div className="pr-2">
          <Image
            className="p-6 bg-gray-100 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/vercel.svg"
            alt="IMG"
            width={180}
            height={37}
            priority
          />
        </div>
        <div className="flex-1 select-none">
          <DraggableSlider
            startHour={props.startHour}
            endHour={props.endHour}
            startValue={props.startValue}
            endValue={props.endValue}
            onChange={props.onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;
