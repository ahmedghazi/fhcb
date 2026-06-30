import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { sanityFetch } from "@/app/sanity-api/sanity.client";
import { cardRefProduct } from "@/app/sanity-api/fragments-cards";

const PRODUCTS_PAGE_QUERY = groq`*[_type == "product"] | order(publicationDate asc) [$start...$end] {
  ${cardRefProduct}
}`;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 0);
  const pageSize = Number(searchParams.get("pageSize") ?? 20);
  const start = page * pageSize;
  const end = start + pageSize;

  const items = await sanityFetch({
    query: PRODUCTS_PAGE_QUERY,
    tags: ["product"],
    qParams: { start, end },
  });

  return NextResponse.json({ items });
}
