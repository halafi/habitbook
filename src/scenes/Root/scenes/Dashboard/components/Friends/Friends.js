// @flow

import React, { Component } from 'react'

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

import type { Users, User } from '../../../../../../common/records/Firebase/User'
import type { Firebase } from '../../../../../../common/records/Firebase/Firebase'

import { getUserIdByEmail } from '../../../../../../common/records/Firebase/User'
import { getRankFromExp, getRankIdFromExp } from '../../../../../../common/records/Rank'
import { emailValid } from '../../../../../../common/services/validators'

type Props = {
  classes: Object,
  currentUserId: string,
  firebase: Firebase,
  profile: User,
  selectedUserId: string, // uid
  selectUser: (?string) => void,
  userEmails: Array<string>,
  users: Users,
}

type State = {
  email: string,
}

const styles = theme => ({
  card: {
    paddingBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  friendsWrapper: {
    overflowY: 'auto',
    height: '216px',
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
        const friendId = getUserIdByEmail(users, email)
        newFriendList.push(friendId)

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

  handleDeleteFriend = (id: string) => {
    const { profile, firebase, selectUser } = this.props

    const oldFriendList = profile.friends || []
    const newFriendList = oldFriendList.filter(e => e !== id)

    firebase.updateProfile({
      friends: newFriendList,
    })

    selectUser(null)
  }

  handleSelectUser = userId => {
    const { currentUserId, selectUser, selectedUserId } = this.props
    if (userId.includes(currentUserId) || userId === selectedUserId) {
      selectUser(null)
    } else {
      selectUser(userId)
    }
  }

  render() {
    const { classes, users, currentUserId, profile } = this.props
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
            <List classes={{ root: classes.friendsWrapper }}>
              {users &&
                profile &&
                Object.keys(users).map(userId => {
                  const user: User = users[userId]

                  if (!profile.friends || (profile.friends && !profile.friends.includes(userId))) {
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
                      <Avatar
                        alt={user.userName || user.displayName}
                        src={user.photoURL || user.avatarUrl}
                      />
                      <ListItemText
                        secondary={`Rank ${getRankIdFromExp(user.experience || 0) +
                          1} - ${getRankFromExp(user.experience || 0)}`}
                        primary={user.userName || user.displayName}
                      />
                      <ListItemSecondaryAction>
                        {userId !== currentUserId && (
                          <IconButton
                            onClick={() => this.handleDeleteFriend(userId)}
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

export default withStyles(styles)(Friends)
