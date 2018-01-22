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

import Goal from './Goal'
import NewGoalForm from './components/NewGoalForm'
import { GOAL_DATE_TIME } from './consts/dateTimeConsts'

import type { Goals as GoalsType, TargetType } from './records/GoalRecord'

type Props = {
  classes: Object,
  goals: {
    [userId: string]: GoalsType,
  },
  firebase: any,
  currentUserId: string,
}

type State = {
  name: string,
  targetType: TargetType,
  target: number,
}

const styles = theme => ({
  goalsContainer: {
    marginTop: '16px',
  },
  card: {
    width: '100%',
  },
})

class Goals extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
      target: 30,
      targetType: 'DAYS',
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleToggleDraft = this.handleToggleDraft.bind(this)
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
      completedUntil: moment().valueOf(),
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
      completedUntil: newMoment.valueOf(),
    })
  }

  handleToggleDraft(goalId: string) {
    const { currentUserId, goals, firebase } = this.props

    const edditedGoal = goals[currentUserId][goalId]
    if (edditedGoal.draft) {
      firebase.set(`/goals/${currentUserId}/${goalId}`, {
        ...edditedGoal,
        draft: false,
        completedUntil: edditedGoal.started,
      })
    } else {
      firebase.set(`/goals/${currentUserId}/${goalId}`, {
        ...edditedGoal,
        started: moment().valueOf(),
        draft: true,
        completedUntil: edditedGoal.started,
      })
    }
  }

  render() {
    const { classes, goals, currentUserId } = this.props
    const { name, target, targetType } = this.state

    const formValid = name.length > 0 && target > 0

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2">
            Goals
          </Typography>
          <div className={classes.goalsContainer}>
            {goals &&
              goals[currentUserId] &&
              Object.keys(goals[currentUserId]).map(goalId => (
                <Goal
                  key={goalId}
                  goal={goals[currentUserId][goalId]}
                  onDelete={R.partial(this.handleDelete, [goalId])}
                  onChangeDate={R.partial(this.handleChangeDate, [goalId])}
                  onToggleDraft={R.partial(this.handleToggleDraft, [goalId])}
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
    goals: firebase.data.goals,
    currentUserId: firebase.auth.uid,
  })),
  withStyles(styles),
)(Goals)
