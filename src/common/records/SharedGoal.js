// @flow

export type SharedGoalUser = {
  id: string,
  accepted: boolean,
  abandoned: boolean,
  failed: ?number,
  finished: boolean,
}

export type SharedGoal = {
  created: number,
  draft: boolean,
  name: string,
  started: number,
  target: number,
  users: Array<SharedGoalUser>,
  type: 'duration' | 'elimination',
}

export type SharedGoals = {
  [sharedGoalId: string]: SharedGoal,
}
