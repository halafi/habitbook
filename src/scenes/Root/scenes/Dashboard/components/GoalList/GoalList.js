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
import ConfirmationModal from '../../../../../../common/components/ConfirmationDialog/ConfirmationDialog'
import { GOAL_DATE_TIME } from '../../../../../../common/consts/dateTimeConsts'
import { getElapsedDaysTillNow } from '../../../../../../common/services/dateTimeUtils'
import { getGoalVisibility } from '../../../../../../common/records/GoalVisibility'
import type { GoalTargetType } from '../../../../../../common/records/GoalTargetType'
import type { Goals } from '../../../../../../common/records/Goal'
import type { Profile } from '../../../../../../common/records/Firebase/Profile'
import { getAscensionKarma, getFinishKarma, getSortedGoalsIds } from './components/services/helpers'
import NoGoalsImg from '../../../../../../../images/nogoals.svg'
import { GOAL_SORT_TYPES } from './components/consts/sortTypes'

type Props = {
  classes: Object,
  title: string,
  profile: Profile,
  goals: {
    [userId: string]: Goals,
  },
  firebase: any,
  currentUserId: string,
  readOnly: boolean,
}

type GoalModal = 'delete' | 'reset'

type State = {
  name: string,
  targetType: GoalTargetType,
  target: number,
  modal: ?GoalModal,
  modalGoalId: ?string,
}

const styles = theme => ({
  goalsContainer: {
    marginTop: '16px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
      targetType: 'DAYS',
      modal: null,
      modalGoalId: null,
    }
  }

  updateUserGoal = (goalId, update) => {
    const { firebase, currentUserId, goals } = this.props

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[goalId],
      ...update,
    })
  }

  handleDelete = goalId => {
    this.setState({
      modal: 'delete',
      modalGoalId: goalId,
    })
  }

  handleReset = goalId => {
    this.setState({
      modal: 'reset',
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
    })
  }

  handleChange = (fieldName: string, value: string) => {
    this.setState({
      [fieldName]: value,
    })
  }

  handleSubmit = (ev: any) => {
    ev.preventDefault()

    const { currentUserId, firebase } = this.props
    const { name, target, targetType } = this.state

    firebase.push(`/goals/${currentUserId}`, {
      ascensionCount: 0,
      created: moment().valueOf(),
      draft: true,
      streak: 0,
      name,
      started: moment().valueOf(),
      target,
      targetType,
      visibility: getGoalVisibility(2),
    })
    this.setState({
      name: '',
    })
  }

  handleChangeDate = (goalId: string, ev: any) => {
    const newMoment = ev.target.value ? moment(ev.target.value, GOAL_DATE_TIME) : moment()
    this.updateUserGoal(goalId, { started: newMoment.valueOf() })
  }

  handleChangeVisibility = (goalId: string, ev: any) =>
    this.updateUserGoal(goalId, { visibility: ev.target.value })

  handleConfirmReset = () => {
    const { goals } = this.props
    const { modalGoalId } = this.state

    const newStreak = getElapsedDaysTillNow(goals[modalGoalId].started)
    const previousStreak = goals[modalGoalId].streak || 0

    this.updateUserGoal(modalGoalId, {
      started: moment().valueOf(),
      draft: true,
      ascensionCount: 0,
      streak: newStreak > previousStreak ? newStreak : previousStreak,
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
  }

  handleExtendGoal = (goalId: string) => {
    const { goals, firebase, profile } = this.props

    const edditedGoal = goals[goalId]
    // const daysCompleted = getElapsedDaysTillNow(edditedGoal.started)
    const newTarget = edditedGoal.target * 2 // TODO: table of targets

    firebase.updateProfile({
      goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
      ascensions: profile.ascensions ? profile.ascensions + 1 : 1,
      karma: profile.karma
        ? profile.karma + getAscensionKarma(edditedGoal)
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
        ? profile.karma + getFinishKarma(updatedGoal)
        : getFinishKarma(updatedGoal),
    })
    this.handleDelete(goalId)
  }

  render() {
    const { classes, goals, readOnly, title, profile } = this.props
    const { name, target, targetType, modal } = this.state

    const formValid = name.length > 0 && target > 0
    const sort = profile.sort || 'oldest'
    const sortedGoalIds = getSortedGoalsIds(goals, sort)

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
          title="Reset progress"
          open={modal === 'reset'}
          onClose={() => this.setState({ modal: null })}
          onConfirm={this.handleConfirmReset}
        >
          Are you sure you want to reset your progress?
        </ConfirmationModal>
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
              {goals &&
                sortedGoalIds.map(goalId => (
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
                    readOnly={readOnly}
                  />
                ))}
              {!goals && (
                <div className={classes.imageWrapper}>
                  <img alt="no-goals" src={NoGoalsImg} />
                </div>
              )}
            </div>
            {!readOnly && (
              <NewGoalForm
                onSubmit={this.handleSubmit}
                name={name}
                target={target}
                targetType={targetType}
                onChange={this.handleChange}
                formValid={formValid}
              />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals']),
  connect(state => ({
    profile: state.firebase.profile,
    currentUserId: state.firebase.auth.uid,
  })),
  withStyles(styles),
)(GoalList)
