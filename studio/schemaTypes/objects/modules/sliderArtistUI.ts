import {defineField} from 'sanity'
import {MdOutlineSlideshow} from 'react-icons/md'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'sliderArtistUI',
  title: 'Slider Artiste UI',
  type: 'object',
  icon: MdOutlineSlideshow,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),

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
    select: {
      title: `title.${baseLanguage}`,
      artist: `artist.name`,
    },
    prepare(selection) {
      return {title: selection.title || 'Slider Artiste UI', subtitle: 'Slider Artiste UI'}
    },
  },
})
