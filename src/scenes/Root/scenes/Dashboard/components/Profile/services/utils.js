import moment from 'moment/moment'
import * as R from 'ramda'

// not nice, moment + 100 years millis
const MAX = 4675746453708

export const getFirstGoalStarted: Object => number = R.compose(
  R.ifElse(x => x && x === MAX, R.always(null), R.identity),
  R.ifElse(R.isEmpty, R.always(null), R.reduce(R.min, MAX)),
  R.map(R.prop('started')),
  R.values,
)

export const getLastGoalReset: Object => number = R.compose(
  R.ifElse(x => x === 0, R.always(null), R.identity),
  R.reduce(R.max, 0),
  R.reduce(R.concat, []),
  R.map(R.propOr([], 'resets')),
  R.values,
)
