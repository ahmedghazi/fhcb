"use client";

import { useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

type ImagePixelatedProps = Omit<ImageProps, "placeholder"> & {
  /**
   * A small base64 LQIP (e.g. from `plaiceholder`, `sharp`, or your CMS).
   * IMPORTANT: pass the raw tiny image data URL here, NOT the value you'd
   * give Next's built-in `placeholder="blur"` — that one gets wrapped in
   * an SVG with a baked-in gaussian blur filter, which you can't un-blur
   * with CSS. This component paints the raw LQIP itself as the background.
   */
  blurDataURL: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};

export default function ImagePixelated({
  blurDataURL,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  onLoad,
  alt,
  ...imageProps
}: ImagePixelatedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={wrapperClassName}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        // paint the tiny LQIP as the background, then blow it up crisp
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // this is the part that gives you the pixelated look
        imageRendering: "pixelated",
        ...wrapperStyle,
      }}>
      <Image
        {...imageProps}
        alt={alt}
        className={className}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        style={{
          width: "100%",
          height: "auto",
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease",
          ...style,
        }}
      />
    </div>
  );
}
