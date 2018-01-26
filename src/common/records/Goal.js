import type { GoalTargetType } from './GoalTargetType'

export type Goal = {
  name: string,
  targetType: GoalTargetType,
  target: number,
  draft: boolean,
  started: number,
  ascensionCount: number,
  visibility: string,
  // done: number,
  created: number, // TODO: do not reward day old goals
}

export type Goals = {
  [goalId: string]: Goal,
}
