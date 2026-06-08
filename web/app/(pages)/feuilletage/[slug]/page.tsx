import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  FEUILLETAGE_QUERY,
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
// import CardImageImages from "@/app/components/ui/cards/CardImageImages";
// import RelatedImageImages from "@/app/components/RebondsImageImages";
// import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { FEUILLETAGE_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
// import Related from "@/app/components/Rebonds";
import Rebonds from "@/app/components/Rebonds";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFeuilletage(slug);
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

  let data: FEUILLETAGE_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      FEUILLETAGE_QUERY,
      { slug },
    );
  } else {
    data = await getFeuilletage(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--image-images'
      data-template='image-images'
      data-slug={data.slug?.current || ""}>
      <PageHeader
        tag={`FEUILLETAGE #${data.index}`}
        h1={data.title}
        subTitle={data.subTitle}
      />
      <div className='container-fluid'>
        {data.video && <Embed input={data.video} />}
      </div>
      <ContentModulaire input={data} />
      {data.related && <Rebonds input={data.related} />}
      {data.rebonds && <Rebonds input={data.rebonds} />}
      {/* <pre>{JSON.stringify(data.rebonds, null, 2)}</pre> */}
    </div>
  );
};

export default FeuilletageTemplate;
