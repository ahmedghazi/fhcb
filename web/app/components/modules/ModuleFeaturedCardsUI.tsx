import React from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibitionFeatured from "../ui/cards/CardExhibitionFeatured";
import CardVideoMux from "../ui/cards/CardVideoMux";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const items = input.items as unknown as ExhibitionExpanded[];
  const video = input.cardVideoMux;
  const isIn = (item: ExhibitionExpanded, locationType: string) =>
    item.dates?.some((date) => date.locationType === locationType) ?? false;
  const primary = items?.find((item) => isIn(item, "inSite-cube"));
  const secondary = items?.find((item) => isIn(item, "inSite-tube"));
  //cube : gauche, tube : droite
  console.log(primary, secondary);
  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div className='featured-cards-grid'>
            {primary && (
              <CardExhibitionFeatured
                input={primary}
                imageSizes='(max-width: 767px) 90vw, 50vw'
              />
            )}
            <div className='featured-cards-grid__secondary'>
              {video && <CardVideoMux input={video} />}

              {secondary && (
                <div className='featured-cards-grid__secondary'>
                  <CardExhibitionFeatured
                    input={secondary}
                    imageSizes='(max-width: 767px) 90vw, 35vw'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
