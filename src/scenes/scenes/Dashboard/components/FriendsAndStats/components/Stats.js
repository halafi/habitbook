// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles/index'

import type { Profile } from '../../../../../records/Profile'

import type { Goals } from '../../../../../records/Goal'

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

const styles = {
  card: {
    width: '48%',
    marginTop: '24px',
  },
}

// TODO: player data
class Stats extends Component<Props> {
  render() {
    const { classes, created, profile, goals, currentUserId } = this.props

    const currUserGoals = goals ? goals[currentUserId] : {}
    const currUserGoalsCount = Object.keys(currUserGoals).length

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2">
            Statistics
          </Typography>
          <Typography component="div" paragraph>
            <ul>
              <li>Karma: -</li>
              <li>Goals completed: -</li>
              <li>Goals in progress: {currUserGoalsCount}</li>
              <li>Member since: {created}</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals']),
  connect(({ firebase }) => ({
    goals: firebase.data.goals,
    currentUserId: firebase.auth.uid,
  })),
  withStyles(styles),
)(Stats)
