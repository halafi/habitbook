// @flow

import * as React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'

import type { Profile } from '../../../../common/records/Firebase/Profile'

type Props = {
  firebase: any,
  profile: Profile,
  open: boolean,
  onClose: () => void,
}

type State = {
  name: string,
  url: string,
}

class EditProfileModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: props.profile.displayName,
      url: props.profile.photoURL || '',
    }
  }

  formValid = (): boolean => {
    const { name } = this.state

    // TODO validate, file upload
    return name.length >= 1
  }

  handleSubmit = (ev: any): void => {
    ev.preventDefault()

    const { firebase, onClose } = this.props
    const { name, url } = this.state

    if (!this.formValid()) {
      return
    }

    firebase.updateProfile({
      displayName: name,
      photoURL: url,
    })

    onClose()
  }

  handleClose = (): void => {
    const { onClose, profile } = this.props

    this.setState({
      name: profile.displayName,
      url: profile.photoURL || '',
    })

    onClose()
  }

  render() {
    const { open } = this.props
    const { name, url } = this.state

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Display name"
              value={name}
              onChange={ev => this.setState({ name: ev.target.value })}
              margin="dense"
              fullWidth
            />
            <TextField
              id="photourl"
              label="Avatar Url"
              value={url}
              onChange={ev => this.setState({ url: ev.target.value })}
              margin="dense"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!this.formValid()}
            onClick={this.handleSubmit}
            color="primary"
            autoFocus
          >
            Save
          </Button>
          <Button onClick={this.handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default compose(
  withFirebase,
  connect(state => ({
    profile: state.firebase.profile,
  })),
  // withStyles(styles),
)(EditProfileModal)
