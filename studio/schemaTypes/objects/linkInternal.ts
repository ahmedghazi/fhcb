// import supportedLanguages from "../locale/supportedLanguages";
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import linkInternalTypes from '../misc/linkInternalTypes'
// import linkInternalTypes from '../misc/linkInternalTypes'

// linkInternal is embedded all over the site (CTAs, block content, sidebars...),
// but these fields only make sense for the settings header nav (navPrimary, btnLibrary).
const headerNavFields = ['navPrimary', 'btnLibrary']
const isSettingsHeaderNav = (document?: Record<string, unknown>, path?: readonly unknown[]) =>
  document?._type === 'settings' && headerNavFields.includes(path?.[0] as string)

export default defineField({
  title: 'Lien interne',
  name: 'linkInternal',
  type: 'object',
  preview: {
    select: {
      label: `label.${baseLanguage}`,
      _type: 'link._type',
      withSubmenu: 'withSubmenu',
      media: 'imageCover',
    },
    prepare(selection) {
      const {label, _type, withSubmenu, media} = selection
      console.log(label, _type)
      return {
        title: label,
        subtitle: withSubmenu ? 'Avec sous-menu' : _type,
        media: media,
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
      name: 'imageCover',
      title: 'Image clef',
      type: 'image',
      hidden: ({document, path}) => !isSettingsHeaderNav(document, path),
    }),
    defineField({
      name: 'withSubmenuImages',
      title: 'Avec les images clef des sous menu',
      type: 'boolean',
      hidden: ({document, path}) => !isSettingsHeaderNav(document, path),
    }),
    defineField({
      name: 'withSubmenu',
      type: 'boolean',
      title: 'Avec sous menu',
      hidden: ({document, path}) => !isSettingsHeaderNav(document, path),
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
      hidden: ({document, path, parent}) => !isSettingsHeaderNav(document, path) || !parent?.withSubmenu,
    }),
    defineField({
      name: 'withMessage',
      type: 'boolean',
      title: 'Avec message',
      hidden: ({document, path}) => !isSettingsHeaderNav(document, path),
    }),
    defineField({
      name: 'navMessage',
      type: 'localeBlockContent',
      hidden: ({parent}) => !parent?.withMessage,
    }),
  ],
})
