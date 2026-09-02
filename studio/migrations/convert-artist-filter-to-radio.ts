import {at, defineMigration, set, unset} from 'sanity/migrate'

// The "Une image des images" listing page's `artist` filter (Henri
// Cartier-Bresson / Martine Franck) should render as a radio choice.
// Converts it in place from `filterCheckbox` to `filterRadio`, moving its
// 2 option references from `filterOptions` to `radioOptions` (the field
// name the radio schema uses for the same shape).
const DOC_ID = '08ae2abe-a98d-464e-9f1b-a885b460628c'
const MODULE_KEY = 'e47c19079d02'
const FILTER_KEY = 'be754ac77a68'

export default defineMigration({
  title: 'Convert the "artist" filterCheckbox to filterRadio on Une image des images',
  documentTypes: ['pageModulaire'],
  filter: `_id == "${DOC_ID}"`,
  migrate: {
    document(doc) {
      const modules = (doc as Record<string, unknown>).modules as
        | Array<Record<string, unknown>>
        | undefined
      const mod = modules?.find((m) => m._key === MODULE_KEY)
      const filters = mod?.filters as Array<Record<string, unknown>> | undefined
      const filterDef = filters?.find((f) => f._key === FILTER_KEY)

      if (!filterDef || filterDef._type !== 'filterCheckbox') return []

      const filterPath = ['modules', {_key: MODULE_KEY}, 'filters', {_key: FILTER_KEY}]

      return [
        at([...filterPath, '_type'], set('filterRadio')),
        at([...filterPath, 'radioOptions'], set(filterDef.filterOptions)),
        at([...filterPath, 'filterOptions'], unset()),
      ]
    },
  },
})
