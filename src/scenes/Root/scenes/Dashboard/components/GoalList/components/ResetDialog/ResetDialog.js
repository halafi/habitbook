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
  dateTime: ?number,
  minDateTime: ?number, // should also be set to not allow reset before last reset
  onDateTimeChange: any => void,
}

class ResetDialog extends React.Component<Props> {
  componentDidUpdate() {
    if (!this.props.dateTime) {
      this.props.onDateTimeChange(moment().valueOf())
    }
  }

  render() {
    const { open, onClose, onConfirm, dateTime, minDateTime, onDateTimeChange } = this.props

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
            {dateTime && (
              <DateTimePicker
                id="reset"
                label="Failed on"
                value={dateTime}
                minValue={minDateTime}
                onChange={onDateTimeChange}
              />
            )}
            <br />
            <Typography type="Caption">
              <small>
                <strong>Bruce Wayne</strong>: I wanted to save Gotham. I failed.
                <br />
                <strong>Alfred</strong>: Why do we fall sir? So that we can learn to pick ourselves
                up.
              </small>
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
