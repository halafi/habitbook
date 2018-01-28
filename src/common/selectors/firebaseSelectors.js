// @flow

import { createSelector } from 'reselect'
import * as R from 'ramda'

import { Users } from '../records/Firebase/User'
import type { Auth } from '../records/Firebase/Auth'
import type { Goals } from '../records/Goal'

const firebaseDataSelector = state => state.firebase.data
// const firebaseAuthSelector = state => state.firebase.auth

export const currentUserIdSelector = state => state.firebase.auth.uid

export const usersSelector = createSelector(
  firebaseDataSelector,
  (data: Object): Users => data.users,
)

export const userEmailsSelector = createSelector(usersSelector, (users: Users): Array<string> =>
  R.compose(R.map(R.prop(['email'])), R.values)(users),
)

export const goalsSelector = createSelector(
  firebaseDataSelector,
  (data: Object): Goals => data.goals,
)

// const presenceSelector = createSelector(firebaseDataSelector, data => data.presence)

// export const onlineUsersSelector = createSelector(
//   usersSelector,
//   presenceSelector,
//   (users: Object, presence: Object): Users => R.merge(presence, users),
// )
