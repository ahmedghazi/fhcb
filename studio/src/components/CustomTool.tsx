import React from 'react'
import {Card, Text} from '@sanity/ui'
import {DashboardIcon} from '@sanity/icons'

type Props = {
  title: string
  name: string
}

// const CustomTool = (props: Props) => {
//   return <div>CustomTool</div>
// }

const CustomTool = () => {
  return {
    title: 'Ex Custom Tool',
    name: 'ex-custom-tool', // localhost:3333/my-custom-tool
    icon: DashboardIcon,
    component: (props: any) => (
      <Card padding={4}>
        <pre>{JSON.stringify(props)}</pre>
        <Text>My custom tool!</Text>
      </Card>
    ),
  }
}

export default CustomTool
