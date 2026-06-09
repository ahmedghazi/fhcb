import React from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibition from "../ui/cards/CardExhibition";
import CardExhibitionFeatured from "../ui/cards/CardExhibitionFeatured";
import GridMasonry from "../ui/GridMasonry";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const { gridSize } = input;
  const cols = gridSize || 12;
  const items = input.items as unknown as ExhibitionExpanded[];

  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {/* <GridMasonry columns={3}> */}
          <div
            className={`grid md:grid-cols-${cols} items-start gap-gutter`}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              gridAutoRows: "8px",
            }}>
            {items?.map((item, index: number) => (
              <CardExhibitionFeatured
                key={`${item._id}-${index}`}
                input={item}
                // size='sm'
              />
            ))}
          </div>
          {/* </GridMasonry> */}
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
