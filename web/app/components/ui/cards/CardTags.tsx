import { Tag } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import React from "react";

type Props = {
  input: Tag[];
};

const CardTags = ({ input }: Props) => {
  const tagsList = input?.map((tag) => _localizeField(tag.title)).join(", ");
  return (
    <div className='card__tag c-tag'>
      {tagsList}
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
    </div>
  );
};

export default CardTags;
