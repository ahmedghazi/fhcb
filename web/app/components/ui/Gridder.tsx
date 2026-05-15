import React from "react";

type Props = {};

const Gridder = (props: Props) => {
  return (
    <div className='gridder'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-4 gap-gutter'>
          <div data-size='1' className='gridder__item gridder-1'>
            1
          </div>
          <div data-size='2' className='gridder__item gridder-2 col-span-2'>
            2
          </div>
          <div data-size='3' className='gridder__item gridder-3 col-span-3'>
            3
          </div>
          <div data-size='4' className='gridder__item gridder-4 col-span-4'>
            4
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gridder;
