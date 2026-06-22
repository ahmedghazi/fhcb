"use client";
import React, { useEffect } from "react";
import Modules from "./modules";
import { PostTypes } from "../sanity-api/types/extra-types";

type Props = {
  input: PostTypes;
};

const ContentModulaire = ({ input }: Props) => {
  const { tags, modules } = input;
  // const _isRessource =
  return (
    <div className='content--modulaire relative'>
      {/* <pre>{JSON.stringify(tags, null, 2)}</pre> */}
      {modules && <Modules modules={modules} />}
    </div>
  );
};

export default ContentModulaire;
