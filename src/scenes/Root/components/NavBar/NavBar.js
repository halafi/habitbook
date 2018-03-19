// @flow

import React from 'react'
import { isEmpty, isLoaded } from 'react-redux-firebase'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import type { User } from '../../../../common/records/Firebase/User'
import type { Firebase } from '../../../../common/records/Firebase/Firebase'
import EditProfileModal from './components/EditProfileModal'

const styles = {
  flex: {
    flex: 1,
  },
}

const NAVBAR_MODALS = {
  PROFILE: 'profile',
}

type NavbarModal = $Values<typeof NAVBAR_MODALS>

type Props = {
  classes: Object,
  firebase: Firebase,
  profile: User,
  currentUserId: string,
  selectUserAction: (?string) => void,
  selectedUserId: string,
}

type State = {
  anchorEl: any,
  modal: ?NavbarModal,
}

class NavBar extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    modal: null,
  }
  handleReload = () => {
    const { selectUserAction, selectedUserId } = this.props

    if (selectedUserId) {
      selectUserAction(null)
    }
  }

  handleMenu = event => this.setState({ anchorEl: event.currentTarget })
  handleCloseMenu = () => this.setState({ anchorEl: null })
  handleOpenModal = (modal: NavbarModal) => {
    this.setState({ modal, anchorEl: null })
  }
  handleCloseModal = () => this.setState({ modal: null })

  render() {
    const { classes, firebase, profile, currentUserId } = this.props
    const { anchorEl, modal } = this.state

    const menuOpen = Boolean(anchorEl)
    const loggedIn = isLoaded(profile) && !isEmpty(profile)
    const unauthenticated = isLoaded(profile) && isEmpty(profile)

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography type="title" className={classes.flex}>
            <Button onClick={this.handleReload}>Habitbook</Button>
          </Typography>
          {loggedIn && (
            <EditProfileModal
              open={modal === NAVBAR_MODALS.PROFILE}
              onClose={this.handleCloseModal}
              profile={profile}
              firebase={firebase}
              currentUserId={currentUserId}
            />
          )}
          {unauthenticated && (
            <div>
              <Button
                onClick={() => {
                  firebase.login({
                    provider: 'google',
                    type: 'redirect',
                  })
                }}
              >
                Login
              </Button>
            </div>
          )}
          {loggedIn && (
            <div>
              <IconButton
                aria-owns={menuOpen ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <Avatar src={profile.photoURL || profile.avatarUrl} />
              </IconButton>
              <Menu
                id="menu-appbar"
                open={menuOpen}
                onClose={this.handleCloseMenu}
                anchorEl={anchorEl}
              >
                <MenuItem onClick={() => this.handleOpenModal(NAVBAR_MODALS.PROFILE)}>
                  Profile
                </MenuItem>
                <MenuItem disabled onClick={this.handleCloseMenu}>
                  My account
                </MenuItem>
                <MenuItem onClick={() => firebase.logout()}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(NavBar)
