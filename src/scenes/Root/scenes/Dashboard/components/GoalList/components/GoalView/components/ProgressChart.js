// @flow

import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import type { Goal } from '../../../../../../../../../common/records/Goal'

type Props = {
  goal: Goal,
  elapsedDaysTillNow: number,
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
    const { goal, elapsedDaysTillNow, finished } = this.props

    const progressChartData = [
      {
        name: 'Target',
        value:
          Number(goal.target) - elapsedDaysTillNow >= 0
            ? Number(goal.target) - elapsedDaysTillNow
            : 0,
      },
      {
        name: 'Finished',
        value: elapsedDaysTillNow > Number(goal.target) ? Number(goal.target) : elapsedDaysTillNow,
      },
    ]

    return (
      <PieChart width={200} height={200}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          activeIndex={1}
          activeShape={renderActiveShape}
          data={progressChartData}
          cx="65%"
          cy="50%"
          innerRadius={50}
          outerRadius={65}
          fill="#8884d8"
          paddingAngle={finished || elapsedDaysTillNow <= 0 ? 0 : 3}
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
