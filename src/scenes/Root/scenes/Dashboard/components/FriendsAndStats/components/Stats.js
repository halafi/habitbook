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

import type { Profile } from '../../../../../../../common/records/Firebase/Profile'
import type { Goals } from '../../../../../../../common/records/Goal'

import { getElapsedDaysTillNow } from '../../../../../../../common/services/dateTimeUtils'

type Props = {
  classes: Object,
  created: string,
  profile: Profile,
  goals: {
    [userId: string]: Goals,
  },
  firebase: any,
  currentUserId: string,
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
    const { classes, created, profile, goals, currentUserId } = this.props

    const currUserGoals = goals ? goals[currentUserId] : {}
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
                <ListItemText
                  primary={`Challenges completed: ${profile.goalsCompleted || 0}`}
                  secondary={`Ascensions: ${profile.ascensions || 0}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Challenges active: ${currUserGoalsCount}`}
                  secondary={`Total completion: ${percentDoneFormatted}%`}
                />
              </ListItem>
            </List>
            {/*Member since: {created}*/}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals']),
  connect(({ firebase }) => ({
    profile: firebase.profile,
    goals: firebase.data.goals,
    currentUserId: firebase.auth.uid,
  })),
  withStyles(styles),
)(Stats)
