"use client";
import React from "react";
import { CONVERSATION_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import { PortableText } from "@portabletext/react";
import { _localizeField } from "../sanity-api/utils";
import portableTextComponents from "../sanity-api/portableTextComponents";
import EmbedVideo from "./ui/EmbedVideo";
import Rebonds from "./Rebonds";

type Props = {
  input: CONVERSATION_QUERY_RESULT;
};

const ContentConversation = ({ input }: Props) => {
  // const { text, video, related, rebonds } = input;

  return (
    <div className='content content--conversation'>
      <div className='container-fluid'>
        {input?.video && (
          <div className='mb-md'>
            <EmbedVideo input={input?.video} />
          </div>
        )}

        {input?.text && (
          <div className='grid md:grid-cols-4 gap-gutter'>
            <div className='md:col-span-3-'></div>
            <div className='md:col-span-2'>
              <div className='text'>
                <PortableText
                  value={_localizeField(input?.text)}
                  components={portableTextComponents}
                />
              </div>
            </div>
            <div className='md:col-span-1'></div>
          </div>
        )}

        {input?.related && <Rebonds input={input?.related} />}
        {input?.rebonds && <Rebonds input={input?.rebonds} />}
      </div>
    </div>
  );
};

export default ContentConversation;
