"use client";
import React from "react";

import { _localizeField, _localizeText } from "../sanity-api/utils";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";
import CardProduct from "./ui/cards/CardProduct";

type Props = {
  input?: ProductExpanded[];
};

const RebondsProducts = ({ input }: Props) => {
  //query api to get 4 random artist

  return (
    <section className='rebonds rebonds--products'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText("discoverToo")}</h2>
        <div className='grid--centered'>
          {input?.map((item, i) => (
            <CardProduct key={i} input={item} size='sm' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RebondsProducts;
