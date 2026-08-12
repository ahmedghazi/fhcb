import React from "react";
import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import {
  getConversation,
  CONVERSATION_QUERY,
} from "@/app/sanity-api/sanity-queries";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ContentModulaire from "@/app/components/ContentModulaire";
import { getClient } from "@/app/sanity-api/sanity.client";
import PageHeader from "@/app/components/PageHeader";
import { _localizeField } from "@/app/sanity-api/utils";
import Embed from "@/app/components/ui/Embed";
import Rebonds from "@/app/components/Rebonds";
import { CONVERSATION_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import EmbedVideo from "@/app/components/ui/EmbedVideo";
import ContentConversation from "@/app/components/ContentConversation";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getConversation(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const ConversationTemplate: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;
  let data: CONVERSATION_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      CONVERSATION_QUERY,
      { slug },
    );
  } else {
    data = await getConversation(slug);
  }

  if (!data) return notFound();

  return (
    <div
      className='template template--conversation'
      data-template='conversation'
      data-slug={data.slug?.current || ""}>
      <PageHeader h1={data.title} subTitle={data.subTitle} />
      {/* <div className='container-fluid'>
        {data.video && <EmbedVideo input={data.video} />}
      </div> */}
      <ContentConversation input={data} />
      {/* <ContentModulaire input={data} /> */}
      {/* {data.related && <Rebonds input={data.related} />}
      {data.rebonds && <Rebonds input={data.rebonds} />} */}
    </div>
  );
};

export default ConversationTemplate;
