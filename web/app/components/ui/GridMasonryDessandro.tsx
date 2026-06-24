"use client";
import React, { ReactNode } from "react";
import { Masonry } from "react-masonry";

type Props = {
  children: ReactNode;
  gutter?: number;
};

const GridMasonryDessandro = ({ children, gutter = 20 }: Props) => {
  return (
    <Masonry>
      {React.Children.map(children, (child) => (
        <div style={{ padding: gutter / 2, boxSizing: "border-box" }}>
          {child}
        </div>
      ))}
    </Masonry>
  );
};

export default GridMasonryDessandro;
