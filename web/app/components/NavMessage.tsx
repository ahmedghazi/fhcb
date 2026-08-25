import React from "react";
import { LocaleBlockContent } from "../sanity-api/types/sanity.types";
import { _localizeField } from "../sanity-api/utils";
import Text from "./ui/Text";

type Props = {
  input: LocaleBlockContent;
};

const NavMessage = ({ input }: Props) => {
  return (
    <div className='nav-message'>
      <Text input={input} />
      {/* <PortableText
        value={_localizeField(input)}
        components={portableTextComponents}
      /> */}
    </div>
  );
};

export default NavMessage;
