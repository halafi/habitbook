// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import Grid from 'material-ui/Grid'

import GoalList from './components/GoalList/GoalList'
import { selectedUserIdSelector } from './services/selectors/dashboardSelectors'
import Loader from './components/Loader/Loader'
import Friends from './components/Friends/Friends'
import Profile from './components/Profile/Profile'

import type { Firebase } from '../../../../common/records/Firebase/Firebase'
import type { Goals } from '../../../../common/records/Goal'
import type { User, Users } from '../../../../common/records/Firebase/User'
import type { SharedGoals } from '../../../../common/records/SharedGoal'

import {
  goalsSelector,
  sharedGoalsSelector,
  usersSelector,
  currentUserIdSelector,
  profileSelector,
  userEmailsSelector,
} from '../../../../common/selectors/firebaseSelectors'
import { selectUser } from './services/actions/dashboardActions'

type Props = {
  currentUserId: string,
  firebase: Firebase,
  goals: ?Goals,
  profile: User,
  selectedUserId: ?string,
  selectUserAction: (?string) => void,
  sharedGoals: SharedGoals,
  userEmails: Array<string>,
  users: ?Users,
}

class Dashboard extends Component<Props> {
  render() {
    const {
      currentUserId,
      firebase,
      goals,
      profile,
      selectedUserId,
      selectUserAction,
      sharedGoals,
      userEmails,
      users,
    } = this.props

    if (!users) {
      return <Loader windowWidth={window.innerWidth > 0 ? window.innerWidth : screen.width} /> // eslint-disable-line no-restricted-globals
    }

    const shownUserId = selectedUserId || currentUserId
    const shownGoals = goals ? goals[shownUserId] : []

    let title = 'My Challenges'
    if (selectedUserId && users[selectedUserId]) {
      const selectedUser = users[selectedUserId]
      title = selectedUser.userName
        ? `${selectedUser.userName}'s Challenges`
        : `${selectedUser.displayName.split(' ')[0]}'s Challenges`
    }

    return (
      <Grid container direction="row">
        <Grid item xs={12}>
          <GoalList
            currentUserId={currentUserId}
            firebase={firebase}
            goals={shownGoals}
            profile={profile}
            readOnly={Boolean(selectedUserId)}
            selectedUserId={selectedUserId}
            sharedGoals={sharedGoals}
            title={title}
            users={users}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
              <Profile
                firebase={firebase}
                goals={shownGoals}
                profile={users[shownUserId]}
                selectedUserId={selectedUserId}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Friends
                firebase={firebase}
                currentUserId={currentUserId}
                profile={profile}
                selectedUserId={selectedUserId}
                selectUser={selectUserAction}
                userEmails={userEmails}
                users={users}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  firebaseConnect(['sharedGoals', 'goals', 'users']),
  connect(
    state => ({
      currentUserId: currentUserIdSelector(state),
      goals: goalsSelector(state),
      profile: profileSelector(state),
      selectedUserId: selectedUserIdSelector(state),
      sharedGoals: sharedGoalsSelector(state),
      userEmails: userEmailsSelector(state),
      users: usersSelector(state),
    }),
    dispatch => ({
      selectUserAction: bindActionCreators(selectUser, dispatch),
    }),
  ),
)(Dashboard)
