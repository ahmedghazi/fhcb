// import supportedLanguages from "../locale/supportedLanguages";
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import linkInternalTypes from '../misc/linkInternalTypes'
// import linkInternalTypes from '../misc/linkInternalTypes'

export default defineField({
  title: 'Lien interne',
  name: 'linkInternal',
  type: 'object',
  preview: {
    select: {
      label: `label.${baseLanguage}`,
      _type: 'link._type',
      withSubmenu: 'withSubmenu',
    },
    prepare(selection) {
      const {label, _type, withSubmenu} = selection
      console.log(label, _type)
      return {
        title: label,
        subtitle: withSubmenu ? 'Avec sous-menu' : _type,
        // subtitle: link._type,
        // subtitle: "test",
      }
    },
  },
  fields: [
    defineField({
      name: 'label',
      type: 'localeString',
    }),
    defineField({
      name: 'link',
      type: 'reference',
      title: 'Lien',
      weak: true,
      to: linkInternalTypes,
    }),
    defineField({
      name: 'withSubmenu',
      type: 'boolean',
      title: 'Avec sous menu',
    }),
    defineField({
      name: 'subMenu',
      title: 'Sous menu',
      type: 'array',
      of: [
        {
          type: 'linkInternal',
        },
        {
          type: 'linkExternal',
        },
      ],
      hidden: ({parent}) => !parent?.withSubmenu,
    }),
  ],
})
