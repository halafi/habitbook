// @flow

import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import moment from 'moment'
import * as R from 'ramda'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import AssignmentIcon from 'material-ui-icons/Assignment'
import TextField from 'material-ui/TextField'

import GoalView from './components/GoalView/GoalView'
import NewGoalForm from './components/NewGoalForm/NewGoalForm'
import ConfirmationModal from '../../../../../../common/components/ConfirmationModal/ConfirmationModal'
import { getElapsedDaysBetween } from '../../../../../../common/services/dateTimeUtils'
import { getGoalVisibility } from '../../../../../../common/records/GoalVisibility'
import type { Goals } from '../../../../../../common/records/Goal'
import type { Profile } from '../../../../../../common/records/Firebase/Profile'
import type { Users } from '../../../../../../common/records/Firebase/User'
import {
  getAscensionKarma,
  getFinishKarma,
  getSortedGoalsIds,
  getSortedSharedGoalsIds,
} from './services/helpers'
import NoGoalsImg from '../../../../../../../images/nogoals.svg'
import { GOAL_SORT_TYPES } from './consts/sortTypes'
import ResetDialog from './components/ResetDialog/ResetDialog'
import { usersSelector } from '../../../../../../common/selectors/firebaseSelectors'
import type { SharedGoals } from '../../../../../../common/records/SharedGoal'
import SharedGoalView from './components/SharedGoalView/SharedGoalView'

type Props = {
  classes: Object,
  title: string,
  profile: Profile,
  goals: {
    [userId: string]: Goals,
  },
  sharedGoals: SharedGoals,
  firebase: any,
  currentUserId: string,
  selectedUserId: string,
  readOnly: boolean,
  users: ?Users,
}

type GoalModal = 'delete' | 'reset' | 'deleteShared' | 'resetShared'

type State = {
  name: string,
  target: number,
  modal: ?GoalModal,
  modalGoalId: ?string,
  modalDateTime: ?number,
  expandedGoalId: ?string,
  friends: ?Array<{ value: string, label: string }>,
}

