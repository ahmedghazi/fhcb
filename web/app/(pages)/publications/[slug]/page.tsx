import website from "@/app/config/website";
import { Metadata, NextPage } from "next";
import { draftMode } from "next/headers";

import { getClient } from "@/app/sanity-api/sanity.client";
import { getProduct, PRODUCT_QUERY } from "@/app/sanity-api/sanity-queries";
import { notFound } from "next/navigation";
import ContentProduct from "@/app/components/ContentProduct";

type Params = Promise<{ slug: string }>;

type PageProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const data = await getProduct(slug);
  return {
    title: `${data?.seo?.metaTitle || data?.title?.fr || ""}`,
    description: data?.seo?.metaDescription,
    openGraph: {
      images: data?.seo?.metaImage?.asset?.url || website.image,
    },
  };
}

const ProductPage: NextPage<PageProps> = async ({ params }) => {
  const { isEnabled } = await draftMode();
  const { slug } = await params;
  const data = isEnabled
    ? await getClient({ token: process.env.SANITY_API_READ_TOKEN }).fetch(
        PRODUCT_QUERY,
        { slug },
      )
    : await getProduct(slug);

  if (!data) return notFound();

  return (
    <div className='template template--product' data-template='product'>
      {/* <PageHeader h1={data.title} /> */}
      <ContentProduct input={data} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default ProductPage;
