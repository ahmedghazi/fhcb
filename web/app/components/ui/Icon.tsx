import React from "react";

type Props = {
  name: "close" | null;
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
    </div>
  );
};

export default Icon;
