import type { ProviderData } from './ProviderData'

type Email = string

export type Profile = {
  isLoaded: boolean,
  isEmpty: boolean,
  avatarUrl?: string,
  displayName?: string,
  email?: Email,
  providerData?: ProviderData,
  goalsCompleted?: number,
  ascensions?: number,
  karma?: number,
  friends?: Array<Email>,
}
