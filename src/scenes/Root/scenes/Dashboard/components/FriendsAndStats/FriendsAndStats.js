// @flow

import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'
import { compose } from 'redux'
import Friends from './components/Friends'
import Stats from './components/Stats'

type Props = {
  classes: Object,
  created: string,
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
    const { created, classes } = this.props

    return (
      <div className={classes.cardWrapper}>
        <Stats created={created} />
        <Friends />
      </div>
    )
  }
}

export default compose(withStyles(styles))(FriendsAndStats)
