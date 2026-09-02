import React from "react";

type Props = {
  name: "close" | "search" | null;
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
    </div>
  );
};

export default Icon;
