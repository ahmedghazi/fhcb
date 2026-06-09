"use client";
import React from "react";
import { ListUI } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import ListItemComponent from "./ListItem";

type Props = {
  input: ListUI;
};

const ModuleListUI = ({ input }: Props) => {
  return (
    <section className='module module--list-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <h3 className='c-h4'>{_localizeField(input.title)}</h3>
          {input.items && (
            <div className='module__list'>
              {input.items.map((item: any, i: number) => (
                <ListItemComponent input={item} key={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListUI;
