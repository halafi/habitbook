// @flow

import * as React from 'react'
import moment from 'moment'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'

import DateTimePicker from '../../../../../../../../common/components/DateTimePicker/DateTimePicker'

type Props = {
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
  dateTime: number,
  onDateTimeChange: any => void,
}

class ResetDialog extends React.Component<Props> {
  componentDidUpdate() {
    if (!this.props.dateTime) {
      this.props.onDateTimeChange(moment().valueOf())
    }
  }

  render() {
    const { open, onClose, onConfirm, dateTime, onDateTimeChange } = this.props

    return (
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
            <br />
            <br />
            <DateTimePicker
              label="Failed on"
              id="reset"
              value={dateTime}
              onChange={onDateTimeChange}
            />
            <br />
            <Typography variant="Caption" gutterBottom>
              <strong>Bruce Wayne</strong>: <em>I wanted to save Gotham. I failed.</em>
              <br />
              <strong>Alfred</strong>:{' '}
              <em>Why do we fall sir? So that we can learn to pick ourselves up.</em>
            </Typography>
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
  }
}

export default ResetDialog
