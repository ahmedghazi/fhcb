// CustomDetails.tsx
import {useEffect, useRef} from 'react'

export function CustomDetails(props: any) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const relabel = () =>
      ref.current?.querySelectorAll('label, [data-ui="Text"]').forEach((el) => {
        if (el.textContent?.trim() === 'Description') el.textContent = 'Auteur'
        // if (el.textContent?.trim() === 'Credit') el.textContent = 'Credit (Adagp 2025)'
        // if (el.textContent?.trim() === 'Credit') el.textContent = 'Credit (Adagp 2025)'
      })
    relabel()
    const obs = new MutationObserver(relabel) // utile pour les onglets FR/EN
    if (ref.current) obs.observe(ref.current, {childList: true, subtree: true})
    return () => obs.disconnect()
  }, [])
  return <div ref={ref}>{props.renderDefaultDetails(props)}</div>
}
