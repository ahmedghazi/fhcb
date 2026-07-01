import React from 'react'
import {GoVideo} from 'react-icons/go'
import ReactPlayer from 'react-player'
import {defineField} from 'sanity'

type Props = {
  embedUrl: string
  // iframe: string
  title: string
  // aspectRatio: string
  renderDefault: Function
}

const EmbedPreview = (props: Props) => {
  const {title, embedUrl, renderDefault} = props
  // console.log({url})
  // console.log({iframe})

  if (!embedUrl) return <div>{renderDefault(props)}</div>
  return (
    <div>
      {renderDefault({...props, title: title ? title : ''})}
      {embedUrl && <ReactPlayer src={embedUrl} width="100%" height="auto" />}
      {/* {iframe && <div dangerouslySetInnerHTML={{__html: iframe}} />} */}
    </div>
  )
}

export default {
  title: 'Video',
  name: 'video',
  type: 'object',
  icon: GoVideo,
  // initialValue: {
  //   colSize: 3,
  // },
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titre',
      description: 'Légende',
      hidden: true,
      // hidden: ({parent, document}) => {
      //   console.log(parent, document)
      //   return document?._type === 'project'
      // },
    }),
    defineField({
      title: 'Embed',
      description: 'youtube, vimeo. Ex: https://www.youtube.com/watch?v=exTZ9vB6ZeE',
      name: 'embedUrl',
      type: 'string',
    }),

    // defineField({
    //   title: 'Video mux',
    //   name: 'video',
    //   type: 'mux.video',
    // }),

    defineField({
      name: 'placeholder',
      type: 'image',
      title: 'Vignette',
      description: 'Vignette, https://www.get-youtube-thumbnail.com/',
      // hidden: true,
      // hidden: ({parent, document}) => {
      //   console.log(parent, document)
      //   return document?._type === 'project'
      // },
    }),
    // defineField({
    //   name: 'url',
    //   type: 'url',
    //   description: 'for youtube, vimeo. Ex: https://www.youtube.com/watch?v=exTZ9vB6ZeE',
    // }),
    // defineField({
    //   name: 'iframe',
    //   type: 'text',
    //   description: 'for spotify, apple music, deezer, etc ',
    // }),
    // defineField({
    //   name: 'aspectRatio',
    //   type: 'string',
    //   description: 'Ex: 16/9',
    //   hidden: true,

    //   // validation: (Rule) => Rule.required(),
    //   // options: {
    //   //   list: [{title: 'Landscape', value: 'lands'}],
    //   // },
    // }),
    // defineField({
    //   name: 'colSize',
    //   title: 'Colunn size',
    //   type: 'number',
    //   description:
    //     'In a 6 columns grid (ex: 1, 2, 3), if used in a list (media section in project for example)',
    //   hidden: ({parent, document}) => {
    //     console.log(parent, document)
    //     return document?._type === 'project'
    //   },
    // }),
  ],
  components: {
    preview: EmbedPreview, // Add custom preview component
  },
  preview: {
    select: {
      title: 'title.en',
      embed: 'embedUrl',
      // iframe: 'iframe',
      // aspectRatio: 'aspectRatio',
    },
  },
}
