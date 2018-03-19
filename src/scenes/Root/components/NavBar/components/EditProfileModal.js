// @flow

import * as React from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'

import type { User } from '../../../../../common/records/Firebase/User'
import type { Firebase } from '../../../../../common/records/Firebase/Firebase'

type Props = {
  firebase: Firebase,
  profile: User,
  currentUserId: string,
  open: boolean,
  onClose: () => void,
}

type State = {
  name: string,
  url: string,
  loading: boolean,
}

type FileType = any

class EditProfileModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: props.profile.userName || props.profile.displayName,
      url: props.profile.photoURL || '',
      loading: false,
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
      userName: name,
      photoURL: url,
    })

    onClose()
  }

  handleClose = (): void => {
    const { onClose, profile } = this.props

    this.setState({
      name: profile.userName || '',
      url: profile.photoURL || '',
    })

    onClose()
  }

  handleFileInputChange = (ev: any): void => {
    const file = ev.target.files[0]
    const split = file.name.split('.')
    const ext = split[split.length - 1]

    if (file.size > 4000000) {
      alert('file too big, yo (max 5MB)')
    } else if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif' && ext !== 'png') {
      alert('invalid file extension, yo')
    } else {
      this.fileUpload(file)
    }
  }

  fileUpload(file: FileType) {
    const { firebase, currentUserId } = this.props

    this.setState(
      {
        loading: true,
      },
      () => {
        firebase
          .storage()
          .ref()
          .child(currentUserId)
          .put(file)
          .then(snapshot => {
            this.setState({
              url: snapshot.downloadURL,
              loading: false,
            })
            firebase.updateProfile({
              photoURL: snapshot.downloadURL,
            })
          })
      },
    )
  }

  render() {
    const { open } = this.props
    const { name, url, loading } = this.state

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
              disabled={loading}
            />
            <TextField
              id="photourl"
              label="Avatar Url"
              value={url}
              margin="dense"
              fullWidth
              disabled={loading}
            />
            <input type="file" onChange={this.handleFileInputChange} disabled={loading} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading || !this.formValid()}
            onClick={this.handleSubmit}
            color="primary"
            autoFocus
          >
            Save
          </Button>
          <Button disabled={loading} onClick={this.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default EditProfileModal
