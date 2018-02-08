// @flow
import moment from 'moment'
import { getSortedGoalsIds } from './helpers'

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
    expect(getSortedGoalsIds(input, 'default')).toEqual(['1', '2', '3', '4', 'five'])
    expect(getSortedGoalsIds(input, 'name')).toEqual(['2', '4', '1', '3', 'five'])
    expect(getSortedGoalsIds(input, 'progress')).toEqual(['4', 'five', '2', '3', '1'])
    expect(getSortedGoalsIds(input, 'oldest')).toEqual(['4', 'five', '2', '3', '1'])
  })
})
