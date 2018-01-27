// @flow

import React, { Component } from 'react'

import GoalList from './components/GoalList/GoalList'
import FriendsAndStats from './components/FriendsAndStats/FriendsAndStats'

type Props = {}

class Intro extends Component<Props> {
  render() {
    return (
      <div className="Dashboard">
        <GoalList />
        <FriendsAndStats />
      </div>
    )
  }
}

export default Intro
