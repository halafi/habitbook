// @flow

import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty, isLoaded, withFirebase } from 'react-redux-firebase'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
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
  selectUserAction: string => void,
  selectedUserId: string, // uid
}

class NavBar extends React.Component<Props> {
  handleReload = () => {
    const { selectUserAction, selectedUserId } = this.props

    if (selectedUserId) {
      selectUserAction(null)
    }
  }

  render() {
    const { classes, firebase, profile, selectUserAction, selectedUserId } = this.props

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography type="title" className={classes.flex}>
            <Button onClick={this.handleReload}>Droid</Button>
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
