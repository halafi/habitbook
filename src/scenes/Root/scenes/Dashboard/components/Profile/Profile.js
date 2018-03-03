// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import moment from 'moment'
import * as R from 'ramda'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles/index'
import Avatar from 'material-ui/Avatar'
import PersonIcon from 'material-ui-icons/Person'
import TrendingUpIcon from 'material-ui-icons/TrendingUp'
import Tooltip from 'material-ui/Tooltip'
import List, { ListItem, ListItemText } from 'material-ui/List'

import type { Goals } from '../../../../../../common/records/Goal'
import type { Users } from '../../../../../../common/records/Firebase/User'

import { getFirstGoalStarted, getLastGoalReset } from './services/utils'
import { getElapsedDaysTillNow } from '../../../../../../common/services/dateTimeUtils'
import {
  currentUserIdSelector,
  usersSelector,
} from '../../../../../../common/selectors/firebaseSelectors'
import { selectedUserIdSelector } from '../../../../../../common/selectors/dashboardSelectors'
import {
  getExpRequiredForNextRank,
  getFlooredExp,
  getRankFromExp,
  getRankIdFromExp,
  getAvatarFromExp,
} from '../../../../../../common/records/Rank'

type Props = {
  classes: Object,
  goals: {
    [userId: string]: Goals,
  },
  currentUserId: string,
  selectedUserId: string,
  users: Users,
}

const styles = theme => ({
  card: {
    height: '400px',
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

class Profile extends Component<Props> {
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

    // exp
    const experience = (profile && profile.experience) || 0
    const expRequiredForNextRank = getExpRequiredForNextRank(experience)
    // TODO: days without reset
    const firstGoalStarted = getFirstGoalStarted(currUserGoals)
    const lastGoalReset = getLastGoalReset(currUserGoals)

    const countFrom = lastGoalReset || firstGoalStarted
    const currentStreak = moment().diff(countFrom, 'd')

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} type="headline" component="h2">
            <Avatar className={classes.primaryAvatar}>
              <PersonIcon />
            </Avatar>
            Profile
          </Typography>
          <Typography component="div" paragraph>
            <List dense={false}>
              <ListItem>
                {profile && [
                  <Avatar key="avatar" src={getAvatarFromExp(experience)} />,
                  <ListItemText
                    key="ranktext"
                    primary={`Rank ${getRankIdFromExp(experience)}: ${getRankFromExp(experience)}`}
                    secondary={
                      <Tooltip
                        id="tooltip-progress-profile"
                        title={`${expRequiredForNextRank -
                          getFlooredExp(experience)} XP required for next rank (${experience /
                          (expRequiredForNextRank / 100)}% complete)`}
                        placement="right"
                      >
                        <progress value={getFlooredExp(experience)} max={expRequiredForNextRank} />
                      </Tooltip>
                    }
                  />,
                ]}
              </ListItem>
              <ListItem>
                <Avatar>
                  <TrendingUpIcon />
                </Avatar>
                {profile && (
                  <ListItemText
                    primary={`Current streak: ${currentStreak} days`}
                    secondary="Days without reset"
                  />
                )}
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
)(Profile)
