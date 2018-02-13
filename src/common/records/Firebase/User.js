import * as R from 'ramda'
import type { ProviderData } from './ProviderData'

export type User = {
  avatarUrl: string,
  displayName: string,
  email: string,
  friends: Array<string>,
  providerData: ProviderData,
}

export type Users = {
  [key: string]: User,
}

export const getUserByEmail = (users: Users, email: string): User =>
  R.compose(R.head, R.values, R.pickBy(R.propEq('email', email)), R.values)(users)
