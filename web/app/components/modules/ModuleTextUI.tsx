"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import useLocale from "@/app/context/LocaleContext";
import { _localizeField } from "@/app/sanity-api/utils";
import { TextUI } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: TextUI;
};

const ModuleTextUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const text = _localizeField(input.text);
  const title = _localizeField(input.title);

  return (
    <section className='module module--text-ui'>
      <div className='module__inner'>
        {title && <h2 className='module__title c-h1_5'>{title}</h2>}
        {text && (
          <div className='module__text text'>
            <PortableText value={text} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleTextUI;
