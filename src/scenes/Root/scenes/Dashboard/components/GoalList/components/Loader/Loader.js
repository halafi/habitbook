// @flow

import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = () => (
  <ContentLoader height={480}>
    <circle cx="20" cy="25" r="10" />
    <rect x="35" y="18" rx="4" ry="4" width="85" height="14" />
    <rect x="10" y="50" rx="5" ry="5" width="400" height="50" />
  </ContentLoader>
)

export default Loader
