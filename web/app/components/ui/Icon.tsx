import React from "react";

type Props = {
  name: "close" | "search" | "dl" | null;
};

const Icon = ({ name }: Props) => {
  return (
    <div className='icon'>
      {name === "close" && (
        <svg
          width='28'
          height='28'
          viewBox='0 0 28 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <line
            x1='0.739675'
            y1='0.246653'
            x2='27.7397'
            y2='27.2467'
            stroke='white'
            strokeWidth='1'
          />
          <line
            x1='0.2447'
            y1='27.2467'
            x2='27.2447'
            y2='0.246654'
            stroke='white'
            strokeWidth='1'
          />
        </svg>
      )}
      {name === "search" && (
        <svg
          width='24'
          height='20'
          viewBox='0 0 24 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M16.9506 14.8496L22.6016 18.2816M18.6436 9.59961C18.6436 14.5702 14.6047 18.5996 9.62258 18.5996C4.64041 18.5996 0.601562 14.5702 0.601562 9.59961C0.601562 4.62905 4.64041 0.599609 9.62258 0.599609C14.6047 0.599609 18.6436 4.62905 18.6436 9.59961Z'
            stroke='var(--color-secondary)'
            fill='none'
            strokeWidth='1.2'
            strokeLinecap='round'
          />
        </svg>
      )}
      {name === "dl" && (
        <svg
          fill='#000000'
          height='800px'
          width='800px'
          version='1.1'
          id='Capa_1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          viewBox='0 0 471.2 471.2'
          xmlSpace='preserve'>
          <g>
            <g>
              <path
                d='M457.7,230.15c-7.5,0-13.5,6-13.5,13.5v122.8c0,33.4-27.2,60.5-60.5,60.5H87.5c-33.4,0-60.5-27.2-60.5-60.5v-124.8
			c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v124.8c0,48.3,39.3,87.5,87.5,87.5h296.2c48.3,0,87.5-39.3,87.5-87.5v-122.8
			C471.2,236.25,465.2,230.15,457.7,230.15z'
              />
              <path
                d='M226.1,346.75c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8c5.3-5.3,5.3-13.8,0-19.1c-5.3-5.3-13.8-5.3-19.1,0l-62.7,62.8
			V30.75c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v273.9l-62.8-62.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1
			L226.1,346.75z'
              />
            </g>
          </g>
        </svg>
      )}
    </div>
  );
};

export default Icon;
