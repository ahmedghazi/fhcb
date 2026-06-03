import clsx from "clsx";
import React from "react";

type Props = {};

const Gridder = (props: Props) => {
  const grids = [3, 4, 12];
  return (
    <div className='gridder'>
      <div className='container-fluid'>
        {grids.map((grid, i) => (
          <div
            key={i}
            className={clsx("grid gap-gutter", `md:grid-cols-${grid}`)}>
            {[...Array(grid).keys()].map((cell, i) => (
              <div
                key={i}
                data-size={`${cell + 1}_${grid}`}
                className={clsx(
                  "gridder__item",
                  `gridder-${cell + 1}_${grid}`,
                  `col-span-${cell + 1}`,
                )}>
                {cell + 1}
              </div>
            ))}
          </div>
        ))}
        {/* <div className='grid md:grid-cols-4 gap-gutter'>
          <div data-size='1_4' className='gridder__item gridder-1_4'>
            1
          </div>
          <div data-size='2_4' className='gridder__item gridder-2_4 col-span-2'>
            2
          </div>
          <div data-size='3_4' className='gridder__item gridder-3_4 col-span-3'>
            3
          </div>
          <div data-size='4_4' className='gridder__item gridder-4_4 col-span-4'>
            4
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-gutter'>
          <div data-size='1_3' className='gridder__item gridder-1_3'>
            1
          </div>
          <div data-size='2_3' className='gridder__item gridder-2_3 col-span-2'>
            2
          </div>
          <div data-size='3_3' className='gridder__item gridder-3_3 col-span-3'>
            3
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Gridder;
