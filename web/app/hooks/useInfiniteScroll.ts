import { useCallback, useEffect, useRef, useState } from "react";

type UseInfiniteScrollProps = {
  url: string;
  pageSize?: number;
  initialPage?: number;
};

export function useInfiniteScroll<T = any>({
  url,
  pageSize = 20,
  initialPage = 1,
}: UseInfiniteScrollProps) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const separator = url.includes("?") ? "&" : "?";
      const res = await fetch(`${url}${separator}page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      const newItems: T[] = Array.isArray(data) ? data : (data.items ?? []);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPage((p) => p + 1);
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [url, page, pageSize, isLoading, hasMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, isLoading, hasMore, sentinelRef };
}
