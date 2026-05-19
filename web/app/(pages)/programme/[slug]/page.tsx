import React, { Fragment } from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";

import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getClient } from "@/app/sanity-api/sanity.client";
import { Programme } from "@/app/sanity-api/types/sanity.types";
import { getProgramme, PROGRAMME_QUERY } from "@/app/sanity-api/sanity-queries";
import PageHeader from "@/app/components/PageHeader";
import CardExhibition from "@/app/components/ui/cards/CardExhibition";
import { ProgrammeExtend } from "@/app/sanity-api/types/extra-types";
import CardEvent from "@/app/components/ui/cards/CardEvent";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProgramme(slug);
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

  let data: ProgrammeExtend;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      PROGRAMME_QUERY,
      { slug },
    );
  } else {
    data = (await getProgramme(slug)) as ProgrammeExtend;
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--programme'
      data-template='programme'
      data-slug={data.slug?.current || ""}>
      <div className='container-fluid'>
        <PageHeader h1={data.title} />
        {data.resolvedItems && (
          <div className='grid gap-gutter'>
            {data.resolvedItems.map((item) => (
              <Fragment key={item._id}>
                {item._type === "exhibition" && (
                  <CardExhibition input={item} size='lg' />
                )}
                {item._type === "event" && <CardEvent input={item} size='lg' />}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default ArtistTemplate;
