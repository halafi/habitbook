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
import Tooltip from 'material-ui/Tooltip'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'

import { getElapsedDaysTillNow } from '../../../../../../../../common/services/dateTimeUtils'
import type { Goal } from '../../../../../../../../common/records/Goal'
import { getGoalVisibility } from '../../../../../../../../common/records/GoalVisibility'
import GoalEditForm from './components/GoalEditForm'
import GoalNotes from './components/GoalNotes'
import ProgressChart from './components/ProgressChart/ProgressChart'
import Heatmap from './components/Heatmap/Heatmap'
import { small } from '../../../../../../../../common/consts/styles/breakpoints'

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
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  starsContainer: {
    color: theme.palette.text.secondary,
  },
  heatmap: {
    marginTop: '8px',
    borderRadius: '3px',
    border: '1px #e1e4e8 solid',
    padding: '4px 4px 0 4px',
  },
  [`@media ${small}`]: {
    heatmap: {
      marginTop: '16px',
      padding: '12px 12px 8px 12px',
    },
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
          <Grid container alignItems="center" justify="flex-start">
            <Grid item md={5} xs={6}>
              <Typography className={classes.heading}>
                {goalName} {goal.draft && '(Draft)'}
              </Typography>
            </Grid>
            <Grid item md={2} xs={3}>
              {!goal.draft && (
                <Typography className={classes.secondaryHeading}>
                  {elapsedDaysTillNow} / {goal.target}
                </Typography>
              )}
            </Grid>
            <Grid item md={5} xs={3}>
              {goal.ascensionCount > 0 && (
                <Typography className={classes.starsContainer}>
                  {R.times(
                    n => <StarBorder key={n} className={classes.rightIcon} />,
                    goal.ascensionCount,
                  )}
                </Typography>
              )}
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
            <Grid item xs={12}>
              <form>
                <Grid container justify="space-between">
                  <Grid item xs={goal.draft ? 12 : 8}>
                    <Grid container direction="column">
                      <Grid item xs={12}>
                        <GoalEditForm
                          goal={goal}
                          onRenameGoal={onRenameGoal}
                          onChangeDate={onChangeDate}
                          onChangeVisibility={onChangeVisibility}
                          onChangeTarget={onChangeTarget}
                          readOnly={readOnly}
                          lastReset={lastReset}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <GoalNotes goal={goal} longestStreak={longestStreak} finished={finished} />
                      </Grid>
                    </Grid>
                  </Grid>
                  {!goal.draft && (
                    <Grid item xs={4}>
                      <ProgressChart goal={goal} finished={finished} lastReset={lastReset} />
                    </Grid>
                  )}
                </Grid>
              </form>
            </Grid>
            {!goal.draft && (
              <Grid item xs={12}>
                <Heatmap goal={goal} className={classes.heatmap} />
              </Grid>
            )}
          </Grid>
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
