// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import Grid from 'material-ui/Grid'

import GoalList from './components/GoalList/GoalList'
import { selectedUserIdSelector } from '../../../../common/selectors/dashboardSelectors'
import Loader from './components/Loader/Loader'
import Friends from './components/Friends/Friends'
import Profile from './components/Profile/Profile'

import type { Profile as ProfileType } from '../../../../common/records/Firebase/Profile'
import type { Goals } from '../../../../common/records/Goal'
import type { Users } from '../../../../common/records/Firebase/User'
import type { SharedGoals } from '../../../../common/records/SharedGoal'

import {
  goalsSelector,
  sharedGoalsSelector,
  usersSelector,
  currentUserIdSelector,
  profileSelector,
  userEmailsSelector,
} from '../../../../common/selectors/firebaseSelectors'
import { selectUser } from '../../../../common/actions/dashboardActions'

type Props = {
  currentUserId: string,
  firebase: any,
  goals: ?Goals,
  profile: ProfileType,
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

    if (!goals || !users) {
      return <Loader />
    }

    const shownUserId = selectedUserId || currentUserId
    const shownGoals = goals[shownUserId]

    const selectedUser = selectedUserId && users[selectedUserId]
    const selectedUserName = selectedUser && (selectedUser.userName || selectedUser.displayName)
    const title =
      selectedUser && selectedUserName
        ? `${selectedUserName.split(' ')[0]}'s Challenges`
        : 'Your Challenges'

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
