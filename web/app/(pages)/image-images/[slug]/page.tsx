import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  getImageImages,
  IMAGE_IMAGES_QUERY,
} from "@/app/sanity-api/sanity-queries";
import {
  Chercheur,
  IMAGE_IMAGES_QUERY_RESULT,
} from "@/app/sanity-api/types/sanity.types";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import PageHeader from "@/app/components/PageHeader";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import Embed from "@/app/components/ui/Embed";
import CardImageImages from "@/app/components/ui/cards/CardImageImages";
import RelatedImageImages from "@/app/components/RebondsImageImages";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import EmbedVideo from "@/app/components/ui/EmbedVideo";
import VideoJsonLd from "@/app/components/ui/VideoJsonLd";
import { getYouTubeNoCookieUrl, getYouTubeThumbnails } from "@/app/lib/utils";
import Rebonds from "@/app/components/Rebonds";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getImageImages(slug);
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

  let data: IMAGE_IMAGES_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      IMAGE_IMAGES_QUERY,
      { slug },
    );
  } else {
    data = await getImageImages(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--image-images'
      data-template='image-images'
      data-slug={data.slug?.current || ""}>
      <PageHeader
        tag={`Une image, des images #${data.index}`}
        h1={data.title}
        subTitle={(data.chercheur as unknown as Chercheur)?.name}
      />
      <div className='container-fluid'>
        {data.video && <EmbedVideo embedUrl={data.video.embedUrl} />}
      </div>
      {data.video?.embedUrl && (
        <VideoJsonLd
          name={`Une image, des images #${data.index} — ${_localizeField(data.title)}`}
          description={data.seo?.metaDescription}
          thumbnailUrl={getYouTubeThumbnails(data.video.embedUrl)}
          uploadDate={data._createdAt}
          embedUrl={
            getYouTubeNoCookieUrl(data.video.embedUrl) || data.video.embedUrl
          }
        />
      )}
      <ContentModulaire input={data} />
      {/* {data.rebonds && (
        <RelatedImageImages
          input={data.rebonds as unknown as ImageImagesExpanded[]}
        />
      )} */}
      {data.related && (
        <Rebonds input={data.related} layout='slider' title={"discoverToo"} />
      )}
    </div>
  );
};

export default ArtistTemplate;
