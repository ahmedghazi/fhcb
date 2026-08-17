import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import PageHeader from "@/app/components/PageHeader";
import { getClient } from "@/app/sanity-api/sanity.client";
import { getLibrairie, LIBRARY_QUERY } from "@/app/sanity-api/sanity-queries";
import { notFound } from "next/navigation";
import ContentLibrary from "@/app/components/ContentLibrary";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLibrairie();
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const LibrairiePage: NextPage = async () => {
  const { isEnabled } = await draftMode();
  const data = isEnabled
    ? await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
        LIBRARY_QUERY,
      )
    : await getLibrairie();

  if (!data) return notFound();

  return (
    <div className='template template--library' data-template='library'>
      <PageHeader h1={data.title} />
      {/* the product grid can be large — give React a boundary to stream/flush it separately
      from the header instead of one large un-Suspense'd document */}
      <Suspense fallback={null}>
        <ContentLibrary input={data} />
      </Suspense>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default LibrairiePage;
