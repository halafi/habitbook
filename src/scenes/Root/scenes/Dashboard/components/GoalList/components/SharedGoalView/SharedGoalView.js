// @flow

import React, { PureComponent } from 'react'
import * as R from 'ramda'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import type { SharedGoal } from '../../../../../../../../common/records/SharedGoal'
import { getElapsedDaysTillNow } from '../../../../../../../../common/services/dateTimeUtils'
import type { Users } from '../../../../../../../../common/records/Firebase/User'

type Props = {
  goal: SharedGoal,
  users: Users,
  currentUserId: string,
  onDelete: () => void,
  onExpand: any => void, // SyntheticEvent<>
  classes: Object,
  readOnly: boolean,
  expanded: boolean,
}

const styles = theme => ({
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

class SharedGoalView extends PureComponent<Props> {
  render() {
    const {
      goal,
      users,
      currentUserId,
      onDelete,
      onExpand,
      classes,
      readOnly,
      expanded,
    } = this.props

    const elapsedDaysTillNow = getElapsedDaysTillNow(goal.started)
    // const finished = elapsedDaysTillNow >= goal.target

    if (!users) {
      return null
    }

    const participants = goal.users.sort(a => (a === currentUserId ? -1 : 1)).map(uid => users[uid])

    // TODO: last man standing checkbox
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
                <Typography>
                  {goal.target} days required to complete. If you fail you are out.
                  <br />
                  <br />
                  <List>
                    {participants.map(x => (
                      <ListItem key={x.email} dense className={classes.listItem}>
                        <Avatar src={x.avatarUrl} />
                        <ListItemText primary={x.displayName} />
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
            {/*<Button color="primary" dense onClick={null} disabled>*/}
            {/*Accept*/}
            {/*</Button>*/}
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
