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

import GoalView from './components/GoalView/GoalView'
import NewGoalForm from './components/NewGoalForm/NewGoalForm'
import ConfirmationModal from '../../../../../../common/components/ConfirmationDialog/ConfirmationDialog'
import { GOAL_DATE_TIME } from '../../../../../../common/consts/dateTimeConsts'
import { getGoalVisibility } from '../../../../../../common/records/GoalVisibility'
import type { GoalTargetType } from '../../../../../../common/records/GoalTargetType'
import type { Goals } from '../../../../../../common/records/Goal'
import type { Profile } from '../../../../../../common/records/Firebase/Profile'
import { getAscensionKarma, getFinishKarma } from './components/services/helpers'
import NoGoalsImg from '../../../../../../../images/nogoals.svg'

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
      name,
      target,
      targetType,
      draft: true,
      started: moment().valueOf(),
      created: moment().valueOf(),
      ascensionCount: 0,
      visibility: getGoalVisibility(1),
    })
    this.setState({
      name: '',
    })
  }

  handleChangeDate = (goalId: string, ev: any) => {
    const { currentUserId, goals, firebase } = this.props
    const newMoment = ev.target.value ? moment(ev.target.value, GOAL_DATE_TIME) : moment()

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[goalId],
      started: newMoment.valueOf(),
    })
  }

  handleChangeVisibility = (goalId: string, ev: any) => {
    const { currentUserId, goals, firebase } = this.props

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[goalId],
      visibility: ev.target.value,
    })
  }

  handleConfirmReset = () => {
    const { modalGoalId } = this.state

    this.handleToggleDraft(modalGoalId)

    this.setState({
      modal: null,
      modalGoalId: null,
    })
  }

  handleToggleDraft = (goalId: string) => {
    const { currentUserId, goals, firebase } = this.props

    const edditedGoal = goals[goalId]
    if (edditedGoal.draft) {
      firebase.set(`/goals/${currentUserId}/${goalId}`, {
        ...edditedGoal,
        draft: false,
        ascensionCount: 0,
      })
    } else {
      firebase.set(`/goals/${currentUserId}/${goalId}`, {
        ...edditedGoal,
        started: moment().valueOf(),
        draft: true,
        ascensionCount: 0,
      })
    }
  }

  handleExtendGoal = (goalId: string) => {
    const { currentUserId, goals, firebase, profile } = this.props

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

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...edditedGoal,
      target: newTarget,
      ascensionCount: edditedGoal.ascensionCount + 1,
    })
    // TODO: goal history (extended on date... etc.)
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
    const { classes, goals, readOnly, title } = this.props
    const { name, target, targetType, modal } = this.state

    const formValid = name.length > 0 && target > 0

    return (
      <Card className={classes.card}>
        <ConfirmationModal
          title="Discard challenge"
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
          <Typography type="headline" component="h2" className={classes.title}>
            <Avatar className={classes.primaryAvatar}>
              <AssignmentIcon />
            </Avatar>
            {title}
          </Typography>
          <div className={classes.goalsContainer}>
            <div>
              {goals &&
                Object.keys(goals).map(goalId => (
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
