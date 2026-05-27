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
import ExhibitionHero from "@/app/components/ExhibitionHero";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";

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

const ArtistTemplate: NextPage<PageProps> = async ({ params }) => {
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
      <ExhibitionHero input={data as unknown as ExhibitionExpanded} />
      <ContentModulaire input={data} />
    </div>
  );
};

export default ArtistTemplate;
