"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import {
  LocaleBlockContent,
  TextSidebarUI,
} from "@/app/sanity-api/types/sanity.types";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import useLocale from "@/app/context/LocaleContext";
import { _localizeField } from "@/app/sanity-api/utils";
import Sidebar from "../ui/Sidebar";

type Props = {
  input: TextSidebarUI;
};

const ModuleTextSidebarUI = ({ input }: Props) => {
  const { text, sidebar } = input;
  console.log(sidebar);
  return (
    <section className='module module--text-sidebar-ui'>
      <div className='module__inner'>
        <div className='grid md:grid-cols-12 gap-gutter'>
          {sidebar && (
            <div className='md:col-span-3 modile__aside'>
              <Sidebar input={sidebar} />
            </div>
          )}

          {text && (
            <div className='module__text md:col-span-7'>
              <div className='text'>
                <PortableText
                  value={_localizeField(text)}
                  components={portableTextComponents}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleTextSidebarUI;
