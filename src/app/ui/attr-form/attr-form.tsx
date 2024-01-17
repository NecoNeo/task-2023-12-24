import React, { PropsWithChildren } from 'react';

type AttrFormProps = {
  startHour: number;
  endHour: number;
  scheduleItems: { name: string; startValue: number; endValue: number }[];
  onChange: (startHour: number, endHour: number) => void;
};

/** display scheduler attributes right in the page */
const AttrForm: React.FC<PropsWithChildren<AttrFormProps>> = (props) => {
  return (
    <div className="h-full p-4 bg-white">
      <div className="h-20 leading-20 py-2 font-bold text-gray-800">Attributes</div>
      <div>
        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">name</label>
          <div className="text-gray-800">Scheduler</div>
        </div>

        {/* // TODO decide whether should LIMIT input NUMBER RANGE or not */}

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">start hour</label>
          <div>
            <input
              type="number"
              className="box-border pt-0.5 pb-0.5 pl-2 w-[10rem] text-gray-800 rounded-md border-solid border border-gray-300 hover:border-indigo-400 focus:border-indigo-600 focus:outline-0"
              value={props.startHour}
              onChange={(ev) => {
                let iVal = Number(ev.target.value);
                iVal = isNaN(iVal) ? 0 : iVal;
                props.onChange(iVal, props.endHour);
              }}
            />
          </div>
        </div>

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">end hour</label>
          <div>
            <input
              type="number"
              className="box-border pt-0.5 pb-0.5 pl-2 w-[10rem] text-gray-800 rounded-md border-solid border border-gray-300 hover:border-indigo-400 focus:border-indigo-600 focus:outline-0"
              value={props.endHour}
              onChange={(ev) => {
                let iVal = Number(ev.target.value);
                iVal = isNaN(iVal) ? 0 : iVal;
                props.onChange(props.startHour, iVal);
              }}
            />
          </div>
        </div>

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">description</label>
          <div className="px-2 w-[14rem] text-sm text-gray-400 font-light">
            demo with draggable slider component implemented.
          </div>
        </div>

        <div className="mt-6 flex h-30">
          <table className="w-full text-xs text-gray-600 border-collapse border-solid border border-gray-100">
            <thead className="border-collapse border-solid border border-gray-100">
              <tr>
                <td>name</td>
                <td>start val</td>
                <td>end val</td>
              </tr>
            </thead>
            <tbody className="border-collapse border-solid border border-gray-100">
              {props.scheduleItems.map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td>{row.startValue}</td>
                  <td>{row.endValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex h-10">{props.children}</div>
      </div>
    </div>
  );
};

export default AttrForm;
