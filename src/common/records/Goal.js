export const TARGET_TYPES = [
  {
    value: 'DAYS',
    label: 'Days',
  },
  // {
  //   value: 'COUNT',
  //   label: 'Count',
  // },
]

export type TargetType = 'DAYS' | 'COUNT'

export const GOAL_VISIBILITIES = [
  {
    value: 'secret',
    label: 'Hidden',
  },
  {
    value: 'private',
    label: 'Only you',
  },
  {
    value: 'public',
    label: 'Friends',
  },
]

export type Visibility = 'secret' | 'private' | 'public'

export const getGoalVisibility = (level: 0 | 1 | 2): Visibility => GOAL_VISIBILITIES[level].value

export type Goal = {
  name: string,
  targetType: TargetType,
  target: number,
  draft: boolean,
  started: number,
  ascensionCount: number,
  visibility: string,
  // done: number,
  // created: number,
}

export type Goals = {
  [goalId: string]: Goal,
}
