import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionProps} from 'sanity'

function refreshTotals(client: ReturnType<typeof useClient>) {
  console.log('refreshTotals refreshTotals')
  client
    .fetch(
      `{
      "totalFeuilletages": count(*[_type == "feuilletage"]),
      "totalImageImages": count(*[_type == "imageImages"]),
      "totalSerieThematique": count(*[_type == "serieThematique"])
    }`,
    )
    .then((stats) =>
      client
        .patch('settings')
        .set({
          totalFeuilletages: stats.totalFeuilletages,
          totalImageImages: stats.totalImageImages,
          totalSerieThematique: stats.totalSerieThematique,
        })
        .commit(),
    )
    .catch((err) => console.error('Failed to update stats:', err))
}

export function customPublishAction(props: DocumentActionProps) {
  const {publish} = useDocumentOperation(props.id, props.type)
  const client = useClient({apiVersion: '2024-01-01'})

  return {
    label: 'Publier',
    disabled: publish.disabled,
    onHandle: () => {
      publish.execute()
      props.onComplete()
      setTimeout(() => refreshTotals(client), 1000)
    },
  }
}
