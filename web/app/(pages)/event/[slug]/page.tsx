import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import { EVENT_QUERY, getEvent } from "@/app/sanity-api/sanity-queries";
import { EVENT_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import ExhibitionHero from "@/app/components/HeroExhibition";
import {
  EventExpanded,
  ExhibitionExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import Rebonds from "@/app/components/Rebonds";
import HeroEvent from "@/app/components/HeroEvent";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEvent(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const EventTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  let data: EVENT_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      EVENT_QUERY,
      { slug },
    );
  } else {
    data = (await getEvent(slug)) as EVENT_QUERY_RESULT;
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--event'
      data-template='event'
      data-slug={data.slug?.current || ""}>
      <HeroEvent input={data as unknown as EventExpanded} />
      <ContentModulaire input={data} />
      {data.related && <Rebonds input={data.related} />}
    </div>
  );
};

export default EventTemplate;
