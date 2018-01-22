// @flow

import React from 'react'
import moment from 'moment'

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import Done from 'material-ui-icons/Done'

import { Goal as GoalType } from './records/GoalRecord'
import { GOAL_DATE_TIME } from './consts/dateTimeConsts'

type Props = {
  goal: GoalType,
  onDelete: string => void,
  onChangeDate: (string, any) => void,
  onToggleDraft: string => void,
  classes: any,
}

const styles = theme => ({
  leftIcon: {
    marginRight: '4px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
})

// TODO: controlled accordion
// TODO: min date today
// TODO: moment computes
const Goal = ({ goal, onDelete, onChangeDate, onToggleDraft, classes }: Props) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography />
      <Typography className={classes.heading}>{goal.name}</Typography>
      <Typography className={classes.secondaryHeading}>
        {moment(goal.completedUntil).diff(moment(goal.started), 'd')} / {goal.target}
      </Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        {goal.target}{' '}
        {goal.targetType === 'DAYS'
          ? 'days required to complete.'
          : 'performances required to complete.'}
        <br />
        <br />
        <TextField
          id="start-date"
          label="Start from"
          type="date"
          value={moment(goal.started).format(GOAL_DATE_TIME)}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={onChangeDate}
          disabled={!goal.draft}
        />
        <br />
        <br />
        <TextField
          id="end-date"
          label="Completed until"
          type="date"
          value={moment(goal.completedUntil).format(GOAL_DATE_TIME)}
          InputLabelProps={{
            shrink: true,
          }}
          disabled
        />
        <Button className={classes.button} color="primary">
          <Done className={classes.leftIcon} />{' '}
          {moment(goal.completedUntil)
            .clone()
            .add(1, 'd')
            .format('ddd')}{' '}
          Done
        </Button>
        <Button mini className={classes.button} color="primary">
          <Done className={classes.leftIcon} />{' '}
          {moment(goal.completedUntil)
            .clone()
            .add(1, 'd')
            .format('ddd')}
          {' - '}
          {moment(goal.completedUntil)
            .clone()
            .add(1, 'd')
            .format('ddd')}{' '}
          Done
        </Button>
      </Typography>
    </ExpansionPanelDetails>
    <Divider />
    <ExpansionPanelActions>
      {goal.draft ? (
        <div>
          <Button dense onClick={onDelete}>
            Discard
          </Button>
          <Button dense onClick={onToggleDraft} color="primary">
            Start
          </Button>
        </div>
      ) : (
        <div>
          <Button dense onClick={onDelete}>
            Give up
          </Button>
          <Button dense onClick={onToggleDraft}>
            Retry
          </Button>
          <Button disabled dense onClick={null} color="primary">
            <Done className={classes.leftIcon} /> Done
          </Button>
          <Button disabled dense onClick={null} color="primary">
            Extend
          </Button>
        </div>
      )}
    </ExpansionPanelActions>
  </ExpansionPanel>
)

export default withStyles(styles)(Goal)
