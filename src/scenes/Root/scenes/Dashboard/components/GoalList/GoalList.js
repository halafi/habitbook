// @flow

import React, { Component } from 'react'
import moment from 'moment'
import * as R from 'ramda'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import AssignmentIcon from 'material-ui-icons/Assignment'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'

import GoalView from './components/GoalView/GoalView'
import NewGoalForm from './components/NewGoalForm/NewGoalForm'
import ConfirmationModal from '../../../../../../common/components/ConfirmationModal/ConfirmationModal'
import { getElapsedDaysBetween } from '../../../../../../common/services/dateTimeUtils'
import { getGoalVisibility } from '../../../../../../common/records/GoalVisibility'
import type { Goals } from '../../../../../../common/records/Goal'
import type { User, Users } from '../../../../../../common/records/Firebase/User'
import {
  getFinishExpReward,
  getResetExpReward,
  getSharedGoalFinishExpReward,
  getSortedGoalsIds,
  getSortedSharedGoalsIds,
} from './services/helpers'
import NoGoalsImg from '../../../../../../../images/nogoals.svg'
import { GOAL_SORT_TYPES } from './consts/sortTypes'
import ResetDialog from './components/ResetDialog/ResetDialog'
import type { SharedGoals } from '../../../../../../common/records/SharedGoal'
import type { Firebase } from '../../../../../../common/records/Firebase/Firebase'
import SharedGoalView from './components/SharedGoalView/SharedGoalView'

type Props = {
  classes: Object,
  currentUserId: string,
  firebase: Firebase,
  goals: Goals,
  profile: User,
  readOnly: boolean,
  selectedUserId: string,
  sharedGoals: SharedGoals,
  title: string,
  users: Users,
}

const GOAL_MODALS = {
  DELETE: 'delete',
  RESET: 'reset',
  DELETE_SHARED: 'deleteShared',
  RESET_SHARED: 'resetShared',
}

type GoalModal = $Values<typeof GOAL_MODALS>

type Friends = Array<{ value: string, label: string }>

type State = {
  expandedGoalId: ?string,
  friends: ?Friends,
  modal: ?GoalModal,
  modalDateTime: ?number,
  modalGoalId: ?string,
  name: string,
}

