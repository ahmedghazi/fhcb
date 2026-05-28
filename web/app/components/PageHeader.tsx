"use client";
import React from "react";
import {
  LocaleString,
  LocaleText,
  Tag,
} from "../sanity-api/types/sanity.types";
import { _localizeField } from "../sanity-api/utils";

type Props = {
  tag?: LocaleString | string;
  h1?: LocaleString | string;
  name?: string;
  subTitle?: LocaleString | LocaleText | string;
};

const PageHeader = ({ tag, h1, name, subTitle }: Props) => {
  return (
    <div className='page-header'>
      <div className='container-fluid'>
        {tag && <div className='c-tag'>{_localizeField(tag)}</div>}
        <h1 className='c-h1-lg'>
          {h1 && _localizeField(h1)}
          {name && name}
        </h1>
        {subTitle && <p className='c-title-expo'>{_localizeField(subTitle)}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
