import {
  RANKS,
  getRankFromExp,
  getRankIdFromExp,
  getExpRequiredForNextRank,
  getAvatarFromExp,
  getFlooredExp,
} from './Rank'

describe('Rank', () => {
  test('getRankIdFromExp', () => {
    expect(getRankIdFromExp(-1)).toEqual(0)
    expect(getRankIdFromExp(0)).toEqual(0)
    expect(getRankIdFromExp(1)).toEqual(0)
    expect(getRankIdFromExp(RANKS.MAGE.expRequired)).toEqual(1)
    expect(getRankIdFromExp(RANKS.MAGE.expRequired + 1)).toEqual(1)
    expect(getRankIdFromExp(RANKS.DOGE.expRequired)).toEqual(2)
    expect(getRankIdFromExp(RANKS.DOGE.expRequired + 50)).toEqual(2)
    expect(getRankIdFromExp(RANKS.MORPHEUS.expRequired - 1)).toEqual(2)
    expect(getRankIdFromExp(RANKS.MORPHEUS.expRequired)).toEqual(3)
    expect(getRankIdFromExp(RANKS.NEO.expRequired)).toEqual(4)
    expect(getRankIdFromExp(RANKS.NEO.expRequired + 1000)).toEqual(4)
  })
  test('getRankFromExp', () => {
    expect(getRankFromExp(-1)).toEqual(RANKS.PAESANT.name)
    expect(getRankFromExp(0)).toEqual(RANKS.PAESANT.name)
    expect(getRankFromExp(1)).toEqual(RANKS.PAESANT.name)
    expect(getRankFromExp(RANKS.MAGE.expRequired)).toEqual(RANKS.MAGE.name)
    expect(getRankFromExp(RANKS.MAGE.expRequired + 1)).toEqual(RANKS.MAGE.name)
    expect(getRankFromExp(RANKS.DOGE.expRequired)).toEqual(RANKS.DOGE.name)
    expect(getRankFromExp(RANKS.DOGE.expRequired + 50)).toEqual(RANKS.DOGE.name)
    expect(getRankFromExp(RANKS.MORPHEUS.expRequired - 1)).toEqual(RANKS.DOGE.name)
    expect(getRankFromExp(RANKS.MORPHEUS.expRequired)).toEqual(RANKS.MORPHEUS.name)
    expect(getRankFromExp(RANKS.NEO.expRequired)).toEqual(RANKS.NEO.name)
    expect(getRankFromExp(RANKS.NEO.expRequired + 1000)).toEqual(RANKS.NEO.name)
  })
  test('getExpRequiredForNextRank', () => {
    expect(getExpRequiredForNextRank(-1)).toEqual(RANKS.MAGE.expRequired)
    expect(getExpRequiredForNextRank(0)).toEqual(RANKS.MAGE.expRequired)
    expect(getExpRequiredForNextRank(1)).toEqual(RANKS.MAGE.expRequired)
    expect(getExpRequiredForNextRank(RANKS.MAGE.expRequired)).toEqual(
      RANKS.DOGE.expRequired - RANKS.MAGE.expRequired,
    )
    expect(getExpRequiredForNextRank(RANKS.DOGE.expRequired)).toEqual(
      RANKS.MORPHEUS.expRequired - RANKS.DOGE.expRequired,
    )
    expect(getExpRequiredForNextRank(RANKS.MORPHEUS.expRequired)).toEqual(
      RANKS.NEO.expRequired - RANKS.MORPHEUS.expRequired,
    )
    expect(getExpRequiredForNextRank(RANKS.NEO.expRequired)).toEqual(666666)
  })
  test('getAvatarFromExp', () => {
    expect(getAvatarFromExp(-1)).toEqual(RANKS.PAESANT.img)
    expect(getAvatarFromExp(0)).toEqual(RANKS.PAESANT.img)
    expect(getAvatarFromExp(1)).toEqual(RANKS.PAESANT.img)
    Object.keys(RANKS).forEach(rank => {
      expect(getAvatarFromExp(RANKS[rank].expRequired)).toEqual(RANKS[rank].img)
    })
  })
  test('getFlooredExp', () => {
    expect(getFlooredExp(-1)).toEqual(-1)
    expect(getFlooredExp(0)).toEqual(0)
    expect(getFlooredExp(1)).toEqual(1)

    Object.keys(RANKS).forEach(rank => {
      expect(getFlooredExp(RANKS[rank].expRequired)).toEqual(0)
      expect(getFlooredExp(RANKS[rank].expRequired + 5)).toEqual(5)
      expect(getFlooredExp(RANKS[rank].expRequired + 50)).toEqual(50)
    })
    expect(getFlooredExp(RANKS.DOGE.expRequired + RANKS.MORPHEUS.expRequired - 1)).toEqual(
      RANKS.MORPHEUS.expRequired - RANKS.DOGE.expRequired - 1,
    )
    expect(getFlooredExp(RANKS.DOGE.expRequired + RANKS.MORPHEUS.expRequired - 500)).toEqual(0)
    expect(getFlooredExp(RANKS.DOGE.expRequired + RANKS.MORPHEUS.expRequired)).toEqual(
      RANKS.MORPHEUS.expRequired - RANKS.DOGE.expRequired,
    )
    expect(getFlooredExp(RANKS.DOGE.expRequired + RANKS.MORPHEUS.expRequired)).toEqual(
      RANKS.MORPHEUS.expRequired - RANKS.DOGE.expRequired,
    )
  })
})
