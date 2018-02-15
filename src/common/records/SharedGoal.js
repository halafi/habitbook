export type SharedGoalUser = {
  id: string,
  accepted: boolean,
  failed: ?number,
}

export type SharedGoal = {
  created: number,
  draft: boolean,
  name: string,
  started: number,
  target: number,
  users: Array<SharedGoalUser>,
}

export type SharedGoals = {
  [sharedGoalId: string]: SharedGoal,
}
