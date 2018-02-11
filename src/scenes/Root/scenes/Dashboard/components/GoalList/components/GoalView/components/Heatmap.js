// @flow

import React, { PureComponent } from 'react'
import * as R from 'ramda'
import moment from 'moment/moment'

import CalendarHeatmap from 'react-calendar-heatmap'
import { getElapsedDaysTillNow } from '../../../../../../../../../common/services/dateTimeUtils'
import type { Goal } from '../../../../../../../../../common/records/Goal'

type Props = {
  goal: Goal,
  className: ?string,
}

const getClassForValue = value => {
  if (!value) {
    return 'color-gitlab-0'
  }
  if (value.count === 0) {
    return 'color-gitlab-1'
  } else {
    return 'color-gitlab-0'
  }
}

class Heatmap extends PureComponent<Props> {
  render() {
    const { goal, className } = this.props

    let heatMapData = []

    if (goal.resets) {
      goal.resets.forEach((resetDateTime: number) => {
        const key = moment(resetDateTime).format('YYYY-MM-DD')
        const idx = heatMapData.findIndex(x => x.date === key)

        if (idx >= 0) {
          heatMapData[idx].count += 1
        } else {
          heatMapData.push({
            date: key,
            count: 1,
          })
        }
      })
    }

    R.times(n => {
      const day = moment(goal.started)
      if (n > 0) {
        day.add(n, 'd')
      }
      const key = day.format('YYYY-MM-DD')
      const idx = heatMapData.findIndex(x => x.date === key)
      if (idx < 0) {
        heatMapData.push({
          date: key,
          count: 0,
        })
      }
    }, getElapsedDaysTillNow(goal.started))

    heatMapData = heatMapData.sort((a, b) => {
      if (a.date === b.date) {
        return 0
      } else if (moment(a.date).valueOf() > moment(b.date).valueOf()) {
        return 1
      }
      return -1
    })

    return (
      <div className={className}>
        <CalendarHeatmap
          // startDate={moment(goal.started)
          //   .startOf('month')
          //   .toDate()}
          // numDays={84}
          // showOutOfRangeDays
          startDate={moment()
            .subtract(1, 'y')
            .toDate()}
          endDate={moment().toDate()}
          values={heatMapData}
          horizontal
          gutterSize={1}
          showMonthLabels={false}
          showWeekdayLabels={false}
          classForValue={getClassForValue}
        />
      </div>
    )
  }
}

export default Heatmap
