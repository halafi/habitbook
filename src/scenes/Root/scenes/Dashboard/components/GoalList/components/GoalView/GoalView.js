// @flow

import React, { Component } from 'react'
import moment from 'moment'
import * as R from 'ramda'
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts'

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
import { getFinishKarma, getAscensionKarma } from '../services/helpers'

type Props = {
  goal: Goal,
  onDelete: () => void,
  onComplete: () => void,
  onChangeDate: (string, any) => void,
  onToggleDraft: string => void,
  onReset: string => void,
  onExtendGoal: string => void,
  onChangeVisibility: string => void,
  onRenameGoal: any => void, // SyntheticEvent<> TODO flowtyped
  classes: any,
  readOnly: boolean,
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
    width: '200px',
  },
  panelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  // descriptionField: {
  //   marginLeft: '0px',
  //   marginRight: '16px',
  //   width: '100%',
  // },
})

const COLORS = ['#C0C0C0', '#3748AC']

// TODO: extract to helpers
const renderActiveShape = (props: Object) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props

  return (
    <g>
      <text
        fontFamily="Roboto"
        fontSize="16"
        fontWeight={700}
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {percent * 100}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
      />
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
      />
    </g>
  )
}

// TODO: controlled accordion
// TODO: min date today
// TODO: moment computes
// TODO: difficulty and points
class GoalView extends Component<Props> {
  render() {
    const {
      goal,
      onDelete,
      onComplete,
      onChangeDate,
      onToggleDraft,
      onReset,
      onExtendGoal,
      onChangeVisibility,
      onRenameGoal,
      classes,
      readOnly,
    } = this.props

    const goalName = goal.visibility === getGoalVisibility(0) ? ' ¯\\_(ツ)_/¯' : goal.name

    if ((readOnly && goal.visibility !== getGoalVisibility(2)) || (readOnly && goal.draft)) {
      return null
    }

    const elapsedDaysTillNow = getElapsedDaysTillNow(goal.started)
    const finished = elapsedDaysTillNow >= goal.target

    const chartData = [
      {
        name: 'Target',
        value:
          Number(goal.target) - elapsedDaysTillNow >= 0
            ? Number(goal.target) - elapsedDaysTillNow
            : 0,
      },
      {
        name: 'Finished',
        value: elapsedDaysTillNow > Number(goal.target) ? Number(goal.target) : elapsedDaysTillNow,
      },
    ]

    return (
      <ExpansionPanel>
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
                <TextField
                  id="start-date"
                  label={goal.draft ? 'Start from' : 'Started'}
                  type="datetime-local"
                  value={moment(goal.started).format(GOAL_DATE_TIME)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onChangeDate}
                  className={classes.textField}
                  disabled={readOnly || !goal.draft}
                />
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
                {goal.streak
                  ? `Longest streak: ${goal.streak} ${goal.streak > 1 ? 'days' : 'day'}.`
                  : ''}
              </Typography>
              {finished &&
                !goal.draft && (
                  <Typography component="div">
                    <br />
                    Make a choice:
                    <ul>
                      <li>Collect {getFinishKarma(goal)} Karma and be done with this challenge</li>
                      <li>
                        Collect {getAscensionKarma(goal)} Karma and double the challenge duration (
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
            <div>
              <ResponsiveContainer width={200} height={200}>
                <PieChart width={200} height={200}>
                  <Pie
                    isAnimationActive={false}
                    activeIndex={1}
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="65%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    fill="#8884d8"
                    paddingAngle={finished || elapsedDaysTillNow <= 0 ? 0 : 3}
                  >
                    {chartData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        {!readOnly && (
          <ExpansionPanelActions>
            {!goal.draft && (
              <Button dense onClick={onReset}>
                Reset
              </Button>
            )}
            {goal.draft
              ? [
                  <Button key="discardBtn" dense onClick={onDelete}>
                    Remove
                  </Button>,
                  <Button dense onClick={onToggleDraft} color="primary">
                    Start
                  </Button>,
                ]
              : finished && [
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
        )}
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(GoalView)
