// @flow

import * as R from 'ramda'

import type { ProviderData } from './ProviderData'
import type { SortType } from '../../../scenes/Root/scenes/Dashboard/components/GoalList/consts/sortTypes'

type Email = string

// $FlowFixMe
export type Friends = Array<Email>

type UserAlways = {
  isLoaded: boolean,
  isEmpty: boolean,
  displayName: string, // provider
}

export type UserOptional = {
  avatarUrl?: string, // provider
  photoURL?: string, // custom
  userName?: string, // custom
  email?: Email,
  providerData?: ProviderData,
  goalsCompleted?: number,
  ascensions?: number,
  friends?: Friends,
  sort?: SortType,
  tasks?: Array<string>, // values of GOALS_ENUM
  experience?: number,
}

export type User = UserAlways & UserOptional

export type Users = {
  [key: string]: User,
}

export const getUserByEmail = (users: Users, email: string): User =>
  R.compose(R.head, R.values, R.pickBy(R.propEq('email', email)), R.values)(users)

export const getUserIdByEmail = (users: Users, email: Email): ?string =>
  R.compose(
    R.defaultTo(null),
    R.head,
    R.keys,
    R.fromPairs,
    R.filter(R.compose(R.propEq('email', email), R.last)),
    R.toPairs,
  )(users)
