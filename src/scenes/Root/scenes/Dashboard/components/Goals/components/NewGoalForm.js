// @flow

import React from 'react'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Done from 'material-ui-icons/Done'
import { withStyles } from 'material-ui/styles'

import { TARGET_TYPES } from '../../../../../../../common/records/GoalTargetType'
import type { GoalTargetType } from '../../../../../../../common/records/GoalTargetType'

type Props = {
  onSubmit: any => void,
  classes: any,
  onChange: (string, string) => void,
  name: string,
  target: number,
  targetType: GoalTargetType,
  formValid: boolean,
}

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginLeft: '8px',
    marginRight: '8px',
    width: '25%',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  button: {
    alignSelf: 'center',
    marginTop: '16px',
  },
})

const NewGoalForm = ({
  onSubmit,
  classes,
  onChange,
  name,
  target,
  targetType,
  formValid,
}: Props) => (
  <form className={classes.form} onSubmit={onSubmit} noValidate autoComplete="off">
    <TextField
      id="name"
      label="New goal"
      value={name}
      onChange={ev => onChange('name', ev.target.value)}
      margin="normal"
      className={classes.textField}
    />
    <TextField
      id="target"
      label="Target"
      value={target}
      onChange={ev => onChange('target', ev.target.value)}
      margin="normal"
      className={classes.textField}
    />
    <TextField
      id="select-target-type"
      select
      label="Type"
      value={targetType}
      onChange={ev => onChange('targetType', ev.target.value)}
      SelectProps={{
        native: true, // FIXME: native broken
      }}
      margin="normal"
      className={classes.textField}
    >
      {TARGET_TYPES.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
    <Button disabled={!formValid} type="submit" raised color="primary" className={classes.button}>
      <Done className={classes.leftIcon} />
      Add
    </Button>
  </form>
)

export default withStyles(styles)(NewGoalForm)
