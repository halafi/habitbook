// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

import NeoPepeImg from '../../../../../images/neopepe.jpg'

type Props = {
  classes: Object,
}

const styles = {
  card: {
    width: '100%',
  },
  media: {
    alignContent: 'center',
    maxWidth: 400,
    height: 400,
  },
}

const Intro = ({ classes }: Props) => (
  <Card className={classes.card}>
    <CardMedia className={classes.media} image={NeoPepeImg} title="Neo Pepe" />
    <CardContent>
      <Typography type="headline" component="h2">
        Welcome to Droid
      </Typography>
      <Typography type="subheading" paragraph>
        Discipline on steroids
      </Typography>
      <Typography component="p" paragraph>
        In here you can track progress and gamify forming of your new habits (or quitting some
        shitty ones) and as you work towards becoming better version of yourself you will obtain
        PEPE EXP and achieve ranks.
      </Typography>
      <Typography component="p" paragraph color="secondary">
        On average, it takes more than 2 months before a new behavior becomes automatic — 66 days to
        be exact.
      </Typography>
      <Typography component="p" paragraph color="secondary">
        Neo: What are you trying to tell me? That I can dodge bullets if I quit smoking and stop
        binge eating?<br />
        Morpheus: No, Neo. I’m trying to tell you that when you quit smoking and lose fat, people
        will stop firing weapons at you.
      </Typography>
    </CardContent>
  </Card>
)

export default withStyles(styles)(Intro)
