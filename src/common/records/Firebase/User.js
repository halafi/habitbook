import type { ProviderData } from './ProviderData'

export type User = {
  avatarUrl: string,
  displayName: string,
  email: string,
  providerData: ProviderData,
}

export type Users = {
  [key: string]: User,
}
