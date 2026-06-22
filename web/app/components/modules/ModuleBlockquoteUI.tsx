import { BlockquoteUI } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";
import React from "react";

type Props = {
  input: BlockquoteUI;
};

const ModuleBlockquoteUI = ({ input }: Props) => {
  const { author, text } = input;
  return (
    <section className='module module--blockquote-ui'>
      <div className='container-fluid'>
        <div className='blockquote'>
          <blockquote className='c-quote'>{_localizeField(text)}</blockquote>
          {author && <span className='c-caption'>{author}</span>}
        </div>
      </div>
    </section>
  );
};

export default ModuleBlockquoteUI;
