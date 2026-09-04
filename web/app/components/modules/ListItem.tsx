"use client";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import { ListItem } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import { PortableText } from "@portabletext/react";
import clsx from "clsx";
import React from "react";

type Props = {
  input: ListItem;
};

const ListItemComponent = ({ input }: Props) => {
  const isText = input.text && !input.content;
  return (
    <div className={clsx("list-item", isText && "is-text")}>
      <div className='title c-h3 md:col-span-3'>
        {_localizeField(input.title)}
      </div>
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
      {!isText && input.content && (
        <div className='content'>{_localizeField(input.content)}</div>
      )}
      {isText && (
        <div className='content text md:col-span-6'>
          <PortableText
            value={_localizeField(input.text)}
            components={portableTextComponents}
          />
        </div>
      )}
    </div>
  );
};

export default ListItemComponent;
