// @flow

import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'

import NavBar from './components/NavBar'
import Intro from './scenes/Welcome/Welcome'
import Dashboard from './scenes/Dashboard/Dashboard'
import type { Profile } from '../../common/records/Firebase/Profile'

const styles = {
  root: {
    margin: '0 auto',
    maxWidth: '900px',
    padding: '24px',
    marginBottom: '100px',
  },
}

type Props = {
  profile: Profile,
  classes: Object,
}

class Root extends Component<Props> {
  render() {
    const { profile, classes } = this.props

    return (
      <div>
        <NavBar profile={profile} />
        <div className={classes.root}>
          {profile.isLoaded && <div>{profile.isEmpty ? <Intro /> : <Dashboard />}</div>}
        </div>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  connect(({ firebase: { profile } }) => ({
    profile,
  })),
)(Root)
