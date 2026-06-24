import React, { useEffect, useRef } from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibition from "../ui/cards/CardExhibition";
import CardExhibitionFeatured from "../ui/cards/CardExhibitionFeatured";
import GridMasonry from "../ui/GridMasonry";
import CardVideo from "../ui/cards/CardVideo";
import GridMasonryDessandro from "../ui/GridMasonryDessandro";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const { gridSize } = input;
  const ref = useRef<HTMLDivElement>(null);
  const cols = gridSize || 3;
  const items = input.items as unknown as ExhibitionExpanded[];
  const video = input.video;

  // useEffect(() => {
  //   _onResize();
  //   window.addEventListener("resize", _onResize);
  //   return () => {
  //     window.removeEventListener("resize", _onResize);
  //   };
  // }, []);

  // const _onResize = () => {
  //   if (ref.current) {
  //     const items = ref.current.querySelectorAll(".card");
  //     items.forEach((el) => {
  //       resizeGridItem(el as HTMLDivElement);
  //     });
  //   }
  // };

  // function resizeGridItem(item: HTMLDivElement) {
  //   const grid = item.parentElement;
  //   if (!grid) return;
  //   const rowHeight = parseInt(
  //     getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
  //   );
  //   console.log("rowHeight", rowHeight);

  //   const gap = parseInt(getComputedStyle(grid).getPropertyValue("gap"));
  //   const height = item.getBoundingClientRect().height;
  //   const rowSpan = Math.ceil((height + gap) / (rowHeight + gap));
  //   item.style.gridRowEnd = `span ${rowSpan}`;
  // }

  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {/* <GridMasonry columns={3}> */}
          <div
            ref={ref}
            // className={`grid md:grid-cols-${cols} items-start gap-gutter`}
            style={
              {
                // display: "grid",
                // gridTemplateColumns: "repeat(3, 1fr)",
                // gap: "var(--spacing-gutter)",
                // // gridAutoRows: "18px",
                // gridAutoRows: "20px",
              }
            }>
            <GridMasonryDessandro>
              {items?.map((item, index: number) => (
                <CardExhibitionFeatured
                  key={`${item._id}-${index}`}
                  input={item}
                  // size='sm'
                />
              ))}
              {video && <CardVideo input={video} />}
            </GridMasonryDessandro>
          </div>
          {/* </GridMasonry> */}
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
