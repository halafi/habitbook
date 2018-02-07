// @flow
import moment from 'moment'
import { getSortedGoalsIds } from './helpers'

describe('helpers', () => {
  const dateNow = Date.now
  beforeEach(() => {
    Date.now = jest.fn(() => 1487076708000)
  })
  afterEach(() => {
    Date.now = dateNow
  })
  test('#getSortedGoalsIds', () => {
    const input = {
      '1': {
        name: 'delta',
        target: 365,
        started: 0,
        visibility: 'public',
      },
      '2': {
        name: 'alpha',
        target: 60,
        started: 0,
        visibility: 'public',
      },
      '3': {
        name: 'gamma',
        target: 120,
        started: 0,
        visibility: 'public',
      },
      '4': {
        name: 'beta',
        target: 15,
        started: 0,
        visibility: 'public',
      },
      five: {
        name: 'penta',
        target: 7,
        started: 0,
        visibility: 'public',
      },
    }
    expect(getSortedGoalsIds(input, 'default')).toEqual(['1', '2', '3', '4', 'five']) // correct
    expect(getSortedGoalsIds(input, 'name')).toEqual(['2', '4', '1', '3', 'five']) // incorrect
    expect(getSortedGoalsIds(input, 'progress')).toEqual([])
  })
})