const styles = theme => ({
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
  card: {
    width: '100%',
    minHeight: '515px',
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

class GoalList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
      target: 30,
      modal: null,
      modalGoalId: null,
      modalDateTime: null,
      friends: null,
    }
  }

  updateUserGoal = (goalId, update) => {
    const { firebase, currentUserId, goals } = this.props

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[goalId],
      ...update,
    })
  }

  updateSharedGoal = (goalId, update) => {
    const { firebase, sharedGoals } = this.props

    firebase.set(`/sharedGoals/${goalId}`, {
      ...sharedGoals[goalId],
      ...update,
    })
  }

  handleDelete = (goalId: string) => {
    this.setState({
      modal: 'delete',
      modalGoalId: goalId,
    })
  }

  handleDeleteShared = (goalId: string) => {
    this.setState({
      modal: 'deleteShared',
      modalGoalId: goalId,
    })
  }

  handleReset = (goalId: string) => {
    this.setState({
      modal: 'reset',
      modalGoalId: goalId,
    })
  }

  handleFailShared = (goalId: string) => {
    this.setState({
      modal: 'resetShared',
      modalGoalId: goalId,
    })
  }

  handleConfirmDelete = () => {
    const { firebase, currentUserId } = this.props
    const { modalGoalId } = this.state

    firebase.remove(`/goals/${currentUserId}/${modalGoalId}`)

    this.setState({
      modal: null,
      modalGoalId: null,
      expandedGoalId: null,
    })
  }

  handleConfirmDeleteShared = () => {
    const { firebase, sharedGoals, currentUserId } = this.props
    const { modalGoalId } = this.state

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
        this.updateSharedGoal(modalGoalId, {
          users: goal.users.map(x => (x.id === currentUserId ? { ...x, abandoned: true } : x)),
        })
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

  handleChange = (fieldName: string, value: string) => {
    this.setState({
      [fieldName]: value,
    })
  }

  handleChangeSelectedFriends = (val: string) => {
    if (val.length > 2) {
      return
    }
    this.setState({
      friends: val,
    })
  }
  // handleRemoveFriend = friend => {
  //   console.log(friend)
  //   console.log(R.reject(R.equals(friend))(this.state.friends))
  //   this.setState({
  //     friends: R.reject(R.equals(friend))(this.state.friends),
  //   })
  // }

  handleSubmit = (ev: any) => {
    ev.preventDefault()

    const { currentUserId, firebase } = this.props
    const { name, target, friends } = this.state

    let ref = ''
    if (!friends || !friends.length) {
      ref = firebase.push(`/goals/${currentUserId}`, {
        ascensionCount: 0,
        created: moment().valueOf(),
        draft: true,
        name,
        started: moment().valueOf(),
        streaks: [],
        target,
        visibility: getGoalVisibility(2),
      })
    } else {
      const users = [currentUserId].concat(Object.values(friends).map(x => x.value)).map(x => ({
        id: x,
        accepted: false,
        abandoned: false,
        failed: null,
      }))

      ref = firebase.push(`/sharedGoals`, {
        created: moment().valueOf(),
        draft: true,
        name,
        started: moment().valueOf(),
        target,
        users,
      })
    }
    this.setState({
      name: '',
      expandedGoalId: ref.key,
      friends: null,
    })
  }

  handleChangeDate = (goalId: string, newDate: number) => {
    const newDateTimeMillis = newDate || moment().valueOf()
    this.updateUserGoal(goalId, { started: newDateTimeMillis })
  }

  handleChangeDateShared = (goalId: string, newDate: number) => {
    const { sharedGoals } = this.props
    const newDateTimeMillis = newDate || moment().valueOf()

    // deaccept users
    const newUsers = sharedGoals[goalId].users.map(x => ({ ...x, accepted: false }))

    this.updateSharedGoal(goalId, {
      started: newDateTimeMillis,
      users: newUsers,
    })
  }

  handleChangeVisibility = (goalId: string, ev: any) =>
    this.updateUserGoal(goalId, { visibility: ev.target.value })

  handleConfirmReset = () => {
    const { goals } = this.props
    const { modalGoalId, modalDateTime } = this.state

    const newStreak = getElapsedDaysBetween(goals[modalGoalId].started, modalDateTime)
    const previousStreaks = goals[modalGoalId].streaks || []
    previousStreaks.push(newStreak)
    const resets = goals[modalGoalId].resets || []
    resets.push(modalDateTime)

    this.updateUserGoal(modalGoalId, {
      ascensionCount: 0,
      streaks: previousStreaks,
      resets,
    })

    this.setState({
      modal: null,
      modalGoalId: null,
    })
  }

  handleConfirmFailShared = () => {
    const { sharedGoals, currentUserId } = this.props
    const { modalGoalId, modalDateTime } = this.state

    const goal = sharedGoals[modalGoalId]

    this.updateSharedGoal(modalGoalId, {
      users: goal.users.map(x => (x.id === currentUserId ? { ...x, failed: modalDateTime } : x)),
    })

    this.setState({
      modal: null,
      modalGoalId: null,
    })
  }

  handleToggleDraft = (goalId: string) => {
    const { goals } = this.props

    if (goals[goalId]) {
      this.updateUserGoal(goalId, { draft: false, ascensionCount: 0 })
    } else {
      this.updateUserGoal(goalId, {
        started: moment().valueOf(),
        draft: true,
        ascensionCount: 0,
      })
    }

    this.setState({
      expandedGoalId: null,
    })
  }

  handleExtendGoal = (goalId: string) => {
    const { goals, firebase, profile } = this.props

    const edditedGoal = goals[goalId]
    const newTarget = edditedGoal.target * 2

    firebase.updateProfile({
      goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
      ascensions: profile.ascensions ? profile.ascensions + 1 : 1,
      karma: profile.karma
        ? Number(profile.karma) + getAscensionKarma(edditedGoal)
        : getAscensionKarma(edditedGoal),
    })

    this.updateUserGoal(goalId, {
      target: newTarget,
      ascensionCount: edditedGoal.ascensionCount + 1,
    })
  }

  handleChangeSort = (ev: any) => {
    const { firebase } = this.props

    firebase.updateProfile({
      sort: ev.target.value,
    })
  }

  handleCompleteGoal = (goalId: string) => {
    const { firebase, profile, goals } = this.props

    const updatedGoal = goals[goalId]

    firebase.updateProfile({
      goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
      karma: profile.karma
        ? Number(profile.karma) + getFinishKarma(updatedGoal)
        : getFinishKarma(updatedGoal),
    })
    this.handleDelete(goalId)
  }

  handleRenameGoal = (goalId: string, ev: any) => {
    this.updateUserGoal(goalId, {
      name: ev.target.value,
    })
  }

  handleRenameGoalShared = (goalId: string, ev: any) => {
    this.updateSharedGoal(goalId, {
      name: ev.target.value,
    })
  }

  handleAcceptGoalShared = (goalId: string, userId: string) => {
    const { sharedGoals } = this.props
    const newUsers = sharedGoals[goalId].users.map(
      x => (x.id === userId ? { ...x, accepted: true } : x),
    )
    const everyoneAccepted = R.all(R.propEq('accepted', true))(newUsers)

    this.updateSharedGoal(goalId, {
      users: newUsers,
      draft: !everyoneAccepted,
    })
  }

  handleExpand = (goalId: string) => {
    this.setState({
      expandedGoalId: this.state.expandedGoalId === goalId ? null : goalId,
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
    } = this.props
    const { name, target, modal, modalDateTime, expandedGoalId, friends, modalGoalId } = this.state

    const formValid = name.length > 0 && target > 0
    const sort = profile.sort || 'oldest'
    const sortedGoalIds = getSortedGoalsIds(goals, sort)
    const sortedSharedGoalIds = getSortedSharedGoalsIds(
      sharedGoals,
      selectedUserId || currentUserId,
    )

    const sharedGoal = sharedGoals[modalGoalId]

    const willDeleteSharedGoal =
      modal === 'deleteShared' &&
      ((!sharedGoal.draft && sharedGoal.users.filter(x => !x.abandoned).length === 0) ||
        (sharedGoal.draft && sharedGoal.users.length <= 1))

    // TODO: put modal names to const

    return (
      <Card className={classes.card}>
        <ConfirmationModal
          title="Remove challenge"
          open={modal === 'delete'}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmDelete}
        >
          Are you sure you want to permanently delete this challenge?
        </ConfirmationModal>
        <ConfirmationModal
          title="Abandon challenge"
          open={modal === 'deleteShared'}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmDeleteShared}
        >
          {willDeleteSharedGoal
            ? 'Are you sure you want to permanently delete this challenge? There are no more participants.'
            : "There are still other participants in this challenge, if you leave now you won't be able to return, but the challenge will remain visible to the other participants."}
        </ConfirmationModal>
        <ResetDialog
          open={modal === 'reset'}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmReset}
          dateTime={modalDateTime}
          onDateTimeChange={val => this.setState({ modalDateTime: val || moment().valueOf() })}
        />
        <ResetDialog
          open={modal === 'resetShared'}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmFailShared}
          dateTime={modalDateTime}
          onDateTimeChange={val => this.setState({ modalDateTime: val || moment().valueOf() })}
        />
        <CardContent>
          <div className={classes.header}>
            <Typography type="headline" component="h2" className={classes.title}>
              <Avatar className={classes.primaryAvatar}>
                <AssignmentIcon />
              </Avatar>
              {title}
            </Typography>
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
          </div>
          <div className={classes.goalsContainer}>
            <div>
              {goals && (
                <div className={classes.goalsPart}>
                  {sortedGoalIds.map(goalId => (
                    <GoalView
                      key={goalId}
                      goal={goals[goalId]}
                      onDelete={R.partial(this.handleDelete, [goalId])}
                      onComplete={R.partial(this.handleCompleteGoal, [goalId])}
                      onChangeDate={R.partial(this.handleChangeDate, [goalId])}
                      onToggleDraft={R.partial(this.handleToggleDraft, [goalId])}
                      onReset={R.partial(this.handleReset, [goalId])}
                      onExtendGoal={R.partial(this.handleExtendGoal, [goalId])}
                      onChangeVisibility={R.partial(this.handleChangeVisibility, [goalId])}
                      onRenameGoal={R.partial(this.handleRenameGoal, [goalId])}
                      readOnly={readOnly}
                      expanded={expandedGoalId === goalId}
                      onExpand={R.partial(this.handleExpand, [goalId])}
                    />
                  ))}
                </div>
              )}
              {sortedSharedGoalIds && (
                <div>
                  {sortedSharedGoalIds.map(goalId => (
                    <SharedGoalView
                      key={goalId}
                      users={users}
                      currentUserId={currentUserId}
                      goal={sharedGoals[goalId]}
                      onDelete={R.partial(this.handleDeleteShared, [goalId])}
                      onChangeDate={R.partial(this.handleChangeDateShared, [goalId])}
                      onRenameGoal={R.partial(this.handleRenameGoalShared, [goalId])}
                      readOnly={readOnly}
                      expanded={expandedGoalId === goalId}
                      onExpand={R.partial(this.handleExpand, [goalId])}
                      onAcceptSharedGoal={R.partial(this.handleAcceptGoalShared, [
                        goalId,
                        currentUserId,
                      ])}
                      onFail={R.partial(this.handleFailShared, [goalId, currentUserId])}
                    />
                  ))}
                </div>
              )}

              {!goals &&
                !sortedSharedGoalIds && (
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
                  target={target}
                  onChange={this.handleChange}
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

export default compose(
  firebaseConnect(),
  connect(state => ({
    profile: state.firebase.profile,
    users: usersSelector(state),
    currentUserId: state.firebase.auth.uid,
  })),
  withStyles(styles),
)(GoalList)
