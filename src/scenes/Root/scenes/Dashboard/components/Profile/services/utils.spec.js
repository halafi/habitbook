import { getFirstGoalStarted, getLastGoalReset } from './utils'

describe('Profile utils', () => {
  test('getFirstGoalStarted', () => {
    const input = {
      abc: {
        started: 10000,
        created: 5000,
      },
      dfg: {
        started: 20000,
        created: 7000,
      },
    }
    expect(getFirstGoalStarted({})).toEqual(null)
    expect(getFirstGoalStarted(input)).toEqual(10000)
  })

  test('getLastGoalReset', () => {
    const input = {
      abc: {
        started: 10000,
        resets: [1, 2, 3],
      },
      dfg: {
        started: 20000,
      },
      foo: {
        resets: [5, 4, 10, 6],
      },
      bar: {
        resets: [7, 8],
      },
      nope: {},
    }

    expect(getLastGoalReset(input)).toEqual(10)
    expect(getLastGoalReset({})).toEqual(null)
  })
})
