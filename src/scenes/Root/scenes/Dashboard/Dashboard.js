// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from 'material-ui/styles'
import { firebaseConnect } from 'react-redux-firebase'
import Grid from 'material-ui/Grid'

import GoalList from './components/GoalList/GoalList'
import { selectedUserIdSelector } from '../../../../common/selectors/dashboardSelectors'
import Loader from './components/GoalList/components/Loader/Loader'
import Friends from './components/Friends'
import Profile from './components/Profile'

import type { Goals } from '../../../../common/records/Goal'
import type { Users } from '../../../../common/records/Firebase/User'
import type { SharedGoals } from '../../../../common/records/SharedGoal'

import {
  goalsSelector,
  sharedGoalsSelector,
  usersSelector,
  currentUserIdSelector,
} from '../../../../common/selectors/firebaseSelectors'

type Props = {
  currentUserId: string,
  goals: Goals,
  selectedUserId: ?string,
  sharedGoals: SharedGoals,
  users: Users,
  classes: Object,
}

const styles = {
  root: {
    flexGrow: 1,
  },
}

class Dashboard extends Component<Props> {
  render() {
    const { goals, sharedGoals, users, selectedUserId, currentUserId, classes } = this.props

    let shownGoals
    if (goals) {
      shownGoals = selectedUserId ? goals[selectedUserId] : goals[currentUserId]
    }

    const user = users && selectedUserId && users[selectedUserId]
    const name = user && (user.userName || user.displayName)
    // TODO: do not split userName
    const title = user && name ? `${name.split(' ')[0]}'s Challenges` : 'Your Challenges'

    if (!goals) {
      return <Loader />
    }

    return (
      <div className={classes.root}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <GoalList
              title={title}
              sharedGoals={sharedGoals}
              goals={shownGoals}
              selectedUserId={selectedUserId}
              readOnly={Boolean(selectedUserId)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" alignItems="center" justify="center">
              <Grid item xs={12} sm={6}>
                <Profile />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Friends />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  firebaseConnect(['sharedGoals', 'goals']),
  connect(state => ({
    currentUserId: currentUserIdSelector(state),
    goals: goalsSelector(state),
    selectedUserId: selectedUserIdSelector(state),
    sharedGoals: sharedGoalsSelector(state),
    users: usersSelector(state),
  })),
)(Dashboard)
