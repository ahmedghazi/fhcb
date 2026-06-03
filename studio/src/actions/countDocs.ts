import {useState, useEffect} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionProps} from 'sanity'

export function customPublishAction(props: DocumentActionProps) {
  const {publish} = useDocumentOperation(props.id, props.type)
  const client = useClient({apiVersion: '2024-01-01'})
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)

      client
        .fetch(
          `{
          "totalFeuilletages": count(*[_type == "feuilletage"]),
          "totalImageImages": count(*[_type == "imageImages"])
        }`,
        )
        .then((stats) =>
          client
            .patch('settings')
            .set({
              totalFeuilletages: stats.totalFeuilletages,
              totalImageImages: stats.totalImageImages,
            })
            .commit(),
        )
        .catch((err) => console.error('Failed to update stats:', err))
    }
  }, [props.draft])

  return {
    label: isPublishing ? 'Publication…' : 'Publier',
    disabled: publish.disabled,
    onHandle: () => {
      setIsPublishing(true)
      publish.execute()
      props.onComplete()
    },
  }
}
