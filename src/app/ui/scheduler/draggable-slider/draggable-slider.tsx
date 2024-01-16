import React, { useEffect, useState } from 'react';
import Track from './track';

/**
 * Draggable Slider Component
 *
 * a draggable interactive component design which display a track of period
 */
const DraggableSlider: React.FC = () => {
  const startHour = 0;
  const endHour = 23;

  const [startValue, setStartValue] = useState(5);
  const [endValue, setEndValue] = useState(8);

  useEffect(() => {
    // DO NOTHING
  });

  const valueChange = (start: number, end: number) => {
    setStartValue(start);
    setEndValue(end);
  };

  return (
    <div>
      <Track startHour={startHour} endHour={endHour} startValue={startValue} endValue={endValue} change={valueChange} />
    </div>
  );
};

export default DraggableSlider;
