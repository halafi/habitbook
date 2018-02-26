// @flow

import React from 'react'
import Typography from 'material-ui/Typography'
import { getAscensionKarma, getFinishKarma } from '../../../services/helpers'
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
            <li>Collect {getFinishKarma(goal)} Karma and be done with this challenge</li>
            <li>
              Collect {getAscensionKarma(goal)} Karma and double the challenge duration (
              {getAscensionKarma({
                ...goal,
                ascensionCount: goal.ascensionCount + 1,
              })}{' '}
              next time)
            </li>
          </ul>
        </Typography>
      )}
  </div>
)

export default GoalNotes
