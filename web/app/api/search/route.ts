// import { client } from "@/app/utils/sanity-client";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@sanity/client";
import { cardTypes } from "@/app/sanity-api/fragments-cards";

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
    "serieThematique",
  ];

  /*
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
      tags[]->{
        title
      },
      price,
      color
  */
  const query = `*[_type in $postTypes
    && !(_id in path("drafts.**"))
    && (
      title.fr match $s + "*"
      || title.en match $s + "*"
      || subTitle.fr match $s + "*"
      || subTitle.en match $s + "*"
      || description.fr match $s + "*"
      || description.en match $s + "*"
      || text[].children[].text match $s + "*"
      || name match $s + "*"
      || tags[]->title match $s + "*"
      || categories[]->title match $s + "*"
      || tagsProduct[]->title match $s + "*"
      || artists[]->name match $s + "*"
      || chercheur->name match $s + "*"
      || editeur match $s + "*"
      || auteurs match $s + "*"
      || traducteurs match $s + "*"
      || direction_editoriale match $s + "*"
      || isbn match $s + "*"
      )
    ]
    {
      ${cardTypes}
    } | order(_createdAt desc)
    `;
  console.log(query);

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
