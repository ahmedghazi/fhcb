"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import { _localizeField } from "@/app/sanity-api/utils";
import Sidebar from "../ui/Sidebar";
import { TextSidebarUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";

type Props = {
  input: TextSidebarUIExpanded;
};

const ModuleTextSidebarUI = ({ input }: Props) => {
  const { text, sidebar } = input;
  return (
    <section className='module module--text-sidebar-ui'>
      <div className='container-fluid'>
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
      </div>
    </section>
  );
};

export default ModuleTextSidebarUI;
