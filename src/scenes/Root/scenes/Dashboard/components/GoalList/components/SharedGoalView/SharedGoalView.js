// @flow

import React, { PureComponent } from 'react'
import * as R from 'ramda'
import moment from 'moment'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import { FormControlLabel } from 'material-ui/Form'
import type { SharedGoal, SharedGoalUser } from '../../../../../../../../common/records/SharedGoal'
import { getElapsedDaysTillNow } from '../../../../../../../../common/services/dateTimeUtils'
import type { User, Users } from '../../../../../../../../common/records/Firebase/User'
import DateTimePicker from '../../../../../../../../common/components/DateTimePicker/DateTimePicker'

type Props = {
  goal: SharedGoal,
  users: Users,
  currentUserId: string,
  onDelete: () => void,
  onChangeDate: (string, number) => void,
  onRenameGoal: any => void,
  onExpand: any => void, // SyntheticEvent<>
  onAcceptSharedGoal: () => void,
  classes: Object,
  readOnly: boolean,
  expanded: boolean,
}

const styles = theme => ({
  form: {
    padding: '0',
  },
  textField: {
    marginLeft: '0px',
    marginRight: '16px',
    width: '150px',
  },
  dateTimePicker: {
    display: 'inline-block',
    marginLeft: '0px',
    marginRight: '16px',
    width: '255px',
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
  panelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

type Participant = SharedGoalUser & User

class SharedGoalView extends PureComponent<Props> {
  render() {
    const {
      goal,
      users,
      currentUserId,
      onDelete,
      onChangeDate,
      onRenameGoal,
      onExpand,
      onAcceptSharedGoal,
      classes,
      readOnly,
      expanded,
    } = this.props

    const elapsedDaysTillNow = getElapsedDaysTillNow(goal.started)
    // const finished = elapsedDaysTillNow >= goal.target

    if (!users) {
      return null
    }

    const participants: Array<Participant> = goal.users
      .sort((a, b) => (a.id === currentUserId ? -1 : a.id.localeCompare(b.id)))
      .map(x => ({ ...x, ...users[x.id] }))

    const currentParticipant: ?Participant = R.compose(
      R.defaultTo(null),
      R.head,
      R.filter(R.propEq('id', currentUserId)),
    )(participants)

    // TODO: last man standing checkbox
    // TODO: make public
    // TODO: add friends you dont have
    // TODO: last man standing
    return (
      <ExpansionPanel expanded={expanded} onChange={onExpand}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {goal.name} {goal.draft && '(Draft)'}
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {elapsedDaysTillNow} / {goal.target}
          </Typography>
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
                    label={goal.draft ? 'Challenge starting' : 'Challenge started'}
                    value={goal.started}
                    onChange={onChangeDate}
                    className={classes.dateTimePicker}
                    disabled={readOnly || !goal.draft}
                  />
                  <DateTimePicker
                    id="end-date"
                    label="Challenge ending"
                    value={moment(goal.started).add(goal.target, 'd')}
                    className={classes.dateTimePicker}
                    disabled
                  />
                </form>
                <br />
                <Typography>
                  {goal.target} days required to complete. If you fail you are out.
                  <br />
                  <br />
                  {!R.all(x => x.accepted)(participants) && (
                    <span>Everyone has to agree to terms for the challenge to start.</span>
                  )}
                  <br />
                  <br />
                  <List>
                    {participants.map(x => (
                      <ListItem key={x.email} dense className={classes.listItem}>
                        <Avatar src={x.avatarUrl} />
                        <ListItemText primary={x.displayName} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            onChange={onAcceptSharedGoal}
                            checked={x.accepted}
                            disabled={x.id !== currentUserId || x.accepted}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Typography>
              </div>
            </div>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        {!readOnly && (
          <ExpansionPanelActions>
            <Button dense onClick={onDelete}>
              Abandon
            </Button>
            {!currentParticipant.accepted && (
              <Button color="primary" dense onClick={onAcceptSharedGoal}>
                Accept
              </Button>
            )}
            {/*<Button dense onClick={null} disabled>*/}
            {/*Fail*/}
            {/*</Button>*/}
            {/*<Button color="primary" dense onClick={null} disabled>*/}
            {/*Finish*/}
            {/*</Button>*/}
          </ExpansionPanelActions>
        )}
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(SharedGoalView)
