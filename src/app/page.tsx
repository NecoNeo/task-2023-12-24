'use client';

import React, { useState } from 'react';
import AttrForm from './ui/attr-form/attr-form';
import ScheduleItem from './ui/scheduler/schedule-item';
// import Image from 'next/image';

const Home: React.FC = () => {
  const [startHour, setStartHour] = useState(3);
  const [endHour, setEndHour] = useState(23);

  const [scheduleItems, setScheduleItems] = useState([
    { startValue: 3, endValue: 6, name: 'ALPHA' },
    { startValue: 5, endValue: 8, name: 'BETA' },
    { startValue: 0, endValue: 0, name: 'GAMMA' },
    { startValue: 0, endValue: 0, name: 'DELTA' },
  ]);

  const cleanAll = () => {
    const shallowCopy = scheduleItems.map((e) => {
      e.startValue = 0;
      e.endValue = 0;
      return e;
    });
    setScheduleItems(shallowCopy);
  };
  return (
    <div className="flex h-full overflow-auto">
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-4 leading-10 font-bold text-gray-800 bg-white">
          Slots
          <br />
        </div>
        <div className="flex-1 bg-white h-full overflow-auto">
          {scheduleItems.map((attrs, i) => (
            <ScheduleItem
              key={i}
              slotName={attrs.name}
              startHour={startHour}
              endHour={endHour}
              startValue={attrs.startValue}
              endValue={attrs.endValue}
              onChange={(start: number, end: number) => {
                const shallowCopy = [...scheduleItems];
                shallowCopy[i].startValue = start;
                shallowCopy[i].endValue = end;
                setScheduleItems(shallowCopy);
              }}
            />
          ))}
        </div>
      </div>
      <div className="w-80 h-full border-solid border border-gray-100">
        <AttrForm
          startHour={startHour}
          endHour={endHour}
          scheduleItems={scheduleItems}
          onChange={(s, e) => {
            setStartHour(s);
            setEndHour(e);
          }}
        >
          <button
            onClick={cleanAll}
            className="pt-0.5 pb-0.5 pl-3 pr-3 text-white text-sm bg-red-600 hover:bg-red-400 rounded-sm"
          >
            CLEAN ALL
          </button>
        </AttrForm>
      </div>
    </div>
  );
};
export default Home;
