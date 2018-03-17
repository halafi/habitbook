// @flow
import moment from 'moment'

export const getElapsedDaysTillNow = (fromMillis: number) => moment().diff(moment(fromMillis), 'd')
export const getElapsedMinutesTillNow = (fromMillis: number) =>
  moment().diff(moment(fromMillis), 'm')
export const getElapsedDaysBetween = (fromMillis: number, toMillis: number) =>
  moment(toMillis).diff(moment(fromMillis), 'd')
export const getElapsedMinutesBetween = (fromMillis: number, toMillis: number) =>
  moment(toMillis).diff(moment(fromMillis), 'm')
