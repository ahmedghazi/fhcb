import React from "react";
import { CONVERSATION_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import { PortableText } from "@portabletext/react";
import { _localizeField } from "../sanity-api/utils";
import portableTextComponents from "../sanity-api/portableTextComponents";

type Props = {
  input: CONVERSATION_QUERY_RESULT;
};

const ContentConversation = ({ input }: Props) => {
  // const { description } = input;

  return (
    <div className='content content--conversation'>
      {/* {description && (
        <div className='text'>


          {_localizeField(description)}
        </div>
      )} */}
      {/* <PortableText
            value={_localizeField(description)}
            components={portableTextComponents}
          /> */}
    </div>
  );
};

export default ContentConversation;
