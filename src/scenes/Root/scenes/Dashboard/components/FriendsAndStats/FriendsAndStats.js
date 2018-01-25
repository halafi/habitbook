// @flow

import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'
import { compose } from 'redux'
import Friends from './components/Friends'
import Stats from './components/Stats'
import type { Profile } from '../../../../../../common/records/Firebase/Profile'

type Props = {
  classes: Object,
  created: string,
  profile: Profile,
}

const styles = {
  cardWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
}

class FriendsAndStats extends PureComponent<Props> {
  render() {
    const { created, profile, classes } = this.props

    return (
      <div className={classes.cardWrapper}>
        <Stats created={created} profile={profile} />
        <Friends />
      </div>
    )
  }
}

export default compose(withStyles(styles))(FriendsAndStats)
