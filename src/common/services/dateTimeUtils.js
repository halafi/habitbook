import moment from 'moment'

export const getElapsedDaysTillNow = (fromMillis: number) => moment().diff(moment(fromMillis), 'd')
