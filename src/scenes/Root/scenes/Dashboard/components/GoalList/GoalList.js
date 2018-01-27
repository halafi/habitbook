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
import { GOAL_DATE_TIME } from '../../../../../../common/consts/dateTimeConsts'
import { getElapsedDaysTillNow } from '../../../../../../common/services/dateTimeUtils'
import { getGoalVisibility } from '../../../../../../common/records/GoalVisibility'
import type { GoalTargetType } from '../../../../../../common/records/GoalTargetType'
import type { Goals } from '../../../../../../common/records/Goal'
import type { Profile } from '../../../../../../common/records/Firebase/Profile'

type Props = {
  classes: Object,
  profile: Profile,
  goals: {
    [userId: string]: Goals,
  },
  firebase: any,
  currentUserId: string,
}

type State = {
  name: string,
  targetType: GoalTargetType,
  target: number,
}

const styles = theme => ({
  goalsContainer: {
    marginTop: '16px',
  },
  card: {
    width: '100%',
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
})

class GoalList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
      target: 30,
      targetType: 'DAYS',
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleCompleteGoal = this.handleCompleteGoal.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeVisibility = this.handleChangeVisibility.bind(this)
    this.handleToggleDraft = this.handleToggleDraft.bind(this)
    this.handleExtendGoal = this.handleExtendGoal.bind(this)
  }

  handleDelete(goalId) {
    this.props.firebase.remove(`/goals/${this.props.currentUserId}/${goalId}`)
  }

  handleChange(fieldName: string, value: string) {
    this.setState({
      [fieldName]: value,
    })
  }

  handleSubmit(ev: any) {
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

  handleChangeDate(goalId: string, ev: any) {
    const { currentUserId, goals, firebase } = this.props
    const newMoment = ev.target.value ? moment(ev.target.value, GOAL_DATE_TIME) : moment()

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[currentUserId][goalId],
      started: newMoment.valueOf(),
    })
  }

  handleChangeVisibility(goalId: string, ev: any) {
    const { currentUserId, goals, firebase } = this.props

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...goals[currentUserId][goalId],
      visibility: ev.target.value,
    })
  }

  handleToggleDraft(goalId: string) {
    const { currentUserId, goals, firebase } = this.props

    const edditedGoal = goals[currentUserId][goalId]
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

  handleExtendGoal(goalId: string) {
    const { currentUserId, goals, firebase, profile } = this.props

    const edditedGoal = goals[currentUserId][goalId]
    // const daysCompleted = getElapsedDaysTillNow(edditedGoal.started)
    const newTarget = edditedGoal.target * 2 // TODO: table of targets

    if (getElapsedDaysTillNow(edditedGoal.created) >= 1) {
      firebase.updateProfile({
        goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
        ascensions: profile.ascensions ? profile.ascensions + 1 : 1,
      })
    }

    firebase.set(`/goals/${currentUserId}/${goalId}`, {
      ...edditedGoal,
      target: newTarget,
      ascensionCount: edditedGoal.ascensionCount + 1,
    })
    // TODO: goal history (extended on date... etc.)
  }

  handleCompleteGoal(goalId: string) {
    const { firebase, profile, currentUserId, goals } = this.props

    const updatedGoal = goals[currentUserId][goalId]

    if (getElapsedDaysTillNow(updatedGoal.created) >= 1) {
      firebase.updateProfile({
        goalsCompleted: profile.goalsCompleted ? profile.goalsCompleted + 1 : 1,
      })
    }
    this.handleDelete(goalId)
  }

  render() {
    const { classes, goals, currentUserId } = this.props
    const { name, target, targetType } = this.state

    const formValid = name.length > 0 && target > 0

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            <Avatar className={classes.primaryAvatar}>
              <AssignmentIcon />
            </Avatar>
            Your Challenges
          </Typography>
          <div className={classes.goalsContainer}>
            {goals &&
              goals[currentUserId] &&
              Object.keys(goals[currentUserId]).map(goalId => (
                <GoalView
                  key={goalId}
                  goal={goals[currentUserId][goalId]}
                  onDelete={R.partial(this.handleDelete, [goalId])}
                  onComplete={R.partial(this.handleCompleteGoal, [goalId])}
                  onChangeDate={R.partial(this.handleChangeDate, [goalId])}
                  onToggleDraft={R.partial(this.handleToggleDraft, [goalId])}
                  onExtendGoal={R.partial(this.handleExtendGoal, [goalId])}
                  onChangeVisibility={R.partial(this.handleChangeVisibility, [goalId])}
                />
              ))}
            <NewGoalForm
              onSubmit={this.handleSubmit}
              name={name}
              target={target}
              targetType={targetType}
              onChange={this.handleChange}
              formValid={formValid}
            />
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect(['goals']),
  connect(({ firebase }) => ({
    profile: firebase.profile,
    goals: firebase.data.goals,
    currentUserId: firebase.auth.uid,
  })),
  withStyles(styles),
)(GoalList)
