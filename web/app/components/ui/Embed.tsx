"use client";
import React from "react";
import { Embed } from "@/app/sanity-api/types/sanity.types";
import EmbedVideo from "./EmbedVideo";

type Props = {
  input: Embed;
};

const EmbedComponent = ({ input }: Props) => {
  return (
    <>
      <EmbedVideo embedUrl={input.url} />
      {input?.iframe && (
        <div className='embed' dangerouslySetInnerHTML={{ __html: input.iframe }} />
      )}
    </>
  );
};

export default EmbedComponent;
