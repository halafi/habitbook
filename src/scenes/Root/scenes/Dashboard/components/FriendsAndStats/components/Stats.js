// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import * as R from 'ramda'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles/index'
import Avatar from 'material-ui/Avatar'
import PersonIcon from 'material-ui-icons/Person'
import List, { ListItem, ListItemText } from 'material-ui/List'

import type { Goals } from '../../../../../../../common/records/Goal'
import type { Users } from '../../../../../../../common/records/Firebase/User'

import { getElapsedDaysTillNow } from '../../../../../../../common/services/dateTimeUtils'
import {
  currentUserIdSelector,
  usersSelector,
} from '../../../../../../../common/selectors/firebaseSelectors'
import { selectedUserIdSelector } from '../../../../../../../common/selectors/dashboardSelectors'

type Props = {
  classes: Object,
  goals: {
    [userId: string]: Goals,
  },
  firebase: any,
  currentUserId: string,
  selectedUserId: string,
  users: Users,
}

const styles = theme => ({
  card: {
    width: '48%',
    marginTop: '24px',
  },
  primaryAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: theme.palette.primary['500'],
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
})

// TODO: player data
class Stats extends Component<Props> {
  render() {
    const { users, classes, goals, currentUserId, selectedUserId } = this.props

    const shownUserId = selectedUserId || currentUserId
    const profile = users && users[shownUserId]

    const currUserGoals = goals ? goals[shownUserId] : {}
    const currUserGoalsCount =
      currUserGoals && Object.keys(currUserGoals) ? Object.keys(currUserGoals).length : 0

    const totalTarget = R.reduce(
      (acc, goalId) => acc + Number(currUserGoals[goalId].target),
      0,
      R.keys(currUserGoals),
    )

    const totalDaysCompleted = R.reduce(
      (acc, goalId) => acc + getElapsedDaysTillNow(currUserGoals[goalId].started),
      0,
      R.keys(currUserGoals),
    )

    const percentDone = totalDaysCompleted / (totalTarget / 100)
    const percentDoneFormatted = Number.isNaN(percentDone) ? 0 : percentDone.toFixed(0)

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} type="headline" component="h2">
            <Avatar className={classes.primaryAvatar}>
              <PersonIcon />
            </Avatar>
            Statistics
          </Typography>
          <Typography component="div" paragraph>
            <List dense={false}>
              <ListItem>
                <ListItemText primary="Rank: Novice" secondary="Karma: -" />
              </ListItem>
              <ListItem>
                {profile && (
                  <ListItemText
                    primary={`Challenges completed: ${profile.goalsCompleted || 0}`}
                    secondary={`Ascensions: ${profile.ascensions || 0}`}
                  />
                )}
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Challenges active: ${currUserGoalsCount}`}
                  secondary={`Total completion: ${percentDoneFormatted}%`}
                />
              </ListItem>
            </List>
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals']),
  connect(state => ({
    users: usersSelector(state),
    goals: state.firebase.data.goals,
    currentUserId: currentUserIdSelector(state),
    selectedUserId: selectedUserIdSelector(state),
  })),
  withStyles(styles),
)(Stats)
