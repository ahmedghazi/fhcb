import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  ARTIST_QUERY,
  getArtist,
  getRandomArtists,
} from "@/app/sanity-api/sanity-queries";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getClient } from "@/app/sanity-api/sanity.client";
import PageHeader from "@/app/components/PageHeader";
import { ARTIST_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import RebondsArtistes from "@/app/components/RebondsArtistes";
import HeroArtist from "@/app/components/HeroArtist";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArtist(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.name || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const ArtistTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  let data: ARTIST_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      ARTIST_QUERY,
      { slug },
    );
  } else {
    data = (await getArtist(slug)) as ARTIST_QUERY_RESULT;
  }

  if (!data) return notFound();

  const randomArtists = await getRandomArtists(slug);

  return (
    <div
      className='template template--artist'
      data-template='artist'
      data-slug={data.slug?.current || ""}>
      <PageHeader name={data.name} />
      <HeroArtist input={data} />
      <RebondsArtistes input={randomArtists} />
    </div>
  );
};

export default ArtistTemplate;
