import React, { useEffect, useState } from 'react';
import Track from './track';

/**
 * Draggable Slider Component
 *
 * a draggable interactive component design which display a track of period
 */
const DraggableSlider: React.FC<{
  startHour: number;
  endHour: number;
  startValue: number;
  endValue: number;
  onChange?: (startValue: number, endValue: number) => void;
}> = (props) => {
  const [startValue, setStartValue] = useState(props.startValue);
  const [endValue, setEndValue] = useState(props.endValue);

  useEffect(() => {
    setStartValue(props.startValue);
    setEndValue(props.endValue);
    // TODO we should check whether the start/end values still fall in validate range when start/end hour is changed
  }, [props.startHour, props.endHour, props.startValue, props.endValue]);

  const valueChange = (start: number, end: number) => {
    setStartValue(start);
    setEndValue(end);
    if (props.onChange) {
      props.onChange(start, end);
    }
  };

  return (
    <div>
      <Track
        startHour={props.startHour}
        endHour={props.endHour}
        startValue={startValue}
        endValue={endValue}
        change={valueChange}
      />
    </div>
  );
};

export default DraggableSlider;
