import React from 'react'
import {Button, Stack} from '@sanity/ui'
import sanityClient from 'part:@sanity/base/client'

const GenerateProduct = React.forwardRef((props, ref) => {
  const {document} = props

  const patch = async () => {
    console.log(document)
    // client
    //   .patch(document._id)
    //   .set({
    //     html: {
    //       asset: {
    //         _ref: upload._id,
    //         _type: "reference",
    //       },
    //     },
    //   })
    //   .commit()
    //   .then(() => {
    //     setLoaded("positive");
    //     setTimeout(() => {
    //       setLoaded("default");
    //     }, 2000);
    //   })
    //   .catch(() => {
    //     setLoaded("critical");
    //   });
  }

  return (
    <Stack space={3}>
      <Button
        fontSize={[1, 1, 2]}
        // tone={loaded}
        padding={[2, 2, 3]}
        text="Générer la newsletter"
        onClick={() => patch()}
      />
    </Stack>
  )
})

export default GenerateProduct
