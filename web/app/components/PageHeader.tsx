"use client";
import React from "react";
import { LocaleString } from "../sanity-api/types/sanity.types";
import { _localizeField } from "../sanity-api/utils";

type Props = {
  h1?: LocaleString;
  name?: string;
};

const PageHeader = ({ h1, name }: Props) => {
  return (
    <div className='page-header'>
      <h1 className='c-h1-lg'>
        {h1 && _localizeField(h1)}
        {name && name}
      </h1>
    </div>
  );
};

export default PageHeader;
