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
import Tooltip from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'

import { getElapsedDaysTillNow } from '../../../../../services/dateTime/dateTimeUtils'
import { Goal as GoalType } from './records/GoalRecord'
import { GOAL_DATE_TIME } from './consts/dateTimeConsts'

type Props = {
  goal: GoalType,
  onDelete: string => void,
  onChangeDate: (string, any) => void,
  onToggleDraft: string => void,
  onExtendGoal: string => void,
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
// TODO: difficulty and points
const Goal = ({ goal, onDelete, onChangeDate, onToggleDraft, onExtendGoal, classes }: Props) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography />
      <Typography className={classes.heading}>
        {goal.name} {goal.draft && '(Draft)'}
      </Typography>
      {!goal.draft && (
        <Typography className={classes.secondaryHeading}>
          {getElapsedDaysTillNow(goal.started)} / {goal.target}
        </Typography>
      )}
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
          label={goal.draft ? 'Start from' : 'Started'}
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
      </Typography>
    </ExpansionPanelDetails>
    <Divider />
    <ExpansionPanelActions>
      {goal.draft ? (
        <div>
          <Button dense onClick={onDelete}>
            Discard
          </Button>
          <Tooltip id="tooltip-begin-bottom" title="Begin tracking" placement="bottom">
            <Button dense onClick={onToggleDraft} color="primary">
              Start
            </Button>
          </Tooltip>
        </div>
      ) : (
        <div>
          {getElapsedDaysTillNow(goal.started) >= goal.target ? (
            <span>
              <Button dense onClick={onDelete}>
                Finish
              </Button>
              <Tooltip
                id="tooltip-extend-bottom"
                title="Double your target amount of days"
                placement="bottom"
              >
                <Button dense onClick={onExtendGoal} color="primary">
                  Ascend
                </Button>
              </Tooltip>
            </span>
          ) : (
            <Tooltip
              id="tooltip-reset-bottom"
              title="Reset your progress and start over"
              placement="bottom"
            >
              <Button dense onClick={onToggleDraft}>
                Reset
              </Button>
            </Tooltip>
          )}
        </div>
      )}
    </ExpansionPanelActions>
  </ExpansionPanel>
)

export default withStyles(styles)(Goal)
