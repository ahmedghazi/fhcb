import {defineField} from 'sanity'
import {MdOutlineSlideshow} from 'react-icons/md'

export default defineField({
  name: 'sliderArtistUI',
  title: 'Slider Artiste UI',
  type: 'object',
  icon: MdOutlineSlideshow,
  fields: [
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: [
        {
          type: 'artist',
        },
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `artist.name`},
    prepare(selection) {
      return {title: selection.title || 'Slider Artiste UI', subtitle: 'Slider Artiste UI'}
    },
  },
})
