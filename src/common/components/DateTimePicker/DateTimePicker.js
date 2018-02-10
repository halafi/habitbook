// @flow

import React from 'react'
import moment from 'moment/moment'
import TextField from 'material-ui/TextField'
import { GOAL_DATE_TIME } from '../../consts/dateTimeConsts'

type Props = {
  id: string,
  className: ?string,
  disabled: boolean,
  label: ?string,
  onChange: any => void,
  value: string,
}

const DateTimePicker = ({ id, label, value, onChange, className, disabled }: Props) => (
  <TextField
    id={id}
    label={label}
    type="datetime-local"
    value={moment(value).format(GOAL_DATE_TIME)}
    InputLabelProps={{
      shrink: true,
    }}
    onChange={onChange}
    className={className}
    disabled={disabled}
  />
)

export default DateTimePicker
