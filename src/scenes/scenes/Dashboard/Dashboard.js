// @flow

import React, { Component } from 'react'
import moment from 'moment'

import Stats from './components/Stats/Stats'
import Goals from './components/Goals/GoalList'

import type { Profile } from '../../records/Profile'

type Props = {
  createdAt: string, // number
  profile: Profile,
}

class Intro extends Component<Props> {
  render() {
    const { createdAt, profile } = this.props

    const created = moment(Number(createdAt)).format('DD/MM/YYYY')

    return (
      <div className="Dashboard">
        <Goals />
        <Stats created={created} profile={profile} />
      </div>
    )
  }
}

export default Intro
