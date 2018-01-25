export type User = {
  avatarUrl: string,
  displayName: string,
  email: string,
  providerData: Array<any>,
}

export type Users = {
  [key: string]: User,
}
