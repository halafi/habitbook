import type { Goal } from '../../../../../../../../common/records/Goal'

export const getAscensionKarma = (goal: Goal): number =>
  Math.round(goal.target * (goal.ascensionCount + 1) / 2)
export const getFinishKarma = (goal: Goal): number => goal.target
