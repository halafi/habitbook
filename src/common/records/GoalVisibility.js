// @flow

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