const styles = theme => ({
  root: {
    minHeight: '515px',
  },
  goalsContainer: {
    marginTop: '16px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  goalsPart: {
    marginBottom: '32px',
  },
  primaryAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: theme.palette.primary['500'],
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const DEFAULT_GOAL_TARGET = 30

class GoalList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      expandedGoalId: null,
      friends: null,
      modal: null,
      modalDateTime: null,
      modalGoalId: null,
      name: '',
    }
  }

  openModal = (modal: GoalModal, modalGoalId: string) => this.setState({ modal, modalGoalId })

  handleChangeSort = (ev: any) => this.props.firebase.updateProfile({ sort: ev.target.value })

  handleChangeFormField = (fieldName: string, value: string) =>
    this.setState({ [fieldName]: value })

  handleExpand = (goalId: string) =>
    this.setState({ expandedGoalId: this.state.expandedGoalId === goalId ? null : goalId })

  handleChangeSelectedFriends = (val: Friends) => this.setState({ friends: val })

  handleStartGoal = (goalId: string) => this.updateUserGoal(goalId, { draft: false })

  updateUserGoal = (goalId: string, update: Object) => {
    const { firebase, currentUserId, goals } = this.props

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[goalId],
      ...update,
    })
  }

  updateSharedGoal = (goalId: string, update: Object) => {
    const { firebase, sharedGoals } = this.props

    firebase.set(`/sharedGoals/${goalId}`, {
      ...sharedGoals[goalId],
      ...update,
    })
  }

  handleCompleteGoal = (goalId: string, shared: boolean) => {
    const { firebase, profile, currentUserId, goals, sharedGoals } = this.props

    if (shared) {
      const goal = sharedGoals[goalId]

      this.updateSharedGoal(goalId, {
        users: goal.users.map(x => (x.id === currentUserId ? { ...x, finished: true } : x)),
      })

      firebase.updateProfile({
        goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
        experience: getSharedGoalFinishExpReward(profile.experience, goal),
      })
    } else {
      const goal = goals[goalId]

      firebase.updateProfile({
        goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
        experience: getFinishExpReward(profile.experience, goal),
      })

      firebase.remove(`/goals/${currentUserId}/${goalId}`)
    }
  }

  handleConfirmDelete = () => {
    const { firebase, currentUserId } = this.props
    const { modalGoalId } = this.state

    if (modalGoalId) {
      firebase.remove(`/goals/${currentUserId}/${modalGoalId}`)
    }

    this.setState({
      modal: null,
      modalGoalId: null,
      expandedGoalId: null,
    })
  }

  handleConfirmDeleteShared = () => {
    const { firebase, sharedGoals, currentUserId } = this.props
    const { modalGoalId } = this.state

    if (!modalGoalId) {
      return
    }

    const goal = sharedGoals[modalGoalId]

    if (goal.draft) {
      if (goal.users.length > 1) {
        this.updateSharedGoal(modalGoalId, {
          users: goal.users.filter(x => x.id !== currentUserId),
        })
      } else if (goal.users.length <= 1) {
        firebase.remove(`/sharedGoals/${modalGoalId}`)
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (goal.users.length > 1) {
        const newUsers = goal.users.map(
          x => (x.id === currentUserId ? { ...x, abandoned: true } : x),
        )
        const everyoneLeft = newUsers.every(x => x.abandoned)
        if (everyoneLeft) {
          firebase.remove(`/sharedGoals/${modalGoalId}`)
        } else {
          this.updateSharedGoal(modalGoalId, {
            users: goal.users.map(x => (x.id === currentUserId ? { ...x, abandoned: true } : x)),
          })
        }
      } else if (goal.users.length <= 1) {
        firebase.remove(`/sharedGoals/${modalGoalId}`)
      }
    }

    this.setState({
      modal: null,
      modalGoalId: null,
      expandedGoalId: null,
    })
  }

  handleSubmit = (ev: any) => {
    ev.preventDefault()

    const { currentUserId, firebase } = this.props
    const { name, friends } = this.state

    let ref = ''
    if (!friends || !friends.length) {
      ref = firebase.push(`/goals/${currentUserId}`, {
        ascensionCount: 0,
        created: moment().valueOf(),
        draft: true,
        name,
        started: moment().valueOf(),
        streaks: [],
        target: DEFAULT_GOAL_TARGET,
        visibility: getGoalVisibility(2),
      })
    } else {
      // $FlowFixMe https://github.com/facebook/flow/issues/2221
      const users = [currentUserId].concat(Object.values(friends).map(x => x.value)).map(x => ({
        id: x,
        accepted: false,
        abandoned: false,
        failed: null,
        finished: false,
      }))

      ref = firebase.push(`/sharedGoals`, {
        created: moment().valueOf(),
        draft: true,
        name,
        started: moment().valueOf(),
        target: DEFAULT_GOAL_TARGET,
        users,
        type: 'duration',
      })
    }
    this.setState({
      name: '',
      expandedGoalId: ref.key,
      friends: null,
    })
  }

  handleChangeDate = (goalId: string, shared: boolean, newDate: number) => {
    const newDateTimeMillis = newDate || moment().valueOf()

    if (shared) {
      const { sharedGoals } = this.props

      const newUsers = sharedGoals[goalId].users.map(x => ({ ...x, accepted: false }))

      this.updateSharedGoal(goalId, {
        started: newDateTimeMillis,
        users: newUsers,
      })
    } else {
      this.updateUserGoal(goalId, { started: newDateTimeMillis })
    }
  }

  handleGoalFieldChange = (goalId: string, field: 'target' | 'visibility', ev: any) => {
    const { value } = ev.target

    if (field === 'target' && Number.isNaN(Number(value))) {
      return
    }

    this.updateUserGoal(goalId, { [field]: value })
  }

  handleChangeTargetShared = (goalId: string, ev: any) => {
    const { sharedGoals } = this.props
    const { value } = ev.target

    if (Number.isNaN(Number(value))) {
      return
    }

    const newUsers = sharedGoals[goalId].users.map(x => ({ ...x, accepted: false }))

    this.updateSharedGoal(goalId, { target: value, users: newUsers })
  }

  handleChangeTypeShared = (goalId: string, ev: any) => {
    const { sharedGoals } = this.props
    const newUsers = sharedGoals[goalId].users.map(x => ({ ...x, accepted: false }))

    this.updateSharedGoal(goalId, { type: ev.target.value, users: newUsers })
  }

  handleConfirmReset = () => {
    const { goals, firebase, profile } = this.props
    const { modalGoalId, modalDateTime } = this.state

    if (!modalGoalId || !modalDateTime) {
      return
    }

    const previousResets = goals[modalGoalId].resets

    let newStreak
    if (previousResets && previousResets.length) {
      newStreak = getElapsedDaysBetween(previousResets[previousResets.length - 1], modalDateTime)
    } else {
      newStreak = getElapsedDaysBetween(goals[modalGoalId].started, modalDateTime)
    }

    const previousStreaks = goals[modalGoalId].streaks || []
    previousStreaks.push(newStreak)
    const resets = goals[modalGoalId].resets || []
    resets.push(modalDateTime)

    this.updateUserGoal(modalGoalId, {
      ascensionCount: 0,
      streaks: previousStreaks,
      resets,
    })

    if (newStreak > 0) {
      // currently user can reset to past date
      // TODO: do not allow reset before challenge start
      firebase.updateProfile({
        experience: getResetExpReward(profile.experience, newStreak),
      })
    }

    this.setState({
      modal: null,
      modalGoalId: null,
    })
  }

  handleConfirmFailShared = () => {
    const { sharedGoals, currentUserId } = this.props
    const { modalGoalId, modalDateTime } = this.state

    if (!modalGoalId) {
      return
    }

    const goal = sharedGoals[modalGoalId]

    this.updateSharedGoal(modalGoalId, {
      users: goal.users.map(x => (x.id === currentUserId ? { ...x, failed: modalDateTime } : x)),
    })

    // firebase.updateProfile({
    //   experience: getResetExpReward(profile.experience, newStreak),
    // })

    this.setState({
      modal: null,
      modalGoalId: null,
    })
  }

  handleExtendGoal = (goalId: string) => {
    const { goals, firebase, profile } = this.props

    const edditedGoal = goals[goalId]
    const newTarget = edditedGoal.target * 2

    firebase.updateProfile({
      goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
      ascensions: profile.ascensions ? profile.ascensions + 1 : 1,
    })

    this.updateUserGoal(goalId, {
      target: newTarget,
      ascensionCount: edditedGoal.ascensionCount + 1,
    })
  }

  handleRenameGoal = (goalId: string, shared: boolean, ev: any) => {
    const { sharedGoals } = this.props

    if (shared) {
      const newUsers = sharedGoals[goalId].users.map(x => ({ ...x, accepted: false }))

      this.updateSharedGoal(goalId, {
        name: ev.target.value,
        users: newUsers,
      })
    } else {
      this.updateUserGoal(goalId, {
        name: ev.target.value,
      })
    }
  }

  handleAcceptSharedGoal = (goalId: string) => {
    const { sharedGoals, currentUserId } = this.props

    const newUsers = sharedGoals[goalId].users.map(
      x => (x.id === currentUserId ? { ...x, accepted: true } : x),
    )
    const everyoneAccepted = R.all(R.propEq('accepted', true))(newUsers)

    this.updateSharedGoal(goalId, {
      users: newUsers,
      draft: !everyoneAccepted,
    })
  }

  render() {
    const {
      classes,
      goals,
      sharedGoals,
      readOnly,
      title,
      profile,
      users,
      currentUserId,
      selectedUserId,
      firebase,
    } = this.props

    const { name, modal, modalDateTime, expandedGoalId, friends, modalGoalId } = this.state

    const formValid = name.length > 0
    const sort = profile.sort || 'oldestFirst'
    const sortedGoalIds = getSortedGoalsIds(goals, sort)
    const sortedSharedGoalIds =
      sharedGoals && getSortedSharedGoalsIds(sharedGoals, selectedUserId || currentUserId)

    const sharedGoal =
      modalGoalId && modal === GOAL_MODALS.DELETE_SHARED && sharedGoals
        ? sharedGoals[modalGoalId]
        : null

    const willDeleteSharedGoal =
      modal === GOAL_MODALS.DELETE_SHARED &&
      sharedGoal &&
      ((!sharedGoal.draft && sharedGoal.users.filter(x => !x.abandoned).length <= 1) ||
        (sharedGoal.draft && sharedGoal.users.length <= 1))

    return (
      <Card className={classes.root}>
        <ConfirmationModal
          title="Remove challenge"
          open={modal === GOAL_MODALS.DELETE}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmDelete}
        >
          Are you sure you want to permanently delete this challenge?
        </ConfirmationModal>
        <ConfirmationModal
          title="Abandon challenge"
          open={modal === GOAL_MODALS.DELETE_SHARED}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmDeleteShared}
        >
          {willDeleteSharedGoal
            ? 'Are you sure you want to permanently delete this challenge? There are no more active participants.'
            : "There are still other participants in this challenge, if you leave now you won't be able to return, but the challenge will remain visible to the other participants."}
        </ConfirmationModal>
        <ResetDialog
          open={modal === GOAL_MODALS.RESET}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmReset}
          dateTime={modalDateTime}
          minDateTime={modalGoalId && goals ? R.propOr(null, 'started')(goals[modalGoalId]) : null}
          onDateTimeChange={val => this.setState({ modalDateTime: val || moment().valueOf() })}
        />
        <ResetDialog
          open={modal === GOAL_MODALS.RESET_SHARED}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmFailShared}
          dateTime={modalDateTime}
          minDateTime={modalGoalId && sharedGoals ? R.propOr(null, 'started')(sharedGoals[modalGoalId]) : null}
          onDateTimeChange={val => this.setState({ modalDateTime: val || moment().valueOf() })}
        />
        <CardContent>
          <div className={classes.header}>
            <Grid container alignItems="center" alignContent="center" justify="space-between">
              <Grid item>
                <Typography type="headline" component="h2" className={classes.title}>
                  <Avatar className={classes.primaryAvatar}>
                    <AssignmentIcon />
                  </Avatar>
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="select-target-type"
                  select
                  label="Sort by"
                  value={sort}
                  onChange={this.handleChangeSort}
                  SelectProps={{
                    native: true,
                  }}
                  margin="normal"
                  className={classes.textField}
                >
                  {GOAL_SORT_TYPES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </div>
          <div className={classes.goalsContainer}>
            <div>
              {sortedGoalIds.length > 0 && (
                <div className={classes.goalsPart}>
                  {sortedGoalIds.map(goalId => (
                    <GoalView
                      key={goalId}
                      goal={goals[goalId]}
                      readOnly={readOnly}
                      expanded={expandedGoalId === goalId}
                      onExpand={R.partial(this.handleExpand, [goalId])}
                      onDelete={R.partial(this.openModal, [GOAL_MODALS.DELETE, goalId])}
                      onComplete={R.partial(this.handleCompleteGoal, [goalId, false])}
                      onRenameGoal={R.partial(this.handleRenameGoal, [goalId, false])}
                      onChangeDate={R.partial(this.handleChangeDate, [goalId, false])}
                      onChangeTarget={R.partial(this.handleGoalFieldChange, [goalId, 'target'])}
                      onChangeVisibility={R.partial(this.handleGoalFieldChange, [
                        goalId,
                        'visibility',
                      ])}
                      onToggleDraft={R.partial(this.handleStartGoal, [goalId])}
                      onExtendGoal={R.partial(this.handleExtendGoal, [goalId])}
                      onFail={R.partial(this.openModal, [GOAL_MODALS.RESET, goalId])}
                    />
                  ))}
                </div>
              )}
              {sortedSharedGoalIds && (
                <div>
                  {sortedSharedGoalIds.map(goalId => (
                    <SharedGoalView
                      key={goalId}
                      goal={sharedGoals[goalId]}
                      readOnly={readOnly}
                      expanded={expandedGoalId === goalId}
                      friends={profile.friends}
                      onExpand={R.partial(this.handleExpand, [goalId])}
                      onDelete={R.partial(this.openModal, [GOAL_MODALS.DELETE_SHARED, goalId])}
                      users={users}
                      currentUserId={currentUserId}
                      onComplete={R.partial(this.handleCompleteGoal, [goalId, true])}
                      onRenameGoal={R.partial(this.handleRenameGoal, [goalId, true])}
                      onChangeDate={R.partial(this.handleChangeDate, [goalId, true])}
                      onChangeTarget={R.partial(this.handleChangeTargetShared, [goalId])}
                      onChangeType={R.partial(this.handleChangeTypeShared, [goalId])}
                      onAcceptSharedGoal={R.partial(this.handleAcceptSharedGoal, [goalId])}
                      onFail={R.partial(this.openModal, [GOAL_MODALS.RESET_SHARED, goalId])}
                      firebase={firebase}
                    />
                  ))}
                </div>
              )}

              {(!goals || !sortedGoalIds.length) &&
                (!sortedSharedGoalIds || !sortedSharedGoalIds.length) && (
                  <div className={classes.imageWrapper}>
                    <img alt="no-goals" src={NoGoalsImg} />
                  </div>
                )}
            </div>
            {!readOnly &&
              users && (
                <NewGoalForm
                  onSubmit={this.handleSubmit}
                  name={name}
                  onChange={this.handleChangeFormField}
                  formValid={formValid}
                  users={users}
                  friendsSelected={friends}
                  friends={profile.friends}
                  onChangeSelectedFriends={this.handleChangeSelectedFriends}
                />
              )}
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(GoalList)
