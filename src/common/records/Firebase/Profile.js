import type { ProviderData } from './ProviderData'

export type Profile = {
  isLoaded: boolean,
  isEmpty: boolean,
  avatarUrl?: string,
  displayName?: string,
  email?: string,
  providerData?: ProviderData,
  goalsCompleted?: number,
  ascensions?: number,
}
