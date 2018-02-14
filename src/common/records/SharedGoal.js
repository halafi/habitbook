export type SharedGoal = {
  created: number,
  draft: boolean,
  name: string,
  started: number,
  target: number,
  users: Array<string>,
}

export type SharedGoals = {
  [sharedGoalId: string]: SharedGoal,
}
