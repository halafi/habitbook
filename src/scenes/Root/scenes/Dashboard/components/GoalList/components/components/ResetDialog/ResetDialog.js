// @flow

import * as React from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

type Props = {
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
}

const ResetDialog = ({ open, onClose, onConfirm }: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">Reset progress</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to reset your progress?
        {/*<br />*/}
        {/*Bruce Wayne: I wanted to save Gotham. I failed.*/}
        {/*<br />*/}
        {/*Alfred Pennyworth: Why do we fall sir? So that we can learn to pick ourselves up.*/}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Confirm
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
)

export default ResetDialog
