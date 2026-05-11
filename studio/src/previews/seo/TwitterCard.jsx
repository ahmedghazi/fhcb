/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
// import sanityClient from "part:@sanity/base/client";
import {client} from '../../../sanity-client'
import {assemblePageUrl} from './frontendUtils'
import styles from './TwitterCard.module.css'

const builder = imageUrlBuilder(client)

const urlFor = (source) => {
  return builder.image(source)
}

const author = {
  name: 'Author',
  handle: 'Author',
  image: 'https://www.classifapp.com/wp-content/uploads/2017/09/avatar-placeholder.png',
}

class TwitterCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    // width: PropTypes.number,
    route: PropTypes.object,
  }

  static defaultProps = {
    document: null,
    width: 500,
  }

  render() {
    const {document, options} = this.props
    const {title, seo} = document
    const url = assemblePageUrl({document, options})
    const websiteUrlWithoutProtocol = url.split('://')[1]
    return (
      <div className={styles.seoItem}>
        <h3>Twitter preview</h3>
        {/* <pre>{JSON.stringify(document)}</pre> */}
        <div className={styles.container}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${urlFor(seo.metaImage).width(500).url()})`,
            }}
          ></div>

          <div className={styles.text}>
            <span className={styles.title}>{seo.metaTitle}</span>
            <span className={styles.description}>{seo.metaDescription}</span>
            <span className={styles.url}>{url}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default TwitterCard
