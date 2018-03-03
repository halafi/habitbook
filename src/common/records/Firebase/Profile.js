import type { ProviderData } from './ProviderData'
import { SortType } from '../../../scenes/Root/scenes/Dashboard/components/GoalList/consts/sortTypes'

type Email = string

export type Profile = {
  isLoaded: boolean,
  isEmpty: boolean,
  avatarUrl?: string, // provider
  photoURL?: string, // custom
  displayName?: string, // provider
  userName?: string, // custom
  email?: Email,
  providerData?: ProviderData,
  goalsCompleted?: number,
  ascensions?: number,
  friends?: Array<Email>,
  sort?: SortType,
  tasks?: Array<string>, // values of GOALS_ENUM
}
