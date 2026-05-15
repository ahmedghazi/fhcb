"use client";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { subscribe, unsubscribe } from "pubsub-js";
import { useRef, ReactNode, useEffect } from "react";

interface LenisScrollProviderProps {
  children: ReactNode;
}

const LenisScrollProvider = ({ children }: LenisScrollProviderProps) => {
  const lenisRef = useRef<null>(null);

  const lenis = useLenis((_lenis) => {});

  useEffect(() => {
    const token = subscribe("TOGGLE_SCROLL", (_e: any, on: boolean) => {
      if (on) {
        lenis?.start();
        document.body.style.overflow = "auto";
      } else {
        lenis?.stop();
        document.body.style.overflow = "hidden";
      }
    });
    return () => {
      unsubscribe(token);
    };
  }, [lenis]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
      }}>
      <div>{children}</div>
    </ReactLenis>
  );
};

export default LenisScrollProvider;
