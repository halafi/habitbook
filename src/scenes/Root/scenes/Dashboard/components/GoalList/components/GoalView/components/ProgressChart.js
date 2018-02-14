// @flow

import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import type { Goal } from '../../../../../../../../../common/records/Goal'
import { getElapsedMinutesTillNow } from '../../../../../../../../../common/services/dateTimeUtils'

type Props = {
  goal: Goal,
  lastReset: ?number,
  finished: boolean,
}

const COLORS = ['#C0C0C0', '#3748AC']

const renderActiveShape = (props: Object) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props

  return (
    <g>
      <text
        fontFamily="Roboto"
        fontSize="16"
        fontWeight={700}
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {(percent * 100).toFixed(0)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
      />
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
      />
    </g>
  )
}

class ProgressChart extends PureComponent<Props> {
  render() {
    const { goal, lastReset, finished } = this.props

    const elapsedMinutesTillNow = getElapsedMinutesTillNow(lastReset || goal.started)
    const elapsedMinutes = elapsedMinutesTillNow >= 0 ? elapsedMinutesTillNow : 0

    const goalInMinutes = Number(goal.target) * 24 * 60

    const progressChartData = [
      {
        name: 'Target',
        value: goalInMinutes - elapsedMinutes > 0 ? goalInMinutes - elapsedMinutes : 0,
      },
      {
        name: 'Finished',
        value: elapsedMinutes > goalInMinutes ? goalInMinutes : elapsedMinutes,
      },
    ]

    return (
      <PieChart width={200} height={150}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          activeIndex={1}
          activeShape={renderActiveShape}
          data={progressChartData}
          cx="65%"
          cy="50%"
          innerRadius={55}
          outerRadius={65}
          fill="#8884d8"
          paddingAngle={finished || elapsedMinutes <= 0 ? 0 : 3}
        >
          {progressChartData.map((entry, index) => (
            <Cell key={entry} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}

export default ProgressChart
