"use client";
import { ListsUI } from "@/app/sanity-api/types/sanity.types";
import React from "react";
import ListItemComponent from "./ListItem";
import ModuleListUI from "./ModuleListUI";

type Props = {
  input: ListsUI;
};

const ModuleListsUI = ({ input }: Props) => {
  return (
    <section className='module module--lists-ui'>
      {/* <div className='container-fluid'> */}
      <div className='module__inner'>
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
