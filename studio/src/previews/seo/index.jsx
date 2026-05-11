/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
// import sanityClient from 'part:@sanity/base/client'
// import Spinner from 'part:@sanity/components/loading/spinner'
import GoogleSearchResult from './GoogleSearchResult'
import TwitterCard from './TwitterCard'
import FacebookShare from './FacebookShare'

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
  }

  static defaultProps = {
    document: null,
  }

  render() {
    const {options, document} = this.props
    const {displayed} = document
    console.log(displayed)
    return (
      <>
        {/* <pre>{JSON.stringify(displayed.seo, null, 2)}</pre> */}

        {!displayed.seo && (
          <div
            style={{
              padding: '1em',
            }}
          >
            Champs Seo requis
          </div>
        )}

        {displayed.seo && (
          <>
            <GoogleSearchResult document={displayed} options={options} />
            <TwitterCard document={displayed} options={options} />
            <FacebookShare document={displayed} options={options} />
          </>
        )}
      </>
    )
  }
}

export default SeoPreviews
