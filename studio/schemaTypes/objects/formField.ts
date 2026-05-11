import {defineField} from 'sanity'

export default defineField({
  name: 'formField',
  title: 'Champs',
  type: 'object',
  // icon: BsInfoSquare,

  fields: [
    defineField({
      name: 'fieldLabel',
      type: 'string',
      title: 'Libellé',
    }),
    defineField({
      name: 'fieldName',
      type: 'string',
      title:
        'Nom du champs (bas de casse, sans espace, sans caractère autre que a-z. Ex: nom, e-mail)',
    }),

    defineField({
      name: 'required',
      type: 'boolean',
      title: 'Requis',
    }),
  ],
})
