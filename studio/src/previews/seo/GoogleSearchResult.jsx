/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import {assemblePageUrl, toPlainText} from './frontendUtils'
import Truncate from './Truncate'
import styles from './GoogleSearchResult.module.css'

class GoogleSearchResult extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    width: PropTypes.number,
    route: PropTypes.object,
  }

  static defaultProps = {
    document: null,
    width: 500,
  }

  render() {
    const {document, options} = this.props
    const {seo} = document
    const url = assemblePageUrl({document, options})

    return (
      <div className={styles.seoItem}>
        {/* <pre>{JSON.stringify(styles)}</pre> */}
        <div className={styles.googleWrapper}>
          <h3>Google preview</h3>
          <div className="card-seo-google">
            <span className={styles.title}>{seo.metaTitle}</span>
            <div className={styles.url}>
              <span className="card-seo-google__url-title js-preview-domain">{url}</span>
            </div>
            <span className={styles.description}>{seo.metaDescription}</span>
          </div>

          {/* <div className={styles.title}>{seo.metaTitle}</div>
          <div className={styles.url}>{url}</div>
          {seo.metaDescription && (
            <Truncate maxChars={300} className={styles.description}>
              {seo.metaDescription}
            </Truncate>
          )} */}
        </div>
      </div>
    )
  }
}

export default GoogleSearchResult
