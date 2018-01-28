// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import { withStyles } from 'material-ui/styles'

import GoalList from './components/GoalList/GoalList'
import FriendsAndStats from './components/FriendsAndStats/FriendsAndStats'
import { selectedUserIdSelector } from '../../../../common/selectors/dashboardSelectors'

import type { Goals } from '../../../../common/records/Goal'
import type { Users } from '../../../../common/records/Firebase/User'

import { goalsSelector, usersSelector } from '../../../../common/selectors/firebaseSelectors'

type Props = {
  classes: Object,
  goals: Goals,
  users: Users,
  currentUserId: string,
  selectedUserId: ?string,
}

const styles = {
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh - 188px)',
  },
}

// TODO: table with history - transparent profile
class Dashboard extends Component<Props> {
  render() {
    const { goals, users, selectedUserId, currentUserId, classes } = this.props

    let shownGoals
    if (goals) {
      shownGoals = selectedUserId ? goals[selectedUserId] : goals[currentUserId]
    }

    const title =
      users && selectedUserId
        ? `${users[selectedUserId].displayName.split(' ')[0]}'s Challenges`
        : 'Your Challenges'

    return (
      <div className={classes.contentWrapper}>
        <GoalList title={title} goals={shownGoals} readOnly={Boolean(selectedUserId)} />
        <FriendsAndStats />
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  firebaseConnect(['goals']),
  connect(state => ({
    users: usersSelector(state),
    goals: goalsSelector(state),
    currentUserId: state.firebase.auth.uid,
    selectedUserId: selectedUserIdSelector(state),
  })),
)(Dashboard)
