// @flow

import React, { Component } from 'react'
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
import DateTimePicker from '../../../../../../../../common/components/DateTimePicker/DateTimePicker'
import type { Goal } from '../../../../../../../../common/records/Goal'
import {
  getGoalVisibility,
  GOAL_VISIBILITIES,
} from '../../../../../../../../common/records/GoalVisibility'
import { getFinishKarma, getAscensionKarma } from '../../services/helpers'
import ProgressChart from './components/ProgressChart'
import Heatmap from './components/Heatmap'
// import MomentumChart from './components/MomentumChart'

type Props = {
  goal: Goal,
  onDelete: () => void,
  onComplete: () => void,
  onChangeDate: (?number) => void,
  onChangeTarget: any => void,
  onToggleDraft: string => void,
  onFail: string => void,
  onExtendGoal: string => void,
  onChangeVisibility: string => void,
  onRenameGoal: any => void, // SyntheticEvent<>
  onExpand: any => void, // SyntheticEvent<>
  classes: Object,
  readOnly: boolean,
  expanded: boolean,
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
  form: {
    marginTop: '-12px',
    padding: '0',
  },
  textField: {
    marginLeft: '0px',
    marginRight: '16px',
    width: '150px',
  },
  numberField: {
    marginLeft: '0px',
    marginRight: '16px',
    width: '100px',
  },
  dateTimePicker: {
    display: 'inline-block',
    marginLeft: '0px',
    marginRight: '8px',
    width: '255px',
  },
  panelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  heatmap: {
    marginTop: '16px',
    height: '150',
    padding: '16px 16px 14px 16px',
    borderRadius: '3px',
    borderColor: '#d1d5da',
    border: '1px #e1e4e8 solid',
  },
})

class GoalView extends Component<Props> {
  render() {
    const {
      goal,
      onDelete,
      onComplete,
      onChangeDate,
      onChangeTarget,
      onToggleDraft,
      onFail,
      onExtendGoal,
      onChangeVisibility,
      onRenameGoal,
      onExpand,
      classes,
      readOnly,
      expanded,
    } = this.props

    const goalName = goal.visibility === getGoalVisibility(0) ? ' ¯\\_(ツ)_/¯' : goal.name

    if ((readOnly && goal.visibility !== getGoalVisibility(2)) || (readOnly && goal.draft)) {
      return null
    }

    const lastReset = goal.resets && goal.resets[goal.resets.length - 1]
    const elapsedDaysTillNow = getElapsedDaysTillNow(lastReset || goal.started)
    const finished = elapsedDaysTillNow >= goal.target
    const longestStreak = goal.streaks && goal.streaks.length ? Math.max(...goal.streaks) : null

    return (
      <ExpansionPanel expanded={expanded} onChange={onExpand}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {goalName} {goal.draft && '(Draft)'}
          </Typography>
          {!goal.draft && (
            <Typography className={classes.secondaryHeading}>
              {elapsedDaysTillNow} / {goal.target}
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
            <div className={classes.panelContainer}>
              <div>
                <form className={classes.form}>
                  <TextField
                    id="name"
                    label="Name"
                    value={goal.name}
                    onChange={onRenameGoal}
                    className={classes.textField}
                    disabled={readOnly}
                  />
                  <DateTimePicker
                    id="start-date"
                    label={goal.draft ? 'Start from' : 'Started'}
                    value={goal.started}
                    onChange={onChangeDate}
                    className={classes.dateTimePicker}
                    disabled={readOnly || !goal.draft}
                  />
                  {goal.draft && (
                    <TextField
                      id="target"
                      label="Days"
                      value={goal.target}
                      onChange={onChangeTarget}
                      margin="normal"
                      className={classes.numberField}
                    />
                  )}
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
                    disabled={readOnly}
                  >
                    {GOAL_VISIBILITIES.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </form>
                <br />
                <Typography>
                  {goal.target} days required to complete.
                  <br />
                  {longestStreak
                    ? `Longest streak: ${longestStreak} ${longestStreak > 1 ? 'days' : 'day'}.`
                    : ''}
                </Typography>
                {finished &&
                  !goal.draft && (
                    <Typography component="div">
                      <br />
                      Make a choice:
                      <ul>
                        <li>
                          Collect {getFinishKarma(goal)} Karma and be done with this challenge
                        </li>
                        <li>
                          Collect {getAscensionKarma(goal)} Karma and double the challenge duration
                          (
                          {getAscensionKarma({
                            ...goal,
                            ascensionCount: goal.ascensionCount + 1,
                          })}{' '}
                          next time)
                        </li>
                      </ul>
                    </Typography>
                  )}
              </div>
              {!goal.draft && (
                <div>
                  <ProgressChart goal={goal} finished={finished} lastReset={lastReset} />
                </div>
              )}
            </div>
            {!goal.draft && (
              <div>
                {/*{goal.resets && <MomentumChart goal={goal} />}*/}
                <Heatmap goal={goal} className={classes.heatmap} />
              </div>
            )}
          </div>
        </ExpansionPanelDetails>
        <Divider />
        {!readOnly && (
          <ExpansionPanelActions>
            <Button dense onClick={onDelete}>
              Remove
            </Button>
            {!goal.draft && (
              <Button dense onClick={onFail}>
                Reset
              </Button>
            )}
            {goal.draft ? (
              <Button disabled={goal.target <= 0} dense onClick={onToggleDraft} color="primary">
                Start
              </Button>
            ) : (
              finished && [
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
              ]
            )}
          </ExpansionPanelActions>
        )}
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(GoalView)
