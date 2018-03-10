// @flow

import React from 'react'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Done from 'material-ui-icons/Done'
import { withStyles } from 'material-ui/styles'
import Input from 'material-ui/Input'
import Grid from 'material-ui/Grid'

import type { Users, Friends } from '../../../../../../../../common/records/Firebase/User'
import SelectWrapped from './components/SelectWrapped/SelectWrapped'

type Props = {
  onSubmit: any => void,
  classes: Object,
  onChange: (string, string) => void,
  name: string,
  formValid: boolean,
  friendsSelected: ?any,
  friends: Friends,
  onChangeSelectedFriends: string => void,
  users: Users,
}

const styles = theme => ({
  root: {
    margin: '16px 4px 0',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    width: '100%',
    marginBottom: '0',
  },
  selectField: {
    width: '100%',
    height: '33px',
  },
  selectFieldValues: {
    width: '100%',
    height: '51px',
  },
  button: {
    width: '100%',
  },
})

const NewGoalForm = ({
  onSubmit,
  onChangeSelectedFriends,
  classes,
  onChange,
  name,
  formValid,
  friendsSelected,
  users,
  friends,
}: Props) => (
  <form className={classes.root} onSubmit={onSubmit} noValidate autoComplete="off">
    <Grid container direction="row" alignItems="flex-end">
      <Grid item xs={12} sm={3}>
        <TextField
          id="name"
          label="New challenge"
          value={name}
          onChange={ev => onChange('name', ev.target.value)}
          margin="normal"
          className={classes.textField}
        />
      </Grid>
      <Grid item xs={12} sm={7}>
        <Input
          fullWidth
          inputComponent={SelectWrapped}
          inputProps={{
            value: friendsSelected,
            multi: true,
            onChange: onChangeSelectedFriends,
            placeholder: 'Add friends',
            instanceId: 'react-select-chip',
            id: 'react-select-chip',
            name: 'react-select-chip',
            simpleValue: false,
            options: friends
              ? friends.map(x => ({
                  value: x,
                  label: users[x].userName || users[x].displayName.split(' ')[0],
                }))
              : [],
            users,
          }}
          className={
            !friendsSelected || !friendsSelected.length
              ? classes.selectField
              : classes.selectFieldValues
          }
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          disabled={!formValid}
          type="submit"
          raised
          color="primary"
          className={classes.button}
        >
          <Done className={classes.leftIcon} /> Add
        </Button>
      </Grid>
    </Grid>
  </form>
)

export default withStyles(styles)(NewGoalForm)
