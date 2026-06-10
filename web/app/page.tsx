import { draftMode } from "next/headers";
import { Metadata } from "next";
import website from "./config/website";
import { notFound } from "next/navigation";
import ContentModulaire from "./components/ContentModulaire";
import { getHome, HOME_QUERY } from "./sanity-api/sanity-queries";
import { getClient } from "./sanity-api/sanity.client";
import DS from "./components/DS";
import { HOME_QUERY_RESULT } from "./sanity-api/types/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || website.title}`,
    description: data?.seo?.metaDescription || website.description,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const HomePage = async function Page() {
  const { isEnabled } = await draftMode();

  let data: HOME_QUERY_RESULT;
  if (isEnabled) {
    data = await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
      HOME_QUERY,
    );
  } else {
    data = await getHome();
  }

  // if (!data) return notFound();

  return (
    <div className='template template--home' data-template='home'>
      {data && data.modules && <ContentModulaire input={data} />}
    </div>
  );
};

export default HomePage;
