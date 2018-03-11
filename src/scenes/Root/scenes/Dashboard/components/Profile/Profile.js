// @flow

import React, { Component } from 'react'
import moment from 'moment'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles/index'
import Avatar from 'material-ui/Avatar'
import PersonIcon from 'material-ui-icons/Person'
import TrendingUpIcon from 'material-ui-icons/TrendingUp'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Tasks from './components/Tasks'

import type { Firebase } from '../../../../../../common/records/Firebase/Firebase'
import type { Goals } from '../../../../../../common/records/Goal'
import type { User } from '../../../../../../common/records/Firebase/User'

import { getFirstGoalStarted, getLastGoalReset } from './services/utils'
import {
  getExpRequiredForNextRank,
  getFlooredExp,
  getRankFromExp,
  getRankIdFromExp,
  getAvatarFromExp,
} from '../../../../../../common/records/Rank'

type Props = {
  classes: Object,
  firebase: Firebase,
  goals: Goals,
  profile: User,
  selectedUserId: string,
}

const styles = theme => ({
  root: {
    minHeight: '400px',
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
  displayInherit: {
    display: 'inherit',
  },
  progress: {
    height: '8px',
  },
})

class Profile extends Component<Props> {
  render() {
    const { classes, profile, goals, selectedUserId, firebase } = this.props

    const experience = profile.experience || 0
    const expRequiredNextRank = getExpRequiredForNextRank(experience)

    // global streak across all goals (!shared)
    const currentStreak = goals
      ? moment().diff(getLastGoalReset(goals) || getFirstGoalStarted(goals), 'd')
      : 0

    const percentOfLevelDone = (getFlooredExp(experience) / (expRequiredNextRank / 100)).toFixed(1)

    return (
      <Card className={classes.root}>
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
                {profile && (
                  <div className={classes.displayInherit}>
                    <Avatar src={getAvatarFromExp(experience)} />
                    <ListItemText
                      primary={`Rank ${getRankIdFromExp(experience) + 1}: ${getRankFromExp(
                        experience,
                      )}`}
                      secondary={
                        <span>
                          <progress
                            className={classes.progress}
                            value={getFlooredExp(experience)}
                            max={expRequiredNextRank}
                          />
                          <br />
                          <span>
                            {getFlooredExp(experience)} / {expRequiredNextRank} XP ({percentOfLevelDone}%)
                          </span>
                        </span>
                      }
                    />
                  </div>
                )}
              </ListItem>
              <ListItem>
                <Avatar>
                  <TrendingUpIcon />
                </Avatar>
                {profile && (
                  <ListItemText
                    primary={`Current streak: ${currentStreak}`}
                    secondary="Days without reset"
                  />
                )}
              </ListItem>
            </List>
            {!selectedUserId && profile && <Tasks profile={profile} firebase={firebase} />}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Profile)
