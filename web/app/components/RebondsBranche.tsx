"use client";
import React from "react";

import { _localizeField, _localizeText } from "../sanity-api/utils";
import { PageModulaireExpanded } from "../sanity-api/types/sanity-expanded.types";
import CardPageModulaire from "./ui/cards/CardPageModulaire";
import CardBranche from "./ui/cards/CardBranche";

type Props = {
  input?: PageModulaireExpanded[];
};

const RebondsBranche = ({ input }: Props) => {
  return (
    <section className='rebonds rebonds--branche'>
      <div className='container-fluid'>
        {/* <h2 className='c-h1_5'>{_localizeText("discoverToo")}</h2> */}
        <div
          className='grid--centered'
          style={
            {
              // gridTemplateColumns: "repeat(auto-fit, var(--gridder-1_12))",
              // justifyContent: "center",
            }
          }>
          {input?.map((item, i) => (
            <CardBranche
              key={i}
              input={item as unknown as PageModulaireExpanded}
              size='sm'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RebondsBranche;
