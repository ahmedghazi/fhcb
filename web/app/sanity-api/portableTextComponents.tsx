import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { _linkResolver, _localizeField } from "./utils";
import Figure from "../components/ui/Figure";
import Embed from "../components/ui/Embed";
import { KeyVal } from "./types/sanity.types";
import EmbedVideo from "../components/ui/EmbedVideo";

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
    video: ({ value }) => {
      return <EmbedVideo embedUrl={value.embedUrl} />;
    },
    embed: ({ value }) => {
      return <Embed input={value} />;
    },
    blockContentCta: ({ value }) => {
      const { align } = value;
      return (
        <div className={`text-${align} `}>
          {value.internal && (
            <Link
              className='btn btn--cta'
              href={_linkResolver(value.internal.link)}>
              {_localizeField(value.internal.label)}
            </Link>
          )}
          {value.external && (
            <a
              className='btn btn--cta'
              href={value.external.link}
              target='_blank'
              rel='noopener noreferrer'>
              {_localizeField(value.external.label)}
            </a>
          )}
        </div>
      );
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
    keyValGroup: ({ value }) => {
      const { title, items } = value;
      return (
        <div className='key-val-group'>
          {title && (
            <h3 className='c-tag underline'>{_localizeField(title)}</h3>
          )}
          {items?.map((item: KeyVal, i: number) => (
            <div key={i}>
              {item.text && (
                <>
                  <div className=''>{_localizeField(item.title)}</div>
                  <div className='c-body--tight'>
                    {_localizeField(item.text)}
                  </div>
                  {item.image && item.image.asset && (
                    <Figure asset={item.image.asset} />
                  )}
                </>
              )}
            </div>
          ))}
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
    sup: ({ children }) => <sup>{children}</sup>,
  },
};

export default portableTextComponents;
