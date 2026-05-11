import React from 'react'
import {LaunchIcon} from '@sanity/icons'

type Props = {}
const ExternalLinkRenderer = (props: any) => {
  console.log(props)
  return (
    <span
      style={{
        border: '1px solid',
        padding: '0 1em',
        borderRadius: '1em',
      }}
    >
      {props.renderDefault(props)}
      {/*<a contentEditable={false} href={props.value.href}>
      <LaunchIcon />
    </a> */}
      {/* <a
        href={props.value.href}
        className="outline"
        style={{
          border: '1px solid',
          padding: '0 1em',
        }}
      >
        {props.children}
      </a> */}
    </span>
  )
}
export default ExternalLinkRenderer
