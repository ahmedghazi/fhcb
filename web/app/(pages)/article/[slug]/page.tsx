import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  ARTICLE_QUERY,
  getArticle,
  getFeuilletage,
  getImageImages,
  IMAGE_IMAGES_QUERY,
} from "@/app/sanity-api/sanity-queries";
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
import { ARTICLE_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import Related from "@/app/components/Rebonds";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const FeuilletageTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  let data: ARTICLE_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      ARTICLE_QUERY,
      { slug },
    );
  } else {
    data = await getArticle(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--article'
      data-template='article'
      data-slug={data.slug?.current || ""}>
      <PageHeader
        // tag={`FEUILLETAGE #${data.index}`}
        h1={data.title?.fr || data.title?.en || ""}
        // subTitle={data.subTitle}
      />
      {/* <pre>{JSON.stringify(data.related, null, 2)}</pre> */}
      <ContentModulaire input={data} />

      {data.related && <Related input={data.related} />}

      {/* {data.related && <Related input={data.related} />}
      {data.rebonds && <Related input={data.rebonds} />} */}
    </div>
  );
};

export default FeuilletageTemplate;
