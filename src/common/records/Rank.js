export const RANKS = {
  NOVICE: 'Novice',
  RECRUIT: 'Recruit',
  APPRENTICE: 'Apprentice',
  INITIATE: 'Initiate',
  MASTER: 'Master',
  GRANDMASTER: 'Grandmaster',
  ELDER: 'Elder',
  SAGE: 'Sage',
  MORPHEUS: 'Morpheus',
  NEO: 'Neo',
}

export type Rank = $Values<typeof RANKS> // eslint-disable-line no-undef

export const getRankIdFromExp = (exp: number): number => {
  const val = Math.floor(exp / 1000)
  if (val >= Object.values(RANKS).length) {
    return Object.values(RANKS).length - 1
  }
  return Math.floor(exp / 1000)
}

export const getRankFromExp = (exp: number): Rank => {
  const rankValues = Object.values(RANKS)
  if (exp < 0) {
    return undefined
  }
  return rankValues[getRankIdFromExp(exp)] || rankValues[rankValues.length - 1]
}

export const getExpRequiredForNextRank = (exp: number): number =>
  (getRankIdFromExp(exp) < Object.values(RANKS).length
    ? getRankIdFromExp(exp) + 1
    : getRankIdFromExp(exp)) * 1000

export const getFlooredExp = (exp: number): number => exp - getRankIdFromExp(exp) * 1000

export const getNextRankFromExp = (exp: number): ?Rank =>
  Object.values(RANKS)[getRankIdFromExp(exp) + 1] || null

// TODO: decrease numbers to make more achievable
// TODO: rank images
export const getRank = (karma: number): Rank => {
  if (!karma || karma < 10) {
    return RANKS.NOVICE
  } else if (karma < 30) {
    return RANKS.RECRUIT
  } else if (karma < 100) {
    return RANKS.APPRENTICE
  } else if (karma < 200) {
    return RANKS.INITIATE
  } else if (karma < 350) {
    return RANKS.MASTER
  } else if (karma < 500) {
    return RANKS.GRANDMASTER
  } else if (karma < 750) {
    return RANKS.ELDER
  } else if (karma < 1000) {
    return RANKS.SAGE
  } else if (karma < 2000) {
    return RANKS.MORPHEUS
  }
  return RANKS.NEO
}

export const getRankId = (rank: Rank): number => Object.values(RANKS).indexOf(rank) + 1
