import React from "react";
import { LocaleBlockContent } from "../sanity-api/types/sanity.types";
import { PortableText } from "@portabletext/react";
import { _localizeField } from "../sanity-api/utils";
import portableTextComponents from "../sanity-api/portableTextComponents";

type Props = {
  input: LocaleBlockContent;
};

const NavMessage = ({ input }: Props) => {
  return (
    <div className='nav-message text'>
      <PortableText
        value={_localizeField(input)}
        components={portableTextComponents}
      />
    </div>
  );
};

export default NavMessage;
