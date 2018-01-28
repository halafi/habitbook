export type Rank = ''

const RANKS = {
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
