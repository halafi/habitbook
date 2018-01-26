// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import * as R from 'ramda'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Avatar from 'material-ui/Avatar'
import PeopleIcon from 'material-ui-icons/People'
import { usersSelector } from '../../../../../../../common/selectors/firebaseSelectors'
import type { Profile } from '../../../../../../../common/records/Firebase/Profile'
import type { Users, User } from '../../../../../../../common/records/Firebase/User'

import type { Goals } from '../../../../../../../common/records/Goal'

type Props = {
  classes: Object,
  users: Users,
  // created: string,
  // profile: Profile,
  // goals: {
  //   [userId: string]: GoalList,
  // },
  // firebase: any,
  // currentUserId: string,
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

class Friends extends Component<Props> {
  render() {
    const { classes, users } = this.props

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} type="headline" component="h2">
            <Avatar className={classes.primaryAvatar}>
              <PeopleIcon />
            </Avatar>
            Friends
          </Typography>
          <Typography component="div" paragraph>
            <List>
              {users &&
                Object.keys(users).map(userId => {
                  const user: User = users[userId]

                  return (
                    <ListItem key={user.email} dense button className={classes.listItem}>
                      <Avatar alt={user.displayName} src={user.avatarUrl} />
                      <ListItemText primary={user.displayName} />
                      {/*<ListItemSecondaryAction>*/}
                      {/*<Checkbox*/}
                      {/*onChange={this.handleToggle(value)}*/}
                      {/*checked={this.state.checked.indexOf(value) !== -1}*/}
                      {/*/>*/}
                      {/*</ListItemSecondaryAction>*/}
                    </ListItem>
                  )
                })}
            </List>
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals', 'presence', 'users']),
  connect(state => ({
    users: usersSelector(state),
    // goals: firebase.data.goals,
    // currentUserId: firebase.auth.uid,
  })),
  withStyles(styles),
)(Friends)
