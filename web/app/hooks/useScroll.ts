import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function useScroll() {
  // const [lastScrollTop, setLastScrollTop] = useState(0)
  const EmptySSRRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  const pathname = usePathname();
  const [bodyOffset, setBodyOffset] = useState<any>(EmptySSRRect);
  const [scrollY, setScrollY] = useState<number>(bodyOffset.top);
  const [scrollX, setScrollX] = useState<number>(bodyOffset.left);
  const [isBelowViewPort, setIsBelowViewPort] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<string>("");
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const bottomThreshold: number = 100;
  // let _prevScrollTop = 0
  const lastScrollTopRef = useRef<number>(0);
  const lastScrollTop: number = lastScrollTopRef.current;
  const isNavigatingRef = useRef<boolean>(false);

  const listener = () => {
    if (isNavigatingRef.current) return;
    setBodyOffset(
      typeof window === "undefined" || !window.document
        ? EmptySSRRect
        : document.body.getBoundingClientRect(),
    );
    setScrollY(-bodyOffset.top);
    setScrollX(bodyOffset.left);
    if (bodyOffset.top < -77) {
      setScrollDirection(lastScrollTop > -bodyOffset.top ? "down" : "up");
    } else {
      setScrollDirection("");
    }
    // lastScrollTopRef.current = -bodyOffset.top
    // console.log(window.scrollY, window.innerHeight)
    setIsBelowViewPort(window.scrollY > 50);
    const distanceToBottom =
      document.body.scrollHeight - (window.innerHeight + window.scrollY);
    setIsBottom(distanceToBottom <= bottomThreshold);
    // _prevScrollTop = window.pageYOffset
    lastScrollTopRef.current = -bodyOffset.top;
  };

  useEffect(() => {
    isNavigatingRef.current = true;
    setScrollDirection("");
    lastScrollTopRef.current = 0;
    const t = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return {
    scrollY,
    scrollX,
    scrollDirection,
    isBottom,
    isBelowViewPort,
  };
}
