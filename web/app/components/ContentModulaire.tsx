"use client";
import React, { useEffect } from "react";
import Modules from "./modules";
import { PostTypes } from "../sanity-api/types/extra-types";

type Props = {
  input: PostTypes;
};

const ContentModulaire = ({ input }: Props) => {
  return (
    <div className='content--modulaire relative'>
      {/* <div className='container-fluid'> */}
      {input.modules && <Modules modules={input.modules} />}
      {/* </div> */}
    </div>
  );
};

export default ContentModulaire;
