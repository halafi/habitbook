// @flow

import * as React from 'react'
import ContentLoader from 'react-content-loader'

type Props = {
  windowWidth: number,
}

const Loader = ({ windowWidth }: Props) => (
  <ContentLoader height={480}>
    {windowWidth >= 600 ? (
      <React.Fragment>
        <circle cx="20" cy="25" r="10" />
        <rect x="35" y="18" rx="4" ry="4" width="85" height="14" />
        <rect x="10" y="50" rx="5" ry="5" width="400" height="200" />
        <rect x="10" y="260" rx="5" ry="5" width="400" height="150" />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <circle cx="30" cy="25" r="15" />
        <rect x="55" y="18" rx="4" ry="4" width="85" height="14" />
        <rect x="10" y="50" rx="5" ry="5" width="400" height="450" />
      </React.Fragment>
    )}
  </ContentLoader>
)

export default Loader
