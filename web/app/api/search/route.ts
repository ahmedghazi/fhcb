// import { client } from "@/app/utils/sanity-client";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2021-08-29",
  useCdn: true,
  withCredentials: true,
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { s } = body;

  const postTypes = [
    "exhibition",
    "event",
    "product",
    "artist",
    "pageModulaire",
    "imageImages",
    "feuilletage",
  ];

  const query = `*[_type in $postTypes
    && !(_id in path("drafts.**"))
    && (
      title.fr match $s + "*"
      || title.en match $s + "*"
      || text[].children[].text match $s + "*"
      || name match $s + "*"
      || tags[]->title match $s + "*"
      || artists[]->name match $s + "*"
      )
    ]
    {
      _type,
      slug,
      title,
      name,
      imageCover{
        ...,
        asset->
      },
      dates,
      artists[]->{
        name
      },
      color
    } | order(_createdAt desc)
    `;

  try {
    const res = await client.fetch(query, { s, postTypes });
    return new NextResponse(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
