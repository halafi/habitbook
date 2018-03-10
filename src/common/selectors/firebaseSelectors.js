// @flow

import { createSelector } from 'reselect'
import * as R from 'ramda'

import type { User, Users } from '../records/Firebase/User'
import type { Goals } from '../records/Goal'

type State = Object

const dataSelector = (state: State) => state.firebase.data
export const profileSelector = (state: State): User => state.firebase.profile
export const currentUserIdSelector = (state: State) => state.firebase.auth.uid

export const goalsSelector = createSelector(dataSelector, (data: Object): Goals => data.goals)
export const usersSelector = createSelector(dataSelector, (data: Object): Users => data.users)

export const userEmailsSelector = createSelector(usersSelector, (users: Users): Array<string> =>
  R.compose(R.map(R.prop(['email'])), R.values)(users),
)

export const sharedGoalsSelector = createSelector(
  dataSelector,
  (data: Object): Goals => data.sharedGoals,
)
