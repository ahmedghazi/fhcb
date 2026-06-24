"use client";
import React, { ReactNode } from "react";
import { Masonry } from "react-masonry";

type Props = {
  children: ReactNode;
  gutter?: number;
};

const GridMasonryDessandro = ({ children, gutter = 2.25 }: Props) => {
  return (
    <div className='grid-masonry-dessandro'>
      <Masonry>
        {React.Children.map(children, (child) => (
          <div
            className='grid-item'
            // style={{ padding: `0 ${gutter / 2}rem`, boxSizing: "border-box" }}
          >
            {child}
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default GridMasonryDessandro;
