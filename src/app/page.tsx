'use client';

import React from 'react';
import AttrForm from './ui/attr-form/attr-form';
import ScheduleItem from './ui/scheduler/schedule-item';
// import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="flex h-full overflow-auto">
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-4 leading-10 font-bold text-gray-800 bg-white">
          Slots
          <br />
        </div>
        <div className="flex-1 bg-white h-full overflow-auto">
          {new Array(4).fill(0).map((_, i) => (
            <ScheduleItem key={i} slotName={String(i)} />
          ))}
        </div>
      </div>
      <div className="w-80 h-full border-solid border border-gray-100">
        <AttrForm />
      </div>
    </div>
  );
};
export default Home;
