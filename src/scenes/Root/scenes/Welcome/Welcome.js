// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

import IntroImg from '../../../../../images/intro.svg'

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

const Intro = ({ classes }: Props) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography type="headline" component="h2">
        Hello
      </Typography>
      <Typography paragraph>
        <br />
        All you can do here is set your personal challenges and track em. Start by logging in.
      </Typography>
    </CardContent>
    <CardMedia className={classes.media} image={IntroImg} title="droidintro" />
  </Card>
)

export default withStyles(styles)(Intro)
