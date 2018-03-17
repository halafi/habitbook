// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

type Props = {
  classes: Object,
}

const styles = {
  card: {
    width: '100%',
  },
  media: {
    alignContent: 'center',
    height: '500px',
    padding: '8px',
  },
}

const Welcome = ({ classes }: Props) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography type="headline" component="h2">
        Oh hi there
      </Typography>
      <Typography paragraph>
        <br />
        All you can do here is set your personal challenges and track em.<br />Start with login.
      </Typography>
    </CardContent>
  </Card>
)

export default withStyles(styles)(Welcome)
