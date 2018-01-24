// @flow

import { createSelector } from 'reselect'
import * as R from 'ramda'

import { Users } from '../../scenes/records/User'

const firebaseDataSelector = state => state.firebase.data

export const usersSelector = createSelector(
  firebaseDataSelector,
  (data: Object): Users => data.users,
)

const presenceSelector = createSelector(firebaseDataSelector, data => data.presence)

export const onlineUsersSelector = createSelector(
  usersSelector,
  presenceSelector,
  (users: Object, presence: Object): Users => R.merge(presence, users),
)
