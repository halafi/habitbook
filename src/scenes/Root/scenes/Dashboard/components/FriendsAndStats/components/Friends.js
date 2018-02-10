// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import { firebaseConnect } from 'react-redux-firebase'
import * as R from 'ramda'

import Card, { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import PeopleIcon from 'material-ui-icons/People'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import {
  currentUserIdSelector,
  usersSelector,
  userEmailsSelector,
} from '../../../../../../../common/selectors/firebaseSelectors'
import { selectedUserIdSelector } from '../../../../../../../common/selectors/dashboardSelectors'
import type { Profile } from '../../../../../../../common/records/Firebase/Profile'
import type { Users, User } from '../../../../../../../common/records/Firebase/User'
import type { Goals } from '../../../../../../../common/records/Goal'
import { selectUser } from '../../../../../../../common/actions/dashboardActions'
import { getRank, getRankId } from '../../../../../../../common/records/Rank'
import { getGoalVisibility } from '../../../../../../../common/records/GoalVisibility'
import { emailValid } from '../../../../../../../common/services/validators'
import { getAscensionKarma } from '../../GoalList/services/helpers'

type Props = {
  classes: Object,
  users: Users,
  userEmails: Array<string>,
  // created: string,
  profile: Profile,
  // goals: {
  //   [userId: string]: GoalList,
  // },
  firebase: any,
  currentUserId: string,
  selectUserAction: string => void,
  selectedUserId: string, // uid
}

type State = {
  email: string,
}

const styles = theme => ({
  card: {
    width: '48%',
    marginTop: '24px',
    paddingBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  formWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 16px',
    width: '100%',
  },
  button: {
    alignSelf: 'center',
    marginTop: '16px',
  },
  textField: {
    marginLeft: '8px',
    marginRight: '8px',
    minWidth: '125px',
  },
})

class Friends extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      email: '',
    }
  }

  handleChange = (fieldName: string, value: string) => {
    this.setState({
      [fieldName]: value,
    })
  }

  handleSubmit = (ev: any) => {
    ev.preventDefault()

    const { userEmails, users, currentUserId, profile, firebase } = this.props
    const { email } = this.state

    if (userEmails.includes(email) && email !== users[currentUserId].email) {
      const newFriendList = profile.friends || []
      if (newFriendList.includes(email)) {
        alert('user is already your friend')
      } else {
        newFriendList.push(email)

        // TODO: put friend count to stats
        firebase.updateProfile({
          friends: newFriendList,
        })
      }
    } else {
      alert('email not found')
    }

    this.setState({
      email: '',
    })
  }

  handleDeleteFriend = (email: string) => {
    const { profile, firebase, selectUserAction } = this.props

    const oldFriendList = profile.friends || []
    const newFriendList = oldFriendList.filter(e => e !== email)

    firebase.updateProfile({
      friends: newFriendList,
    })

    selectUserAction(null)
  }

  handleSelectUser = userId => {
    const { currentUserId, selectUserAction, selectedUserId } = this.props
    if (userId.includes(currentUserId) || userId === selectedUserId) {
      selectUserAction(null)
    } else {
      selectUserAction(userId)
    }
  }

  render() {
    const { classes, users, selectedUserId, currentUserId, profile } = this.props
    const { email } = this.state

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
                profile &&
                Object.keys(users).map(userId => {
                  const user: User = users[userId]

                  if (!profile.friends || !profile.friends.includes(user.email)) {
                    return null
                  }

                  return (
                    <ListItem
                      onClick={() => this.handleSelectUser(userId)}
                      key={user.email}
                      dense
                      button
                      className={classes.listItem}
                    >
                      <Avatar alt={user.displayName} src={user.avatarUrl} />
                      <ListItemText
                        secondary={`Rank ${getRankId(getRank(user.karma))} - ${getRank(
                          user.karma,
                        )}`}
                        primary={user.displayName}
                      />
                      <ListItemSecondaryAction>
                        {userId !== currentUserId && (
                          <IconButton
                            onClick={() => this.handleDeleteFriend(user.email)}
                            aria-label="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
            </List>
          </Typography>
        </CardContent>
        <CardActions>
          <form onSubmit={this.handleSubmit} className={classes.formWrapper}>
            <TextField
              id="friendEmail"
              label="Your friend email"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="ilove@unicorns.com"
              margin="normal"
              className={classes.textField}
              value={email}
              onChange={ev => this.handleChange('email', ev.target.value)}
            />
            <Button
              disabled={!emailValid(email)}
              className={classes.button}
              type="submit"
              raised
              color="primary"
            >
              Add
            </Button>
          </form>
        </CardActions>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals', 'presence', 'users']),
  connect(
    state => ({
      users: usersSelector(state),
      userEmails: userEmailsSelector(state),
      profile: state.firebase.profile,
      // goals: firebase.data.goals,
      currentUserId: currentUserIdSelector(state),
      selectedUserId: selectedUserIdSelector(state),
    }),
    dispatch => ({
      selectUserAction: bindActionCreators(selectUser, dispatch),
    }),
  ),
  withStyles(styles),
)(Friends)
