"use client";
import { ListsUI } from "@/app/sanity-api/types/sanity.types";
import React from "react";
import ListItemComponent from "./ListItem";
import ModuleListUI from "./ModuleListUI";
import { _localizeField } from "@/app/sanity-api/utils";

type Props = {
  input: ListsUI;
};

const ModuleListsUI = ({ input }: Props) => {
  const { title } = input;
  return (
    <section className='module module--lists-ui'>
      {/* <div className='container-fluid'> */}
      <div className='module__inner'>
        <div className='container-fluid'>
          {title && (
            <h2 className='module__title c-h1_5 '>{_localizeField(title)}</h2>
          )}
        </div>

        {input.items && (
          <div className='module__lists'>
            {input.items.map((item: any, i: number) => (
              <ModuleListUI key={item._key || i} input={item} />
            ))}
          </div>
        )}
      </div>
      {/* </div> */}
    </section>
  );
};

export default ModuleListsUI;
