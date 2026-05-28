import React, { Fragment } from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";

import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getClient } from "@/app/sanity-api/sanity.client";
import { PROGRAMME_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import { getProgramme, PROGRAMME_QUERY } from "@/app/sanity-api/sanity-queries";
import PageHeader from "@/app/components/PageHeader";
import CardExhibition from "@/app/components/ui/cards/CardExhibition";
import CardEvent from "@/app/components/ui/cards/CardEvent";
import {
  ExhibitionExpanded,
  EventExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";

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

  let data: PROGRAMME_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      PROGRAMME_QUERY,
      { slug },
    );
  } else {
    data = await getProgramme(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--programme'
      data-template='programme'
      data-slug={data.slug?.current || ""}>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className='container-fluid'>
        <PageHeader h1={data.title} />
        {data.resolvedItems && (
          <div
            className={clsx("grid md:grid-cols-4 gap-gutter")}
            style={{
              gridTemplateColumns: "repeat(auto-fit, var(--gridder-1))",
              justifyContent: "center",
            }}>
            {data.resolvedItems.map((item) => (
              <Fragment key={item._id}>
                {item._type === "exhibition" && (
                  <div className='md:col-span-4'>
                    <CardExhibition
                      input={item as unknown as ExhibitionExpanded}
                      size='lg'
                    />
                  </div>
                )}
                {item._type === "event" && (
                  <div
                    className={clsx(
                      `md:col-span-${data.items === "guided-tours" ? 1 : 4}`,
                    )}>
                    <CardEvent
                      input={item as unknown as EventExpanded}
                      size={data.items === "guided-tours" ? "sm" : "lg"}
                    />
                  </div>
                )}
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
