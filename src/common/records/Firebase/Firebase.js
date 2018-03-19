// @flow

import type { UserOptional } from './User'

type Ref = {
  key: string,
}

export type Firebase = {
  set: (string, Object) => Promise<void>,
  remove: string => Promise<void>,
  push: (string, Object) => Ref,
  login: Object => Promise<void>,
  logout: () => Promise<void>,
  updateEmail: string => Promise<void>,
  updatePassword: string => Promise<void>,
  updateProfile: UserOptional => Promise<void>,
  storage: any,
}
