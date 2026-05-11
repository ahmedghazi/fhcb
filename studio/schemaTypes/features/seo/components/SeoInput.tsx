import {ObjectInputProps, set, useFormValue} from 'sanity'
import {Button, Stack, Text, Card} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'
import {baseLanguage} from '../../../locale/supportedLanguages'

export function SeoInput(props: ObjectInputProps) {
  const doc = useFormValue([]) as Record<string, any>

  const lang = baseLanguage

  const sourceTitle = doc?.title?.[lang]

  const sourceDesc =
    doc?.description?.[lang] ??
    doc?.text?.[lang]
      ?.find((block: any) => block._type === 'block')
      ?.children?.[0]?.text?.split('.')?.[0]

  const sourceImage = doc?.imageCover ?? doc?.image

  const handleAutofill = () => {
    const patches: Parameters<typeof set>[0][] = []

    if (sourceTitle) patches.push(set(String(sourceTitle).slice(0, 80), ['metaTitle']))

    if (sourceDesc) patches.push(set(String(sourceDesc).slice(0, 160), ['metaDescription']))

    if (sourceImage) patches.push(set(sourceImage, ['metaImage']))

    if (patches.length) props.onChange(patches)
  }

  const canAutofill = !!(sourceTitle || sourceDesc || sourceImage)

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone={canAutofill ? 'primary' : 'transparent'} border>
        <Stack space={3}>
          <Button
            text="Auto-remplir depuis le document"
            icon={SparklesIcon}
            tone="primary"
            mode={canAutofill ? 'default' : 'ghost'}
            onClick={handleAutofill}
            disabled={!canAutofill}
          />
          {!canAutofill && (
            <Text size={1} muted>
              Remplissez d'abord le titre ou la description du document
            </Text>
          )}
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}
