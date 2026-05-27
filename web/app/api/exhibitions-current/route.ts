import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { sanityFetch } from "@/app/sanity-api/sanity.client";
import { cardRefExhibition } from "@/app/sanity-api/fragments";

const QUERY = groq`*[_type == "exhibition" && defined(dates[0]) && dateTime(dates[0].du) <= dateTime(now()) && dateTime(dates[-1].au) >= dateTime(now())] | order(dates[0].du asc) {
  ${cardRefExhibition}
}`;

export const dynamic = "force-dynamic";

export async function GET() {
  const exhibitions = await sanityFetch({ query: QUERY, tags: ["exhibition"] });
  return NextResponse.json(exhibitions);
}
