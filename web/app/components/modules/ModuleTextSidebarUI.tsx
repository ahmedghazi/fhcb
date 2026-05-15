"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import { TextSidebarUI } from "@/app/sanity-api/types/sanity.types";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import useLocale from "@/app/context/LocaleContext";

type Props = {
  input: TextSidebarUI;
};

const ModuleTextSidebarUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const text = input.text?.[locale as "fr" | "en"] || input.text?.fr;

  return (
    <section className='module module--text-sidebar-ui'>
      <div className='module__inner'>
        {text && (
          <div className='module__text'>
            <PortableText value={text} components={portableTextComponents} />
          </div>
        )}
        {input.sidebar && input.sidebar.length > 0 && (
          <aside className='module__sidebar'>
            {input.sidebar.map((block: any, i: number) => {
              const sidebarText = block?.[locale as "fr" | "en"] || block?.fr;
              return sidebarText ? (
                <div key={i} className='module__sidebar-block'>
                  <PortableText
                    value={sidebarText}
                    components={portableTextComponents}
                  />
                </div>
              ) : null;
            })}
          </aside>
        )}
      </div>
    </section>
  );
};

export default ModuleTextSidebarUI;
