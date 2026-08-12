import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import { ListItem } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import { PortableText } from "@portabletext/react";
import React from "react";

type Props = {
  input: ListItem;
};

const ListItemComponent = ({ input }: Props) => {
  return (
    <div className='list-item'>
      <div className='title c-h3'>{_localizeField(input.title)}</div>
      {input.content && (
        <div className='module__text text'>
          <PortableText
            value={input.content}
            components={portableTextComponents}
          />
        </div>
      )}
      {/* <div className='content'>{_localizeField(input.content)}</div> */}
    </div>
  );
};

export default ListItemComponent;
