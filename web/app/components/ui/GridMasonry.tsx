"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Masonry from "react-masonry-css";

type Props = {
  children: ReactNode;
  columns: number;
};

const GridMasonry = ({ children, columns }: Props) => {
  const breakpointColumnsObj = {
    default: columns,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className='my-masonry-grid'
      columnClassName='my-masonry-grid_column'>
      {children}
    </Masonry>
  );
};

export default GridMasonry;
