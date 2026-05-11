import React from 'react'
import {GoVideo} from 'react-icons/go'
import ReactPlayer from 'react-player'
import {defineField} from 'sanity'

type Props = {
  url: string
  iframe: string
  title: string
  aspectRatio: string
  renderDefault: Function
}

const EmbedPreview = (props: Props) => {
  const {title, aspectRatio, url, iframe, renderDefault} = props
  // console.log({url})
  // console.log({iframe})
  const playerConfig = {
    youtube: {
      playerVars: {
        controls: 1,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        cc_load_policy: 0,
        showinfo: 0,
        rel: 0,
        origin: 'https://xx.sanity.studio',
      },
      // embedOptions: {
      //   host: 'https://www.youtube-nocookie.com',
      // },
    },
  }

  if (!url && !iframe) return <div>{renderDefault(props)}</div>
  return (
    <div>
      {renderDefault({...props, title: title ? title : aspectRatio})}
      {url && <ReactPlayer url={url} config={playerConfig} width="100%" height="auto" />}
      {iframe && <div dangerouslySetInnerHTML={{__html: iframe}} />}
    </div>
  )
}

export default {
  title: 'Video',
  name: 'video',
  type: 'object',
  icon: GoVideo,
  initialValue: {
    colSize: 3,
  },
  fields: [
    defineField({
      name: 'caption',
      type: 'localeString',
      description: 'Caption',
      hidden: ({parent, document}) => {
        console.log(parent, document)
        return document?._type === 'project'
      },
    }),
    defineField({
      title: 'Video mux',
      name: 'video',
      type: 'mux.video',
    }),

    defineField({
      name: 'placeholder',
      type: 'image',
      description: 'optionnal',
      // hidden: true,
      hidden: ({parent, document}) => {
        console.log(parent, document)
        return document?._type === 'project'
      },
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
    defineField({
      name: 'aspectRatio',
      type: 'string',
      description: 'Ex: 16/9',
      hidden: true,

      // validation: (Rule) => Rule.required(),
      // options: {
      //   list: [{title: 'Landscape', value: 'lands'}],
      // },
    }),
    defineField({
      name: 'colSize',
      title: 'Colunn size',
      type: 'number',
      description:
        'In a 6 columns grid (ex: 1, 2, 3), if used in a list (media section in project for example)',
      hidden: ({parent, document}) => {
        console.log(parent, document)
        return document?._type === 'project'
      },
    }),
  ],
  components: {
    preview: EmbedPreview, // Add custom preview component
  },
  preview: {
    select: {
      title: 'caption.en',
      url: 'url',
      iframe: 'iframe',
      aspectRatio: 'aspectRatio',
    },
  },
}
