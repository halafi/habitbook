// @flow

import * as R from 'ramda'
import type { Goal, Goals } from '../../../../../../../common/records/Goal'
import type SortType from '../consts/sortTypes'
import { getElapsedDaysTillNow } from '../../../../../../../common/services/dateTimeUtils'
import type { SharedGoal, SharedGoals } from '../../../../../../../common/records/SharedGoal'

export const getAscensionKarma = (goal: Goal): number =>
  Math.round(goal.target * (goal.ascensionCount + 1) / 2)
export const getFinishKarma = (goal: Goal): number => Number(goal.target)
export const getSharedGoalFinishKarma = (goal: SharedGoal): number => Number(goal.target)

export const getSortedSharedGoalsIds = (goals: SharedGoals, uid: string): ?Array<string> =>
  R.compose(
    R.defaultTo(null),
    R.keys,
    R.fromPairs,
    R.filter(
      R.compose(
        R.any(R.compose(R.both(R.propEq('id', uid), R.propEq('abandoned', false)))),
        R.prop('users'),
        R.last,
      ),
    ),
    R.filter(R.compose(R.any(R.propEq('id', uid)), R.prop('users'), R.last)), // only goals which contain uid in users
    R.toPairs,
  )(goals)

export const getSortedGoalsIds = (goals: Goals, sortType: SortType): Array<string> => {
  let sortFn = R.identity // do not sort by default

  const sortDraftFn = (a, b) => {
    if (a[1].draft && !b[1].draft) {
      return 1
    } else if (!a[1].draft && b[1].draft) {
      return -1
    }
    return 0
  }

  if (sortType === 'name') {
    sortFn = (a, b) => a[1].name.localeCompare(b[1].name)
  } else if (sortType === 'progress') {
    sortFn = (a, b) => {
      const aElapsedDays = getElapsedDaysTillNow(a[1].started)
      const bElapsedDays = getElapsedDaysTillNow(b[1].started)
      if (bElapsedDays < aElapsedDays) {
        return -1
      } else if (bElapsedDays > aElapsedDays) {
        return 1
      }
      return 0
    }
  } else if (sortType === 'oldestFirst') {
    sortFn = (a, b) => {
      if (a[1].created < b[1].created) {
        return -1
      } else if (a[1].created > b[1].created) {
        return 1
      }
      return 0
    }
  }

  return R.compose(R.map(R.nth(0)), R.sort(sortDraftFn), R.sort(sortFn), R.toPairs)(goals)
}
