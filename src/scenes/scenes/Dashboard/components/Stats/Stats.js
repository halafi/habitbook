// @flow

import React from 'react'

import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles/index'

import type { Profile } from '../../../../records/Profile'

type Props = {
  classes: Object,
  created: string,
  profile: Profile,
}

const styles = {
  card: {
    width: '100%',
  },
}

const Stats = ({ classes, created, profile }: Props) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography type="headline" component="h2">
        {profile.displayName}
      </Typography>
      <Typography component="ul" paragraph>
        <li>Rank: Faggot</li>
        <li>Exp: 0 (1000 needed to next rank)</li>
        <li>Goals (habits) tracked: 0</li>
        <li>Goals completed: 0</li>
        <li>Member since: {created}</li>
      </Typography>
    </CardContent>
  </Card>
)

export default withStyles(styles)(Stats)
