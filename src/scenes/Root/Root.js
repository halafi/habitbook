// @flow

import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isEmpty, withFirebase } from 'react-redux-firebase'
import { withStyles } from 'material-ui/styles'

import NavBar from './components/NavBar/NavBar'
import Intro from './scenes/Welcome/Welcome'
import Dashboard from './scenes/Dashboard/Dashboard'
import { currentUserIdSelector, profileSelector } from '../../common/selectors/firebaseSelectors'
import type { User } from '../../common/records/Firebase/User'
import type { Firebase } from '../../common/records/Firebase/Firebase'
import { selectUser } from './scenes/Dashboard/services/actions/dashboardActions'
import { selectedUserIdSelector } from './scenes/Dashboard/services/selectors/dashboardSelectors'

type Props = {
  firebase: Firebase,
  profile: User,
  selectUserAction: (?string) => void,
  currentUserId: string,
  selectedUserId: string,
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
    const {
      firebase,
      profile,
      selectUserAction,
      selectedUserId,
      currentUserId,
      classes,
    } = this.props

    return (
      <div>
        <NavBar
          firebase={firebase}
          profile={profile}
          selectedUserId={selectedUserId}
          selectUserAction={selectUserAction}
          currentUserId={currentUserId}
        />
        <div className={classes.root}>
          {profile.isLoaded && <div>{isEmpty(profile) ? <Intro /> : <Dashboard />}</div>}
        </div>
      </div>
    )
  }
}

export default compose(
  withFirebase,
  withStyles(styles),
  connect(
    state => ({
      profile: profileSelector(state),
      currentUserId: currentUserIdSelector(state),
      selectedUserId: selectedUserIdSelector(state),
    }),
    dispatch => ({
      selectUserAction: bindActionCreators(selectUser, dispatch),
    }),
  ),
)(Root)
