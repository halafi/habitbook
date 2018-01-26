// @flow

import React, { Component } from 'react'
import moment from 'moment'

import GoalList from './components/GoalList/GoalList'
import FriendsAndStats from './components/FriendsAndStats/FriendsAndStats'

type Props = {
  createdAt: string, // number
}

class Intro extends Component<Props> {
  render() {
    const { createdAt } = this.props

    const created = moment(Number(createdAt)).format('DD/MM/YYYY')

    return (
      <div className="Dashboard">
        <GoalList />
        <FriendsAndStats created={created} />
      </div>
    )
  }
}

export default Intro
