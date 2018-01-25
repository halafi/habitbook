// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import type { Dispatch } from 'redux'

import NavBar from './components/NavBar'
import Intro from './scenes/Welcome/Welcome'
import Dashboard from './scenes/Dashboard/Dashboard'
import type { Auth } from '../../common/records/Firebase/Auth'
import type { Profile } from '../../common/records/Firebase/Profile'

const ContentWrapper = styled.div`
  margin: 0 auto;
  max-width: 900px;
  padding: 24px;
  margin-bottom: 100px;
`

type Props = {
  auth: Auth,
  profile: Profile,
  dispatch: Dispatch<*>,
}

class Root extends Component<Props> {
  render() {
    const { profile, auth } = this.props

    return (
      <div>
        <NavBar profile={profile} />
        <ContentWrapper>
          {profile.isLoaded && (
            <div>
              {profile.isEmpty ? (
                <Intro />
              ) : (
                <Dashboard createdAt={auth.createdAt} profile={profile} />
              )}
            </div>
          )}
        </ContentWrapper>
      </div>
    )
  }
}

export default connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile,
}))(Root)
