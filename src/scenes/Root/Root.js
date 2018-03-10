// @flow

import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty } from 'react-redux-firebase'
import { withStyles } from 'material-ui/styles'

import NavBar from './components/NavBar'
import Intro from './scenes/Welcome/Welcome'
import Dashboard from './scenes/Dashboard/Dashboard'
import { profileSelector } from '../../common/selectors/firebaseSelectors'
import type { User } from '../../common/records/Firebase/User'

type Props = {
  profile: User,
  classes: Object,
}

const styles = {
  root: {
    maxWidth: '900px',
    padding: '10px',
    margin: '0 auto',
  },
}

class Root extends Component<Props> {
  render() {
    const { profile, classes } = this.props

    return (
      <div>
        <NavBar profile={profile} />
        <div className={classes.root}>
          {profile.isLoaded && <div>{isEmpty(profile) ? <Intro /> : <Dashboard />}</div>}
        </div>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  connect(state => ({
    profile: profileSelector(state),
  })),
)(Root)
