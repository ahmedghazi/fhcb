import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { sanityFetch } from "@/app/sanity-api/sanity.client";
import { cardRefEvent, cardRefProduct } from "@/app/sanity-api/fragments-cards";

const EVENTS_QUERY = groq`*[_type == "event"] | order(coalesce(dates[0].du, _createdAt) asc) {
  ${cardRefEvent}
}`;

const PRODUCTS_QUERY = groq`*[_type == "product" && references(*[_type == "tag" && slug.current == "livre-du-mois"]._id)] | order(_createdAt desc) {
  ${cardRefProduct}
}`;

export const dynamic = "force-dynamic";

export async function GET() {
  const [events, products] = await Promise.all([
    sanityFetch({ query: EVENTS_QUERY, tags: ["event"] }),
    sanityFetch({ query: PRODUCTS_QUERY, tags: ["product"] }),
  ]);
  return NextResponse.json({ events, products });
}
