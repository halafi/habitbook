// @flow

import React, { Component } from 'react'
import moment from 'moment'

import Goals from './components/Goals/GoalList'
import FriendsAndStats from './components/FriendsAndStats/FriendsAndStats'

import type { Profile } from '../../../../common/records/Firebase/Profile'

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
        <FriendsAndStats created={created} profile={profile} />
      </div>
    )
  }
}

export default Intro
