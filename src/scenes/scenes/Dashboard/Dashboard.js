// @flow

import React, { Component } from 'react'
import moment from 'moment'

import Stats from './components/Stats/Stats'
import Goals from './components/Goals/Goals'

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
        {/*<Stats created={created} profile={profile} />*/}
        <Goals />
      </div>
    )
  }
}

export default Intro
