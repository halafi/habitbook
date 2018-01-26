// @flow

import React, { Component } from 'react'
import moment from 'moment'
import * as R from 'ramda'

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import StarBorder from 'material-ui-icons/StarBorder'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Tooltip from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'

import { getElapsedDaysTillNow } from '../../../../../../../../common/services/dateTimeUtils'
import type { Goal } from '../../../../../../../../common/records/Goal'
import {
  getGoalVisibility,
  GOAL_VISIBILITIES,
} from '../../../../../../../../common/records/GoalVisibility'
import { GOAL_DATE_TIME } from '../../../../../../../../common/consts/dateTimeConsts'

type Props = {
  goal: Goal,
  onDelete: () => void,
  onComplete: () => void,
  onChangeDate: (string, any) => void,
  onToggleDraft: string => void,
  onExtendGoal: string => void,
  onChangeVisibility: string => void,
  classes: any,
}

const styles = theme => ({
  leftIcon: {
    marginRight: '4px',
  },
  rightIcon: {
    marginLeft: '4px',
    height: '16px',
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
  starsContainer: {
    marginLeft: '10px',
    color: theme.palette.text.secondary,
  },
})

// TODO: controlled accordion
// TODO: min date today
// TODO: moment computes
// TODO: difficulty and points
class GoalView extends Component<Props> {
  // constructor(props: Props) {
  //   super(props)
  //   this.state = {
  //
  //   }
  // }
  render() {
    const {
      goal,
      onDelete,
      onComplete,
      onChangeDate,
      onToggleDraft,
      onExtendGoal,
      onChangeVisibility,
      classes,
    } = this.props

    const goalName = goal.visibility === getGoalVisibility(0) ? ' ¯\\_(ツ)_/¯' : goal.name

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {goalName} {goal.draft && '(Draft)'}
          </Typography>
          {!goal.draft && (
            <Typography className={classes.secondaryHeading}>
              {getElapsedDaysTillNow(goal.started)} / {goal.target}
            </Typography>
          )}
          {goal.ascensionCount > 0 && (
            <Typography className={classes.starsContainer}>
              {R.times(
                n => <StarBorder key={n} className={classes.rightIcon} />,
                goal.ascensionCount,
              )}
            </Typography>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              {goal.target}{' '}
              {goal.targetType === 'DAYS'
                ? 'days required to complete.'
                : 'performances required to complete.'}
            </Typography>
            <br />
            <TextField
              id="start-date"
              label={goal.draft ? 'Start from' : 'Started'}
              type="datetime-local"
              value={moment(goal.started).format(GOAL_DATE_TIME)}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChangeDate}
              disabled={!goal.draft}
            />
            <br />
            <TextField
              id="select-target-type"
              select
              label="Visible to"
              value={goal.visibility}
              onChange={onChangeVisibility}
              SelectProps={{
                native: true,
              }}
              margin="normal"
              className={classes.textField}
            >
              {GOAL_VISIBILITIES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          {!goal.draft && (
            <Tooltip
              id="tooltip-reset-bottom"
              title="Reset all your progress and start over"
              placement="bottom"
            >
              <Button dense onClick={onToggleDraft}>
                Reset
              </Button>
            </Tooltip>
          )}
          {goal.draft
            ? [
                <Button key="discardBtn" dense onClick={onDelete}>
                  Discard
                </Button>,
                <Tooltip
                  key="startBtn"
                  id="tooltip-begin-bottom"
                  title="Begin tracking"
                  placement="bottom"
                >
                  <Button dense onClick={onToggleDraft} color="primary">
                    Start
                  </Button>
                </Tooltip>,
              ]
            : getElapsedDaysTillNow(goal.started) >= goal.target && [
                <Button key="finishBtn" dense onClick={onComplete}>
                  Finish
                </Button>,
                <Tooltip
                  key="ascendBtn"
                  id="tooltip-extend-bottom"
                  title="Double your target amount of days"
                  placement="bottom"
                >
                  <Button dense onClick={onExtendGoal} color="primary">
                    Ascend
                  </Button>
                </Tooltip>,
              ]}
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(GoalView)
