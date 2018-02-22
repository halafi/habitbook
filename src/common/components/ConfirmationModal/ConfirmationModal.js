// @flow

import * as React from 'react'
import Button from 'material-ui/Button'
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
  title: ?string,
  children: React.Node,
}

const RemoveGoal = ({ open, onClose, onConfirm, title, children }: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title || 'Confirm'}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Confirm
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
)

export default RemoveGoal
