import React from 'react';
import Track from './track';

const DraggableSlider: React.FC = () => {
  const startHour = 0;
  const endHour = 23;

  const startValue = 5;
  const endValue = 8;
  return (
    <div>
      <Track startHour={startHour} endHour={endHour} startValue={startValue} endValue={endValue} />
    </div>
  );
};

export default DraggableSlider;
