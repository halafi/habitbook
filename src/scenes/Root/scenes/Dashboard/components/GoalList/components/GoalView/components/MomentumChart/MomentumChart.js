// @flow

import React, { PureComponent } from 'react'
import * as R from 'ramda'
import moment from 'moment/moment'
import { ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts'

import { getElapsedDaysTillNow } from '../../../../../../../../../../common/services/dateTimeUtils'
import type { Goal } from '../../../../../../../../../../common/records/Goal'

type Props = {
  goal: Goal,
}

class MomentumChart extends PureComponent<Props> {
  render() {
    const { goal } = this.props
    const momentumChartData = []

    if (goal.resets) {
      R.times(n => {
        const resetsOnCurrentDay = goal.resets.filter(
          reset => moment(reset).diff(moment(goal.started), 'd') - 1 === n,
        )

        const numOfResets = resetsOnCurrentDay.length

        if (numOfResets) {
          // Lose 1 point for failed day, another 0.2 points for every other fail on the same day
          const decreasePoints = momentumChartData[n - 1]
            ? momentumChartData[n - 1].points - 1 - 0.2 * numOfResets
            : 0

          momentumChartData.push({
            name: moment(goal.started)
              .add(n, 'd')
              .format('DD MMM'),
            points: decreasePoints,
          })
        } else {
          // Get 0.25 points for good day, 0.5 points if you lose more than 1 point previous day
          const diff =
            momentumChartData[n - 2] &&
            momentumChartData[n - 1] &&
            momentumChartData[n - 2].points - momentumChartData[n - 1].points >= 1

          const increasePoints = momentumChartData[n - 1]
            ? momentumChartData[n - 1].points + (diff ? 0.5 : 0.25)
            : 0.25
          momentumChartData.push({
            name: moment(goal.started)
              .add(n, 'd')
              .format('DD MMM'),
            points: increasePoints,
          })
        }
      }, getElapsedDaysTillNow(goal.started))
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={momentumChartData}>
          <CartesianGrid strokeDasharray="1 1" />
          <Line
            dot={false}
            type="step"
            dataKey="points"
            stroke="#8884d8"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default MomentumChart
