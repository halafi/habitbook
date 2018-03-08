import moment from 'moment'
import { getSortedGoalsIds, getSortedSharedGoalsIds } from './helpers'
import { GOAL_SORT_TYPES } from '../consts/sortTypes'

describe('helpers', () => {
  const dateNow = Date.now
  beforeEach(() => {
    Date.now = jest.fn(() => 1518110488752) // lock at "2018-02-08T18:21:45+01:00"
  })
  afterEach(() => {
    Date.now = dateNow
  })
  test('#getSortedGoalsIds', () => {
    const input = {
      '1': {
        name: 'delta',
        target: 365,
        started: moment().subtract(1, 'd'),
        created: moment().subtract(1, 'd'),
        visibility: 'public',
      },
      '2': {
        name: 'alpha',
        target: 60,
        started: moment().subtract(10, 'd'),
        created: moment().subtract(10, 'd'),
        visibility: 'public',
      },
      '3': {
        name: 'gamma',
        target: 120,
        started: moment().subtract(5, 'd'),
        created: moment().subtract(5, 'd'),
        visibility: 'public',
      },
      '4': {
        name: 'beta',
        target: 15,
        started: moment().subtract(30, 'd'),
        created: moment().subtract(30, 'd'),
        visibility: 'public',
      },
      five: {
        name: 'penta',
        target: 7,
        started: moment().subtract(15, 'd'),
        created: moment().subtract(15, 'd'),
        visibility: 'public',
      },
    }
    expect(getSortedGoalsIds(input, GOAL_SORT_TYPES[0].value)).toEqual(['2', '4', '1', '3', 'five'])
    expect(getSortedGoalsIds(input, GOAL_SORT_TYPES[1].value)).toEqual(['4', 'five', '2', '3', '1'])
    expect(getSortedGoalsIds(input, GOAL_SORT_TYPES[2].value)).toEqual(['4', 'five', '2', '3', '1'])
  })

  test('#getSortedSharedGoalsIds', () => {
    const uid1 = 'abcd'
    const uid2 = 'efgh'
    const uid3 = 'abgh'
    const u1 = {
      id: uid1,
      accepted: true,
      failed: null,
      abandoned: false,
    }
    const u1Abandoned = {
      ...u1,
      abandoned: true,
    }
    const u2 = {
      id: uid2,
      accepted: true,
      failed: null,
      abandoned: false,
    }
    const u3 = {
      id: uid3,
      accepted: true,
      failed: null,
      abandoned: false,
    }
    const user12 = [u1, u2]
    const user13 = [u1Abandoned, u3]
    const user23 = [u2, u3]
    const input = {
      '1': {
        name: 'delta',
        target: 365,
        started: moment().subtract(1, 'd'),
        created: moment().subtract(1, 'd'),
        draft: false,
        users: user12,
      },
      '2': {
        name: 'alpha',
        target: 60,
        started: moment().subtract(10, 'd'),
        created: moment().subtract(10, 'd'),
        draft: false,
        users: user12,
      },
      '3': {
        name: 'gamma',
        target: 120,
        started: moment().subtract(5, 'd'),
        created: moment().subtract(5, 'd'),
        draft: false,
        users: user13,
      },
      '4': {
        name: 'beta',
        target: 15,
        started: moment().subtract(30, 'd'),
        created: moment().subtract(30, 'd'),
        draft: false,
        users: user23,
      },
      five: {
        name: 'penta',
        target: 7,
        started: moment().subtract(15, 'd'),
        created: moment().subtract(15, 'd'),
        draft: false,
        users: user13,
      },
    }
    // user uid1 abandoned goal five
    expect(getSortedSharedGoalsIds(input, uid1)).toEqual(['1', '2'])
    expect(getSortedSharedGoalsIds(input, uid2)).toEqual(['1', '2', '4'])
    expect(getSortedSharedGoalsIds(input, uid3)).toEqual(['3', '4', 'five'])
  })
})
