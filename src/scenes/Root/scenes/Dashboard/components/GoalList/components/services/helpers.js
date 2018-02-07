// @flow

import * as R from 'ramda'
import type { Goal, Goals } from '../../../../../../../../common/records/Goal'
import type SortType from '../consts/sortTypes'
import { getElapsedDaysTillNow } from '../../../../../../../../common/services/dateTimeUtils'

export const getAscensionKarma = (goal: Goal): number =>
  Math.round(goal.target * (goal.ascensionCount + 1) / 2)
export const getFinishKarma = (goal: Goal): number => goal.target

export const getSortedGoalsIds = (goals: Goals, sortType: SortType): Array<string> => {
  let sortFn = R.identity

  if (sortType === 'name') {
    sortFn = (a, b) => a[1].name.localeCompare(b[1].name)
  } else if (sortType === 'progress') {
    sortFn = (a, b) => {
      const aElapsedDays = getElapsedDaysTillNow(a[1].started)
      const bElapsedDays = getElapsedDaysTillNow(b[1].started)
      if (aElapsedDays < bElapsedDays) {
        return -1
      } else if (aElapsedDays > bElapsedDays) {
        return 1
      }
      return 0
    }
  }

  const fn = R.compose(R.map(R.nth(0)), R.sort(sortFn), R.toPairs)
  return fn(goals)
}
