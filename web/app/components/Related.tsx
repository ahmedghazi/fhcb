"use client";

import clsx from "clsx";
import {
  ArticleExpanded,
  ArtistExpanded,
  EventExpanded,
  ExhibitionExpanded,
  FeuilletageExpanded,
  ProductExpanded,
} from "../sanity-api/types/sanity-expanded.types";
import CardArtist from "./ui/cards/CardArtist";
import CardEvent from "./ui/cards/CardEvent";
import CardExhibition from "./ui/cards/CardExhibition";
import CardProduct from "./ui/cards/CardProduct";
import CardFeuilletage from "./ui/cards/CardFeuilletage";
import CardArticle from "./ui/cards/CardArticle";

type Props = {
  // input: NonNullable<FEUILLETAGE_QUERY_RESULT>["related"];
  input: any;
};

const Related = ({ input }: Props) => {
  return (
    <section className='related mb-lg'>
      <div className='container-fluid'>
        {/* <h2 className='c-h1_5'>{_localizeText("discoverToo")}</h2> */}
        <div
          className={clsx("grid md:grid-cols-4 gap-gutter items-start")}
          style={{
            gridTemplateColumns: "repeat(auto-fit, var(--gridder-1))",
            justifyContent: "center",
          }}>
          {input?.map((item: any, i: number) => {
            if (item._type === "article") {
              return (
                <CardArticle
                  key={i}
                  input={item as unknown as ArticleExpanded}
                  size='md'
                />
              );
            }
            if (item._type === "artist") {
              return (
                <CardArtist
                  key={i}
                  input={item as unknown as ArtistExpanded}
                  size='sm'
                />
              );
            }
            if (item._type === "exhibition") {
              return (
                <CardExhibition
                  key={i}
                  input={item as unknown as ExhibitionExpanded}
                  size='sm'
                />
              );
            }
            if (item._type === "product") {
              return (
                <CardProduct
                  key={i}
                  input={item as unknown as ProductExpanded}
                  size='sm'
                />
              );
            }
            if (item._type === "event") {
              return (
                <CardEvent
                  key={i}
                  input={item as unknown as EventExpanded}
                  size='sm'
                />
              );
            }
            if (item._type === "feuilletage") {
              return (
                <CardFeuilletage
                  key={i}
                  input={item as unknown as FeuilletageExpanded}
                  size='sm'
                />
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default Related;
