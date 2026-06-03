import { Fragment } from "react";
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
import Modules from "@/app/components/modules";
import {
  ExhibitionExpanded,
  EventExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";

type Params = Promise<{ slug: string }>;
type PageProps = { params: Params };

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

  const data: PROGRAMME_QUERY_RESULT = isEnabled
    ? await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
        PROGRAMME_QUERY,
        { slug },
      )
    : await getProgramme(slug);

  if (!data) return notFound();

  return (
    <div
      className='template template--programme'
      data-template='programme'
      data-slug={data.slug?.current || ""}>
      <div className='container-fluid'>
        <PageHeader h1={data.title} />
        {/* {data.items === "exhibitions-past" && (
          <div className='filters'>filters</div>
        )}
        {data.resolvedItems && (
          <div
            className='grid md:grid-cols-4 gap-gutter'
            style={{
              gridTemplateColumns: "repeat(auto-fit, var(--gridder-1_4))",
              justifyContent: "center",
            }}>
            {data.resolvedItems.map((item) => (
              <Fragment key={item._id}>
                {item._type === "exhibition" && (
                  <div className={`md:col-span-${isExhibitionSmall ? 1 : 4}`}>
                    <CardExhibition
                      input={item as unknown as ExhibitionExpanded}
                      size={isExhibitionSmall ? "sm" : "lg"}
                    />
                  </div>
                )}
                {item._type === "event" && (
                  <div className={`md:col-span-${isEventSmall ? 1 : 4}`}>
                    <CardEvent
                      input={item as unknown as EventExpanded}
                      size={isEventSmall ? "sm" : "lg"}
                    />
                  </div>
                )}
              </Fragment>
            ))}


          </div>
        )} */}
        {data.modules && <Modules modules={data.modules as any} />}
        {/* <pre>{data.items}</pre>
            <pre>{JSON.stringify(data.filterTags, null, 2)}</pre>
            <pre>{JSON.stringify(data.resolvedItems, null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default ArtistTemplate;
