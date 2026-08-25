"use client";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import { LocaleBlockContent } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import { PortableText } from "@portabletext/react";
import React from "react";

type Props = {
  input?: LocaleBlockContent;
};

const Text = ({ input }: Props) => {
  return (
    <div className='text'>
      {input && (
        <PortableText
          value={_localizeField(input)}
          components={portableTextComponents}
        />
      )}
    </div>
  );
};

export default Text;
