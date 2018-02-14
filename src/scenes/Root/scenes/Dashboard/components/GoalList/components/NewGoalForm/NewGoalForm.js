// @flow

import React from 'react'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Done from 'material-ui-icons/Done'
import { withStyles } from 'material-ui/styles'
import Input from 'material-ui/Input'

import type { Users } from '../../../../../../../../common/records/Firebase/User'
import { getUserByEmail } from '../../../../../../../../common/records/Firebase/User'
import SelectWrapped from './components/SelectWrapped/SelectWrapped'

type Props = {
  onSubmit: any => void,
  classes: any,
  onChange: (string, string) => void,
  name: string,
  target: number,
  formValid: boolean,
  friendsSelected: ?any,
  friends: Array<String>,
  onChangeSelectedFriends: string => void,
  users: Users,
}

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginLeft: '8px',
    marginRight: '8px',
    width: '200px',
  },
  numberField: {
    marginLeft: '8px',
    marginRight: '8px',
    width: '100px',
  },
  selectField: {
    marginLeft: '8px',
    marginRight: '8px',
    width: '350px',
    height: '33px',
  },
  selectFieldValues: {
    marginLeft: '8px',
    marginRight: '8px',
    width: '350px',
    height: '51px',
  },
  form: {
    marginTop: '16px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  button: {
    alignSelf: 'center',
    marginTop: '16px',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
})

const NewGoalForm = ({
  onSubmit,
  onChangeSelectedFriends,
  classes,
  onChange,
  name,
  target,
  formValid,
  friendsSelected,
  users,
  friends,
}: Props) => (
  <form className={classes.form} onSubmit={onSubmit} noValidate autoComplete="off">
    <div className={classes.row}>
      <div>
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
          label="Days"
          value={target}
          onChange={ev => onChange('target', ev.target.value)}
          margin="normal"
          className={classes.numberField}
        />
        <Input
          fullWidth
          inputComponent={SelectWrapped}
          inputProps={{
            classes,
            value: friendsSelected,
            multi: true,
            onChange: onChangeSelectedFriends,
            placeholder: 'Add friends',
            instanceId: 'react-select-chip',
            id: 'react-select-chip',
            name: 'react-select-chip',
            simpleValue: false,
            options: friends.map(x => ({
              value: x,
              label: users[x].displayName.split(' ')[0],
            })),
            users,
          }}
          className={
            !friendsSelected || !friendsSelected.length
              ? classes.selectField
              : classes.selectFieldValues
          }
        />
      </div>
      <div>
        <Button
          disabled={!formValid}
          type="submit"
          raised
          color="primary"
          className={classes.button}
        >
          <Done className={classes.leftIcon} /> Add
        </Button>
      </div>
    </div>
  </form>
)

export default withStyles(styles)(NewGoalForm)
