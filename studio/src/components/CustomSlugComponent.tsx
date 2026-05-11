import {useCallback, useEffect} from 'react'
import {Box, Stack, Text, TextInput} from '@sanity/ui'
import {StringInputProps, set, unset, setIfMissing, PatchEvent} from 'sanity'
import {useFormBuilder} from 'sanity'

const _slugify = (raw) => raw.replace(/ /g, '-').toLowerCase()

const CustomSlugComponent = (props: StringInputProps) => {
  const {onChange, value = '', elementProps, schemaType} = props
  // console.log(props)
  const {getDocument} = useFormBuilder().__internal
  const doc = getDocument()
  const source = doc?.title

  useEffect(() => {
    console.log(source)
    updateSlug()
  }, [source])

  const updateSlug = () => {
    if (source) {
      set(_slugify(source))
      onChange(PatchEvent.from([setIfMissing({_type: schemaType.name}), set(_slugify(source))]))
    } else {
      unset()
    }
  }
  // const {
  //   elementProps: {
  //     id,
  //     onBlur,
  //     onFocus,
  //     placeholder,
  //     readOnly,
  //     ref,
  //     // value
  //   },
  //   onChange,
  //   schemaType,
  //   validation,
  //   value = ''
  // } = props

  // const handleChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     return onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())
  //   },
  //   [onChange]
  // )

  const handleChange = useCallback((event: any) => updateSlug(), [updateSlug])

  return (
    <Stack space={3}>
      <TextInput {...elementProps} onChange={handleChange} value={value} />
      {/* <Text size={1}>Characters: {value?.length || 0}</Text> */}
    </Stack>
  )
}

export default CustomSlugComponent
