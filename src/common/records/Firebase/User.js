import * as R from 'ramda'
import type { ProviderData } from './ProviderData'

export type User = {
  avatarUrl: string,
  photoURL?: string, // custom
  displayName?: string, // provider
  userName?: string, // custom
  email: string,
  friends: Array<string>,
  providerData: ProviderData,
}

export type Users = {
  [key: string]: User,
}

export const getUserByEmail = (users: Users, email: string): User =>
  R.compose(R.head, R.values, R.pickBy(R.propEq('email', email)), R.values)(users)

export const getUserIdByEmail = (users: Users, email: string): ?string =>
  R.compose(
    R.defaultTo(null),
    R.head,
    R.keys,
    R.fromPairs,
    R.filter(R.compose(R.propEq('email', email), R.last)),
    R.toPairs,
  )(users)
