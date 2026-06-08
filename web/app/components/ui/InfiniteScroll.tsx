"use client";
import React, { ReactNode } from "react";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

type Props<T> = {
  url: string;
  pageSize?: number;
  initialPage?: number;
  renderItem: (item: T, index: number) => ReactNode;
  children?: ReactNode;
};

const InfiniteScroll = <T,>({ url, pageSize, initialPage, renderItem, children }: Props<T>) => {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<T>({
    url,
    pageSize,
    initialPage,
  });

  return (
    <>
      {children}
      {items.map((item, i) => renderItem(item, i))}
      {hasMore && <div ref={sentinelRef} className='infinite-scroll__sentinel' aria-hidden />}
      {isLoading && <p className='infinite-scroll__loading'>...</p>}
    </>
  );
};

export default InfiniteScroll;
