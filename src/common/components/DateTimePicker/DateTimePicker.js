// @flow

import React from 'react'
import moment from 'moment/moment'
import TextField from 'material-ui/TextField'

type Props = {
  id: string,
  className?: string,
  disabled?: boolean,
  label: string,
  onChange: (?number) => void,
  value: number,
  minValue?: ?number,
}

export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'
const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm'

class DateTimePicker extends React.Component<Props> {
  handleChangeDate = (ev: any) => {
    const { value, minValue, onChange } = this.props

    if (!ev.target.value) {
      onChange(null)
      return
    }

    const dateTime: Array<string> = moment(value)
      .format(DATE_TIME_FORMAT)
      .split('T')

    if (minValue && moment(value).isBefore(moment(minValue))) {
      alert('invalid date, yo')
      return
    }

    const newValue: string = `${ev.target.value}T${dateTime[1]}`

    onChange(moment(newValue, DATE_TIME_FORMAT).valueOf())
  }

  handleChangeTime = (ev: any) => {
    const { value, minValue, onChange } = this.props

    if (!ev.target.value) {
      onChange(null)
      return
    }

    const dateTime: Array<string> = moment(value)
      .format(DATE_TIME_FORMAT)
      .split('T')

    if (minValue && moment(value).isBefore(moment(minValue))) {
      alert('invalid date, yo')
      return
    }

    const newValue: string = `${dateTime[0]}T${ev.target.value}`

    onChange(moment(newValue, DATE_TIME_FORMAT).valueOf())
  }

  render() {
    const { id, label, value, className = '', disabled = false } = this.props

    return (
      <div className={className}>
        <TextField
          id={`date-${id}`}
          label={label}
          type="date"
          value={moment(value).format(DATE_FORMAT)}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={disabled}
          onChange={this.handleChangeDate}
        />
        <TextField
          id={`time-${id}`}
          type="time"
          value={moment(value).format(TIME_FORMAT)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 600, // 10 min
          }}
          disabled={disabled}
          onChange={this.handleChangeTime}
        />
      </div>
    )
  }
}

export default DateTimePicker
