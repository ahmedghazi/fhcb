"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import {
  ExhibitionExpanded,
  ProductExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardType from "./cards/CardType";

type GridItem = ExhibitionExpanded | ProductExpanded;

function useColumnCount() {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => setColumnCount(media.matches ? 1 : 4);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return columnCount;
}

const splitIntoColumns = <T,>(items: T[], columnCount: number) =>
  Array.from({ length: columnCount }, (_, columnIndex) =>
    items.filter((_, itemIndex) => itemIndex % columnCount === columnIndex),
  );

type Props = {
  items: GridItem[];
};

export function GridMasonryColumns({ items }: Props) {
  const columnCount = useColumnCount();
  const columns = splitIntoColumns(items, columnCount);

  return (
    <div
      className='grid-masonry-columns'
      style={{ "--columns": columnCount } as CSSProperties}>
      {columns.map((column, columnIndex) => (
        <div className='exhibitionGrid__column' key={columnIndex}>
          {column.map((item) => (
            <CardType key={item._id} input={item} context='grid' />
          ))}
        </div>
      ))}
    </div>
  );
}
