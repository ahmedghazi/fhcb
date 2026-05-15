import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { _linkResolver } from "./utils";
import Figure from "../components/ui/Figure";
import Embed from "../components/ui/Embed";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    "c-chapo": ({ children }) => <p className='c-chapo'>{children}</p>,
  },
  types: {
    image: ({ value }) => {
      return <Figure asset={value.asset} />;
    },
    embed: ({ value }) => {
      return <Embed input={value} />;
    },
    blockquote: ({ value }) => {
      const { text, author } = value;
      return (
        <div className='blockquote'>
          <blockquote className='c-quote'>{text}</blockquote>
          {author && <span className='c-caption'>{author}</span>}
        </div>
      );
    },
  },
  marks: {
    linkInternal: ({ children, value }) => {
      return <Link href={_linkResolver(value.reference)}>{children}</Link>;
    },
    linkExternal: ({ children, value }) => {
      const { href } = value;
      return (
        <a href={href} rel={"noreferrer noopener"} target='_blank'>
          <span>{children}</span>
        </a>
      );
    },
    align_left: ({ children }) => (
      <span className='text-left block'>{children}</span>
    ),
    align_center: ({ children }) => (
      <span className='text-center block'>{children}</span>
    ),
    align_right: ({ children }) => (
      <span className='text-right block'>{children}</span>
    ),
  },
};

export default portableTextComponents;
