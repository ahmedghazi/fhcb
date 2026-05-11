export const assemblePageUrl = ({document, options}) => {
  // console.log(document);

  const {slug, _type} = document
  const {previewURL} = options
  if (!slug || !previewURL) {
    console.warn('Missing slug or previewURL', {slug, previewURL})
    return ''
  }
  if (slug === 'home') return `${previewURL}/`

  switch (_type) {
    case 'project':
      return `${previewURL}/project/${slug.current}`
    default:
      return `${previewURL}/${slug.current}`
  }

  return `${previewURL}/${slug.current}`
}

const defaults = {nonTextBehavior: 'remove'}

export function toPlainText(blocks, opts = {}) {
  const options = Object.assign({}, defaults, opts)
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map((child) => child.text).join('')
    })
    .join('\n\n')
}
