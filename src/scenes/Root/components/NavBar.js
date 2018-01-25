// @flow

import React from 'react'
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
// import IconButton from 'material-ui/IconButton'
// import MenuIcon from 'material-ui-icons/Menu'

import type { Profile } from '../../../common/records/Firebase/Profile'

const styles = {
  flex: {
    flex: 1,
  },
  // menuButton: {
  //   marginLeft: -12,
  //   marginRight: 20,
  // },
}

type Props = {
  classes: any,
  firebase: any,
  profile: Profile,
}

class NavBar extends React.Component<Props> {
  render() {
    const { classes, firebase, profile } = this.props

    // TODO: make fixed
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          {/*<IconButton aria-label="Menu" className={classes.menuButton}>*/}
            {/*<MenuIcon />*/}
          {/*</IconButton>*/}
          <Typography type="title" className={classes.flex}>
            Droid
          </Typography>
          <div>
            {isLoaded(profile) &&
              isEmpty(profile) && (
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
            {isLoaded(profile) &&
              !isEmpty(profile) && (
                <Button
                  onClick={() => {
                    firebase.logout()
                  }}
                >
                  Logout ({profile.displayName})
                </Button>
              )}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withFirebase(withStyles(styles)(NavBar))
