// @flow

import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'

import type { User } from '../../../../../../../common/records/Firebase/User'
import type { Firebase } from '../../../../../../../common/records/Firebase/Firebase'

type Props = {
  firebase: Firebase,
  profile: User,
}

const GOALS_ENUM = {
  EDIT_PROFILE_NAME: 'editProfileName',
  EDIT_PROFILE_PIC: 'editProfilePic',
  CREATE_GOAL: 'createGoal',
}

const GOALS = {
  [GOALS_ENUM.EDIT_PROFILE_NAME]: {
    title: 'Change name',
    checked: profile => profile.userName,
    reward: 50,
    onChange: (firebase, profile) => {
      const oldTasks = profile.tasks

      if (!oldTasks) {
        firebase.updateProfile({
          tasks: [GOALS_ENUM.EDIT_PROFILE_NAME],
          experience: profile.experience ? Number(profile.experience) + 50 : 50,
        })
      } else if (!oldTasks.includes(GOALS_ENUM.EDIT_PROFILE_NAME)) {
        firebase.updateProfile({
          tasks: oldTasks.concat(GOALS_ENUM.EDIT_PROFILE_NAME),
          experience: profile.experience ? Number(profile.experience) + 50 : 50,
        })
      }
    },
  },
  [GOALS_ENUM.EDIT_PROFILE_PIC]: {
    title: 'Change avatar',
    checked: profile => profile.photoURL,
    reward: 50,
    onChange: (firebase, profile) => {
      const oldTasks = profile.tasks

      if (!oldTasks) {
        firebase.updateProfile({
          tasks: [GOALS_ENUM.EDIT_PROFILE_PIC],
          experience: profile.experience ? Number(profile.experience) + 50 : 50,
        })
      } else if (!oldTasks.includes(GOALS_ENUM.EDIT_PROFILE_PIC)) {
        firebase.updateProfile({
          tasks: oldTasks.concat(GOALS_ENUM.EDIT_PROFILE_PIC),
          experience: profile.experience ? Number(profile.experience) + 50 : 50,
        })
      }
    },
  },
}

const Tasks = ({ profile, firebase }: Props) => (
  <div>
    <List>
      {Object.keys(GOALS).map(key => {
        const goal = GOALS[key]
        const done = profile.tasks && profile.tasks.includes(key)

        if (done) {
          return null
        }

        return (
          <ListItem
            key={key}
            dense
            button
            disabled={!goal.checked(profile)}
            onClick={() => goal.onChange(firebase, profile)}
          >
            <ListItemText
              primary={`Task: ${goal.title}`}
              secondary={`Reward: ${goal.reward} XP ${
                goal.checked(profile) ? '(click to collect)' : ''
              }`}
            />
            <ListItemSecondaryAction>
              <Checkbox disabled checked={goal.checked(profile)} />
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  </div>
)

export default Tasks
