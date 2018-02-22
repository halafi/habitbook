// @flow

import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty, isLoaded, withFirebase } from 'react-redux-firebase'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import type { Profile } from '../../../common/records/Firebase/Profile'
import { selectUser } from '../../../common/actions/dashboardActions'
import { selectedUserIdSelector } from '../../../common/selectors/dashboardSelectors'

const styles = {
  flex: {
    flex: 1,
  },
}

type Props = {
  classes: any,
  firebase: any,
  profile: Profile,
  selectUserAction: (?string) => void,
  selectedUserId: string,
}

type State = {
  anchorEl: any,
}

class NavBar extends React.Component<Props, State> {
  state = {
    anchorEl: null,
  }
  handleReload = () => {
    const { selectUserAction, selectedUserId } = this.props

    if (selectedUserId) {
      selectUserAction(null)
    }
  }

  handleMenu = event => this.setState({ anchorEl: event.currentTarget })
  handleClose = () => this.setState({ anchorEl: null })

  render() {
    const { classes, firebase, profile } = this.props
    const { anchorEl } = this.state

    const menuOpen = Boolean(anchorEl)
    const loggedIn = isLoaded(profile) && !isEmpty(profile)
    const unauthenticated = isLoaded(profile) && isEmpty(profile)

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" className={classes.flex}>
            <Button onClick={this.handleReload}>Habitbook</Button>
          </Typography>
          <div>
            {unauthenticated && (
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
            )}
          </div>
          {loggedIn && (
            <div>
              <IconButton
                aria-owns={menuOpen ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <Avatar src={profile.avatarUrl} />
              </IconButton>
              <Menu id="menu-appbar" open={menuOpen} onClose={this.handleClose} anchorEl={anchorEl}>
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem disabled onClick={this.handleClose}>My account</MenuItem>
                <MenuItem disabled onClick={() => firebase.logout()}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withFirebase,
  connect(
    state => ({
      selectedUserId: selectedUserIdSelector(state),
    }),
    dispatch => ({
      selectUserAction: bindActionCreators(selectUser, dispatch),
    }),
  ),
  withStyles(styles),
)(NavBar)
