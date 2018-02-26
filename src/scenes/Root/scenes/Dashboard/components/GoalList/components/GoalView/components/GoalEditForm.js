// @flow

import React from 'react'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'

import DateTimePicker from '../../../../../../../../../common/components/DateTimePicker/DateTimePicker'
import { GOAL_VISIBILITIES } from '../../../../../../../../../common/records/GoalVisibility'
import type { Goal } from '../../../../../../../../../common/records/Goal'

type Props = {
  goal: Goal,
  onChangeDate: (?number) => void,
  onChangeTarget: any => void,
  onChangeVisibility: string => void,
  onRenameGoal: any => void, // SyntheticEvent<>
  readOnly: boolean,
  lastReset: ?number,
}

const GoalEditForm = ({
  goal,
  onRenameGoal,
  onChangeDate,
  onChangeVisibility,
  onChangeTarget,
  readOnly,
  lastReset,
}: Props) => (
  <Grid container>
    <Grid item>
      <TextField
        id="name"
        label="Name"
        value={goal.name}
        onChange={onRenameGoal}
        disabled={readOnly}
      />
    </Grid>
    <Grid item>
      <DateTimePicker
        id="start-date"
        label={goal.draft ? 'Start from' : 'Started'}
        value={lastReset || goal.started}
        onChange={onChangeDate}
        disabled={readOnly || !goal.draft}
      />
    </Grid>
    {goal.draft && (
      <Grid item>
        <TextField id="target" label="Days" value={goal.target} onChange={onChangeTarget} />
      </Grid>
    )}
    <Grid item>
      <TextField
        id="select-target-type"
        select
        label="Visible to"
        value={goal.visibility}
        onChange={onChangeVisibility}
        SelectProps={{
          native: true,
        }}
        disabled={readOnly}
      >
        {GOAL_VISIBILITIES.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </Grid>
  </Grid>
)

export default GoalEditForm
