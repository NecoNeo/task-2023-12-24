import React from 'react';
import Track from './track';

const DraggableSlider: React.FC = () => {
  const startHour = 0;
  const endHour = 23;
  return (
    <div>
      <Track startHour={startHour} endHour={endHour} />
    </div>
  );
};

export default DraggableSlider;
