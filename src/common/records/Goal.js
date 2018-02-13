export type Goal = {
  ascensionCount: number,
  created: number,
  draft: boolean,
  streak: number,
  name: string,
  started: number,
  target: number,
  visibility: string,
  resets: Array<number>,
}

export type Goals = {
  [goalId: string]: Goal,
}
