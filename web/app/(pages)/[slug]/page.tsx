import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  getPageModulaire,
  PAGE_MODULAIRE_QUERY,
} from "@/app/sanity-api/sanity-queries";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import PageHeader from "@/app/components/PageHeader";
import { PAGE_MODULAIRE_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import Rebonds from "@/app/components/Rebonds";
import RebondsBranche from "@/app/components/RebondsBranche";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { _isRessource } from "@/app/lib/utils";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPageModulaire(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const PageModulaireTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  let data: PAGE_MODULAIRE_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      PAGE_MODULAIRE_QUERY,
      { slug },
    );
  } else {
    data = (await getPageModulaire(slug)) as PAGE_MODULAIRE_QUERY_RESULT;
  }

  if (!data) return notFound();
  // const isBranch = data?.tags?.some(
  //   (tag) => tag.slug?.current === "branches-ressources",
  // );
  const isRessource = data.tags ? _isRessource(data?.tags) : false;
  return (
    <div
      className='template template--page'
      data-template='page'
      data-slug={data.slug?.current || ""}>
      <PageHeader h1={data.title} />
      <ContentModulaire input={data} />
      {isRessource && data.rebonds && (
        <RebondsBranche input={data.rebonds as PageModulaireExpanded[]} />
      )}
      {!isRessource && data.rebonds && (
        <Rebonds input={data.rebonds} title={data.rebondsLabel || ""} />
      )}
      {/* <RebondsBranche input={data.rebonds as PageModulaireExpanded[]} /> */}
    </div>
  );
};

export default PageModulaireTemplate;
