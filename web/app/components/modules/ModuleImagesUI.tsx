"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Figure from "@/app/components/ui/Figure";
import {
  ImageInGridExpanded,
  ImagesUIExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import { _localizeField } from "@/app/sanity-api/utils";
import clsx from "clsx";
import useDeviceDetect from "@/app/hooks/useDeviceDetect";

type Props = {
  input: ImagesUIExpanded;
};

const GUTTER = 20; // même valeur que ta variable CSS gap-gutter

const ModuleImagesUI = ({ input }: Props) => {
  const { title, items } = input;
  const { isMobile } = useDeviceDetect();
  const mosaicRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);
  const [height, setHeight] = useState<number>();

  const images = useMemo(
    () => (items ?? []).filter((item) => item.image?.asset),
    [items],
  );

  const ratios = useMemo(
    () =>
      images.map((item) => {
        const dimensions = item.image?.asset?.metadata?.dimensions;

        return (
          dimensions?.aspectRatio ??
          (dimensions?.width && dimensions?.height
            ? dimensions.width / dimensions.height
            : 1)
        );
      }),
    [images],
  );

  useLayoutEffect(() => {
    if (isMobile) return;
    if (images.length > 4) return;
    const mosaic = mosaicRef.current;
    if (!mosaic || !ratios.length) return;

    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setHeight(undefined);
        return;
      }

      const gap = parseFloat(getComputedStyle(mosaic).columnGap) || GUTTER;
      const availableWidth = mosaic.clientWidth - gap * (ratios.length - 1);
      const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

      setHeight(availableWidth / totalRatio);
      setActive(true);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(mosaic);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [ratios]);

  return (
    <section className='module module--images-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && <h2 className='module__title c-h1_5'>{title}</h2>}

          <div
            ref={mosaicRef}
            className={clsx(
              "images-ui__mosaic flex flex-col gap-gutter md:flex-row",
              active || isMobile ? "opacity-100" : "opacity-0",
            )}>
            {images.map((item: ImageInGridExpanded, i: number) => (
              <div
                key={i}
                className='images-ui__item w-full md:w-auto'
                style={
                  height
                    ? {
                        height,
                        flex: `${ratios[i]} 1 0`,
                      }
                    : undefined
                }>
                <Figure
                  asset={item.image!.asset}
                  caption={_localizeField(item.image!.asset?.title) || ""}
                  alt={_localizeField(item.image!.asset?.altText)}
                  author={_localizeField(item.image!.asset?.description)}
                  copyright={_localizeField(item.image!.asset?.creditLine)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleImagesUI;

// "use client";
// import React from "react";
// import Figure from "@/app/components/ui/Figure";
// import {
//   ImageInGridExpanded,
//   ImagesUIExpanded,
// } from "@/app/sanity-api/types/sanity-expanded.types";
// import clsx from "clsx";
// import { _localizeField } from "@/app/sanity-api/utils";

// type Props = {
//   input: ImagesUIExpanded;
// };

// const ModuleImagesUI = ({ input }: Props) => {
//   const { title, items, gridSize } = input;
//   return (
//     <section className='module module--images-ui'>
//       <div className='container-fluid'>
//         <div className='module__inner'>
//           {title && <h2 className='module__title c-h1_5'>{title}</h2>}

//           {items && (
//             <div
//               className={clsx("grid gap-gutter", {
//                 "md:grid-cols-4": gridSize === 4,
//                 "md:grid-cols-3": gridSize === 3,
//                 "md:grid-cols-2": gridSize === 2,
//               })}>
//               {items.map((item: ImageInGridExpanded, i: number) => (
//                 <div
//                   key={i}
//                   className={clsx(
//                     "module__image-item",
//                     `md:col-span-${item.colSize}`,
//                   )}>
//                   {item.image?.asset && (
//                     <Figure
//                       asset={item.image.asset}
//                       caption={_localizeField(item.image.asset?.title) || ""}
//                       alt={_localizeField(item.image.asset?.altText)}
//                       author={_localizeField(item.image.asset?.description)}
//                       copyright={_localizeField(item.image.asset?.creditLine)}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ModuleImagesUI;
