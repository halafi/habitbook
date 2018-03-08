// @flow

export const GOAL_SORT_TYPES = [
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'oldestFirst',
    label: 'Oldest',
  },
  {
    value: 'progress',
    label: 'Progress',
  },
  ,
]

export type SortType = 'name' | 'progress' | 'oldestFirst'
