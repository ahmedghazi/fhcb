/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
// import sanityClient from "part:@sanity/base/client";
import {client} from '../../../sanity-client'
import {assemblePageUrl} from './frontendUtils'
import styles from './FacebookShare.module.css'

const builder = imageUrlBuilder(client)

const urlFor = (source) => {
  return builder.image(source)
}

class FacebookShare extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    width: PropTypes.number,
  }

  static defaultProps = {
    document: null,
    width: 500,
  }

  render() {
    const {document, width, options} = this.props
    const {title, seo} = document
    const websiteUrl = 'http://localhost:3000'
    const url = assemblePageUrl({document, options})
    const websiteUrlWithoutProtocol = url.split('://')[1]

    return (
      <div className={styles.seoItem}>
        <h3>Facebook preview</h3>
        {/* <div className={styles.facebookWrapper} style={{width}}>
          <div className={styles.facebookImageContainer}>
            {seo.metaImage && (
              <img
                className={styles.facebookCardImage}
                src={urlFor(seo.metaImage).width(500).url()}
              />
            )}
          </div>
          <div className={styles.facebookCardContent}>
            <div className={styles.facebookCardUrl}>{websiteUrlWithoutProtocol}</div>
            <div className={styles.facebookCardTitle}>
              <a href={websiteUrl}>{seo.metaTitle}</a>
            </div>
            <div className={styles.facebookCardDescription}>{seo.metaDescription}</div>
          </div>
        </div> */}
        <div className={styles.container}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${urlFor(seo.metaImage).width(500).url()})`,
            }}
          ></div>
          <div className={styles.text}>
            <span className={styles.url}>{url}</span>
            <div className={styles.content}>
              <div
                style={{
                  marginTop: '5px',
                }}
              >
                <div className={styles.title}>{seo.metaTitle}</div>
              </div>
              <span className={styles.description}>{seo.metaDescription}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FacebookShare
