// @flow

import { createSelector } from 'reselect'
import * as R from 'ramda'

import { Users } from '../records/Firebase/User'
// import type { Auth } from '../records/Firebase/Auth'
import type { Goals } from '../records/Goal'

type State = Object

const dataSelector = (state: State) => state.firebase.data
export const profileSelector = (state: State) => state.firebase.profile
// const firebaseAuthSelector = state => state.firebase.auth

export const currentUserIdSelector = (state: State) => state.firebase.auth.uid

export const usersSelector = createSelector(dataSelector, (data: Object): Users => data.users)

export const userEmailsSelector = createSelector(usersSelector, (users: Users): Array<string> =>
  R.compose(R.map(R.prop(['email'])), R.values)(users),
)

export const goalsSelector = createSelector(dataSelector, (data: Object): Goals => data.goals)

export const sharedGoalsSelector = createSelector(
  dataSelector,
  (data: Object): Goals => data.sharedGoals,
)
// const presenceSelector = createSelector(dataSelector, data => data.presence)

// export const onlineUsersSelector = createSelector(
//   usersSelector,
//   presenceSelector,
//   (users: Object, presence: Object): Users => R.merge(presence, users),
// )
