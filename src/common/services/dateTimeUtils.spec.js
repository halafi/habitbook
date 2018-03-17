import moment from 'moment'
import {
  getElapsedDaysTillNow,
  getElapsedMinutesTillNow,
  getElapsedDaysBetween,
  getElapsedMinutesBetween,
} from './dateTimeUtils'

describe('dateTimeUtils', () => {
  const dateNow = Date.now

  beforeEach(() => {
    Date.now = jest.fn(() => 1518110488752) // lock at "2018-02-08T18:21:45+01:00"
  })

  afterEach(() => {
    Date.now = dateNow
  })

  test('#getElapsedDaysTillNow', () => {
    expect(getElapsedDaysTillNow(moment().subtract(1, 'd'))).toEqual(1)
    expect(getElapsedDaysTillNow(moment().subtract(5, 'd'))).toEqual(5)
  })

  test('#getElapsedMinutesTillNow', () => {
    expect(getElapsedMinutesTillNow(moment().subtract(1, 'd'))).toEqual(24 * 60)
    expect(getElapsedMinutesTillNow(moment().subtract(5, 'd'))).toEqual(5 * 24 * 60)
  })

  test('#getElapsedDaysBetween', () => {
    expect(getElapsedDaysBetween(moment().subtract(1, 'd'), moment())).toEqual(1)
    expect(getElapsedDaysBetween(moment().subtract(5, 'd'), moment())).toEqual(5)
  })

  test('#getElapsedMinutesBetween', () => {
    expect(getElapsedMinutesBetween(moment().subtract(1, 'd'), moment())).toEqual(24 * 60)
    expect(getElapsedMinutesBetween(moment().subtract(5, 'd'), moment())).toEqual(5 * 24 * 60)
  })
})
