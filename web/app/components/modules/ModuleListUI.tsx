"use client";
import React from "react";
import { ListUI } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import ListItemComponent from "./ListItem";

type Props = {
  input: ListUI;
};

const ModuleListUI = ({ input }: Props) => {
  const { titleh2, title, items } = input;
  return (
    <section className='module module--list-ui'>
      {titleh2 && (
        <div className='container-fluid'>
          <h2 className='module__title c-h1_5 '>{_localizeField(titleh2)}</h2>
        </div>
      )}
      <div className='container-fluid'>
        <div className='module__inner'>
          <h3 className='c-h4'>{_localizeField(title)}</h3>
          {items && (
            <div className='module__list'>
              {items.map((item: any, i: number) => (
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
