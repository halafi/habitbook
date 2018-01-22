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

export type Goal = {
  name: string,
  targetType: TargetType,
  target: number,
  draft: boolean,
  started: number,
  ascensionCount: number,
  // done: number,
  // created: number,
}

export type Goals = {
  [goalId: string]: Goal,
}
