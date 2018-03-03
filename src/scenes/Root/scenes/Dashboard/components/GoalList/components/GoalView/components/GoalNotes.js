// @flow

import React from 'react'
import Typography from 'material-ui/Typography'
import type { Goal } from '../../../../../../../../../common/records/Goal'

type Props = {
  goal: Goal,
  longestStreak: ?number,
  finished: boolean,
}

const GoalNotes = ({ goal, longestStreak, finished }: Props) => (
  <div>
    <Typography>
      {goal.target} days required to complete.
      <br />
      {longestStreak
        ? `Longest streak: ${longestStreak} ${longestStreak > 1 ? 'days' : 'day'}.`
        : ''}
    </Typography>

    {finished &&
      !goal.draft && (
        <Typography component="div">
          <br />
          Make a choice:
          <ul>
            <li>Complete challenge</li>
            <li>Double the challenge duration</li>
          </ul>
        </Typography>
      )}
  </div>
)

export default GoalNotes
