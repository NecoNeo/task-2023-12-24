import React from 'react';

const Track: React.FC<{ startHour: number; endHour: number }> = (props) => {
  const duration = props.endHour >= props.startHour ? props.endHour - props.startHour : 0;
  const availableHours = new Array(duration).fill(0).map((_, i) => props.startHour + i);
  return (
    <div>
      <div>Track</div>
      <div className="float-left">
        {availableHours.map((hour) => (
          <div className="mx-2 inline-block text-xs" key={hour}>
            {hour}:00
          </div>
        ))}
      </div>
    </div>
  );
};

export default Track;
