import React from 'react';

/** display scheduler attributes right in the page */
const AttrForm: React.FC = () => {
  return (
    <div className="h-full p-4 bg-white">
      <div className="h-20 leading-20 py-2 font-bold text-gray-800">Attributes</div>
      <div>
        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">name</label>
          <div>Scheduler</div>
        </div>

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">start hour</label>
          <div>
            <input
              type="text"
              className="box-border p-0.5 w-[10rem] rounded-md border-solid border border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:border-2 focus:outline-0"
            />
          </div>
        </div>

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">end hour</label>
          <div>
            <input
              type="text"
              className="box-border p-0.5 w-[10rem] rounded-md border-solid border border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:border-2 focus:outline-0"
            />
          </div>
        </div>

        <div className="flex h-10">
          <label className="block w-24 text-sm leading-6 text-gray-800">description</label>
          <div className="px-2 w-[14rem] text-sm text-gray-400 font-light">
            demo with draggable slider component implemented.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttrForm;
