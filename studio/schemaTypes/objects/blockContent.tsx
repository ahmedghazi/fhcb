import {defineType, defineArrayMember} from 'sanity'
// import { FiExternalLink, LinkIcon } from 'react-icons/fi'
import {LinkIcon} from '@sanity/icons'
import {FiExternalLink} from 'react-icons/fi'
import linkInternalTypes from '../misc/linkInternalTypes'
import {JSX} from 'react'
/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
const TextH3 = (props: any): JSX.Element => (
  <span style={{fontSize: '2rem', marginTop: 0, display: 'block', textAlign: 'center'}}>
    {props.children}
  </span>
)

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        // { title: "Titre H2", value: "h2" },
        {title: 'Titre H3', value: 'h3', component: TextH3},
        // {title: 'H4', value: 'h4'},
        // {title: 'Quote', value: 'blockquote'},
        // {
        //   title: "Texte L",
        //   value: "text-lg",
        //   component: TextL,
        // },
        {
          title: 'chapo',
          value: 'c-chapo',
          // component: TextIndent,
        },
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Superscript', value: 'sup'},
          {title: 'Subscript', value: 'sub'},
          // {
          //   title: "Underline",
          //   value: "u",
          //   icon: () => "u",
          //   component: Underline,
          // },
          // {
          //   title: "Outline",
          //   value: "outline",
          //   icon: () => "o",
          //   component: Outline,
          // },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'Internal link',
            name: 'linkInternal',
            type: 'object',
            icon: LinkIcon,
            fields: [
              {
                name: 'reference',
                type: 'reference',
                weak: true,
                title: 'Reference',
                to: linkInternalTypes,
              },
            ],
          },
          {
            title: 'External link',
            name: 'linkExternal',
            type: 'object',
            icon: FiExternalLink,
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'string',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.

    defineArrayMember({
      type: 'blockContentCta',
    }),
    defineArrayMember({
      type: 'blockquote',
    }),
    defineArrayMember({
      type: 'keyValGroup',
    }),
    defineArrayMember({
      type: 'image',
      // options: {hotspot: true},
    }),

    defineArrayMember({
      type: 'embed',
    }),
  ],
})
