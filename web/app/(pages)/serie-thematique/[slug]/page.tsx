import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  getSerieThematique,
  SERIE_THEMATIQUE_QUERY,
} from "@/app/sanity-api/sanity-queries";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import PageHeader from "@/app/components/PageHeader";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import Embed from "@/app/components/ui/Embed";
import Rebonds from "@/app/components/Rebonds";
import { SERIE_THEMATIQUE_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import EmbedVideo from "@/app/components/ui/EmbedVideo";
import VideoJsonLd from "@/app/components/ui/VideoJsonLd";
import { getYouTubeNoCookieUrl, getYouTubeThumbnails } from "@/app/lib/utils";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSerieThematique(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const SerieThematiqueTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;
  console.log({ slug });
  let data: SERIE_THEMATIQUE_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      SERIE_THEMATIQUE_QUERY,
      { slug },
    );
  } else {
    data = await getSerieThematique(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--image-images'
      data-template='image-images'
      data-slug={data.slug?.current || ""}>
      <PageHeader
        // tag={`FEUILLETAGE #${data.index}`}
        h1={data.title}
        // subTitle={data.subTitle}
      />
      <div className='container-fluid'>
        {data.video && <EmbedVideo embedUrl={data.video.embedUrl} />}
      </div>
      {data.video?.embedUrl && (
        <VideoJsonLd
          name={_localizeField(data.title)}
          description={data.seo?.metaDescription}
          thumbnailUrl={getYouTubeThumbnails(data.video.embedUrl)}
          uploadDate={data._createdAt}
          embedUrl={
            getYouTubeNoCookieUrl(data.video.embedUrl) || data.video.embedUrl
          }
        />
      )}
      <ContentModulaire input={data} />
      {data.related && <Rebonds input={data.related} />}
      {data.rebonds && <Rebonds input={data.rebonds} />}
    </div>
  );
};

export default SerieThematiqueTemplate;
