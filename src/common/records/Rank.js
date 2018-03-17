// @flow

import * as R from 'ramda'
import neoImage from '../../../images/avatar-neo.jpg'
import paesantImage from '../../../images/avatar-paesant.png'
// $FlowFixMe
import morpheusImage from '../../../images/avatar-morpheus.jpeg'
import mageImage from '../../../images/avatar-mage.png'
import dogeImage from '../../../images/avatar-doge.png'

export const RANKS = {
  PAESANT: {
    name: 'Paesant',
    img: paesantImage,
    expRequired: 0,
  },
  MAGE: {
    name: 'Mage',
    img: mageImage,
    expRequired: 200,
  },
  DOGE: {
    name: 'Doge',
    img: dogeImage,
    expRequired: 500,
  },
  MORPHEUS: {
    name: 'Morpheus',
    img: morpheusImage,
    expRequired: 1000,
  },
  NEO: {
    name: 'Neo',
    img: neoImage,
    expRequired: 2000,
  },
}

export type Rank = 'Paesant' | 'Mage' | 'Doge' | 'Morpheus' | 'Neo'

export const getRankIdFromExp = (exp: number): number => {
  if (!exp || exp < 0) return 0
  const rank = R.compose(R.head, R.last, R.filter(pair => pair[1].expRequired <= exp), R.toPairs)(
    RANKS,
  )
  return Object.keys(RANKS).indexOf(rank)
}

export const getRankFromExp = (exp: number): Rank => {
  const rankValues = Object.values(RANKS)
  if (!exp || exp < 0) {
    return RANKS.PAESANT.name
  }
  // $FlowFixMe
  return rankValues[getRankIdFromExp(exp)].name
}

export const getExpRequiredForNextRank = (exp: number): number => {
  const currRank: number = getRankIdFromExp(exp)
  const nextRank = Object.values(RANKS)[currRank + 1]
  if (!nextRank) {
    return 666666
  }
  // $FlowFixMe
  return nextRank.expRequired - Object.values(RANKS)[currRank].expRequired
}

export const getFlooredExp = (exp: number): number => {
  const currRank: number = getRankIdFromExp(exp)
  const prevRank = Object.values(RANKS)[currRank - 1]
  if (!prevRank) {
    return exp
  }
  // $FlowFixMe
  return 0 + exp - Object.values(RANKS)[currRank].expRequired
}

export const getAvatarFromExp = (exp: number): string =>
  // $FlowFixMe
  Object.values(RANKS)[getRankIdFromExp(exp)].img
