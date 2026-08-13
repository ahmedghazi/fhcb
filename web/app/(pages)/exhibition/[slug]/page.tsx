import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  EXPHIBITION_QUERY,
  getExhibition,
} from "@/app/sanity-api/sanity-queries";
import { EXPHIBITION_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import HeroExhibition from "@/app/components/HeroExhibition";
import {
  ArtistExpanded,
  ExhibitionExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import Rebonds from "@/app/components/Rebonds";
import RebondsExhibition from "@/app/components/RebondsExhibition";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getExhibition(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const Exhibitiontemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  let data: EXPHIBITION_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      EXPHIBITION_QUERY,
      { slug },
    );
  } else {
    data = (await getExhibition(slug)) as EXPHIBITION_QUERY_RESULT;
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--exhibition'
      data-template='exhibition'
      data-slug={data.slug?.current || ""}>
      <HeroExhibition input={data as unknown as ExhibitionExpanded} />
      <ContentModulaire input={data} />
      {/* {data.aroundTheExhibition && (
        <Rebonds input={data.aroundTheExhibition} title='aroundTheExhibition' />
      )} */}
      {/* {data.relatedByExhibition && (
        <RebondsExhibition
          input={data.relatedByExhibition}
          artists={data.artists as unknown as ArtistExpanded[]}
        />
      )}
      {data.related && <Rebonds input={data.related} title='toDiscoverToo' />} */}
      {/* <pre>{JSON.stringify(data.rebondsType, null, 2)}</pre> */}

      <Rebonds
        title={data.rebondsType?.title || undefined}
        input={data.rebondsType?.resolvedItems}
        items={data.rebondsType?.items}
      />
    </div>
  );
};

export default Exhibitiontemplate;
